import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { isVexAIConfigured } from "@/lib/env";
import {
  buildVexAIResponse,
  VEX_AI_SYSTEM_PROMPT,
} from "@/lib/vex-ai/responses";

export const maxDuration = 30;

/**
 * Vex AI streaming endpoint — uses OpenAI when configured, smart mock fallback otherwise.
 * POST body: { messages: { role: string; content: string }[], context?: object }
 */
export async function POST(req: Request) {
  const { userId } = await auth();
  const body = await req.json();
  const messages = body.messages ?? [];
  const context = body.context ?? {};
  const lastUserMessage =
    [...messages].reverse().find((m: { role: string }) => m.role === "user")
      ?.content ?? "";

  // Mock/fallback when OpenAI not configured
  if (!isVexAIConfigured()) {
    const response = buildVexAIResponse(lastUserMessage, {
      userName: context.userName,
      data: context.data,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for (const char of response) {
          controller.enqueue(
            encoder.encode(`0:${JSON.stringify(char)}\n`)
          );
          await new Promise((r) => setTimeout(r, 12));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: VEX_AI_SYSTEM_PROMPT,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    maxOutputTokens: 500,
  });

  return result.toTextStreamResponse();
}
