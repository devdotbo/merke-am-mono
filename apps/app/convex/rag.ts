import { action } from "./_generated/server";
import { components } from "./_generated/api";
import { RAG } from "@convex-dev/rag";
import { v } from "convex/values";
import { openai } from "@ai-sdk/openai";

// Configure a RAG instance. Adjust embedding model/dimension as needed.
const rag = new RAG(components.rag, {
  textEmbeddingModel: openai.embedding("text-embedding-3-small"),
  embeddingDimension: 1536,
});

export const ragAddText = action({
  args: {
    namespace: v.optional(v.string()),
    text: v.string(),
    key: v.optional(v.string()),
    importance: v.optional(v.number()),
  },
  handler: async (ctx, { namespace, text, key, importance }) => {
    await rag.add(ctx, {
      namespace: namespace ?? "global",
      text,
      key,
      importance,
    });
    return { ok: true } as const;
  },
});

export const ragSearch = action({
  args: {
    namespace: v.optional(v.string()),
    query: v.string(),
    limit: v.optional(v.number()),
    vectorScoreThreshold: v.optional(v.number()),
  },
  handler: async (ctx, { namespace, query, limit, vectorScoreThreshold }) => {
    const res = await rag.search(ctx, {
      namespace: namespace ?? "global",
      query,
      limit: limit ?? 10,
      vectorScoreThreshold,
    });
    return {
      text: res.text,
      results: res.results,
      entries: res.entries,
    };
  },
});


