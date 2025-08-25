import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { components } from "./_generated/api";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const supportAgent = new Agent(components.agent, {
	name: "Support Agent",
	chat: openai.chat("gpt-4o-mini"),
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
		if (threadId) {
			const { thread } = await supportAgent.continueThread(ctx, { threadId });
			const result = await thread.generateText({ prompt });
			return { text: result.text, threadId };
		}
		const userId = await getAuthUserId(ctx);
		const { threadId: newThreadId } = await supportAgent.createThread(ctx, { userId: userId ?? undefined });
		const { thread } = await supportAgent.continueThread(ctx, { threadId: newThreadId });
		const result = await thread.generateText({ prompt });
		return { text: result.text, threadId: newThreadId };
	},
});


