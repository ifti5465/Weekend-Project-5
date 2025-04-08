// app/api/chat/route.ts
/** @type {import('next').NextConfig['experimental']['runtime']} */
export const runtime = 'nodejs';

import { streamText } from "ai";
import axios from "axios";
import { loadEnvConfig } from '@next/env';

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Access the API key from environment variables
const VENICE_AI_API_KEY = process.env.VENICE_AI_API_KEY;
// Use the Chat Completions Endpoint
const VENICE_AI_API_ENDPOINT = "https://api.venice.ai/api/v1/chat/completions";

export async function POST(req: Request) {
  console.log("VENICE_AI_API_KEY:", VENICE_AI_API_KEY); // Debugging log

  if (!VENICE_AI_API_KEY || VENICE_AI_API_ENDPOINT === "https://api.veniceai.com/api/v1/chat/completions") {
    console.error("Venice AI API key or endpoint not configured.");
    return new Response("Venice AI API not configured. Please update the endpoint in /app/api/chat/route.ts", { status: 500 });
  }

  const { messages, genre, tone } = await req.json();
  const lastUserMessage = messages.filter((msg: { role: string }) => msg.role === "user").pop()?.content;

  if (!lastUserMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const requestBody = {
    messages: [
      {
        role: "user",
        content: `Generate a ${genre} story in a ${tone} tone based on: ${lastUserMessage}`,
      },
    ],
    model: "default", // Replace with the specific model ID if Venice AI requires it
    stream: true,     // Check Venice AI documentation for streaming support
    max_tokens: 500,  // Example parameter - adjust based on Venice AI's API
    // Add other parameters as needed based on Venice AI's API (e.g., temperature)
  };

  try {
    const response = await axios.post(
      VENICE_AI_API_ENDPOINT,
      requestBody,
      {
        headers: {
          "Authorization": `Bearer ${VENICE_AI_API_KEY}`, // Assuming Bearer token authentication
          "Content-Type": "application/json",
        },
        responseType: "stream", // Ensure this line is present
      }
    );

    if (response.data) {
      return new Response(response.data as ReadableStream); // Ensure this is the return statement
    } else {
      console.error("Empty response from Venice AI");
      return new Response("Error: Empty response from Venice AI", { status: 500 });
    }
  } catch (error: any) {
    console.error("Venice AI API Error:", error.response?.data || error.message);
    return new Response(
      `Error calling Venice AI: ${error.response?.data || error.message}`,
      { status: 500 }
    );
  }
}

