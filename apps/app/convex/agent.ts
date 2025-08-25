import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { components } from "./_generated/api";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { RAG } from "@convex-dev/rag";

export const supportAgent = new Agent(components.agent, {
	name: "Support Agent",
	languageModel: openai.chat("gpt-4o-mini") as any,
});

// RAG instance for semantic search
const rag = new RAG((components as any).rag, {
	textEmbeddingModel: openai.embedding("text-embedding-3-small"),
	embeddingDimension: 1536,
});

export const ensureThread = action({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		const { threadId } = await supportAgent.createThread(ctx, {
			userId: userId ?? undefined,
			title: "Welcome",
			summary: "Initial thread",
		});
		return { threadId };
	},
});

export const askAgent = action({
	args: { prompt: v.string(), threadId: v.optional(v.string()) },
	handler: async (ctx, { prompt, threadId }) => {
		const userId = await getAuthUserId(ctx);
		const namespace = userId ?? "global";
		const context = await rag.search(ctx, {
			namespace,
			query: prompt,
			limit: 10,
		});

		if (threadId) {
			const { thread } = await supportAgent.continueThread(ctx, { threadId });
			const result = await thread.generateText({
				prompt: `# Context:\n\n${context.text}\n\n---\n\n# Question:\n\n"""${prompt}"""`,
			});
			return { text: result.text, threadId };
		}

		const { threadId: newThreadId } = await supportAgent.createThread(ctx, { userId: userId ?? undefined });
		const { thread } = await supportAgent.continueThread(ctx, { threadId: newThreadId });
		const result = await thread.generateText({
			prompt: `# Context:\n\n${context.text}\n\n---\n\n# Question:\n\n"""${prompt}"""`,
		});
		return { text: result.text, threadId: newThreadId };
	},
});


