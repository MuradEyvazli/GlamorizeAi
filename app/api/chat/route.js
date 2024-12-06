import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

export async function POST(req) {
  const { message } = await req.json();

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gemini-1.5-flash', // Use the appropriate model name
      messages: [{ role: 'user', content: message }],
    });

    const aiReply = response.choices[0].message.content;

    return new Response(JSON.stringify({ reply: aiReply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error communicating with AI' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
