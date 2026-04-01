import type { NextApiRequest, NextApiResponse } from 'next';
import Groq from 'groq-sdk';
import { RESUME_CONTENT } from '@/lib/resume';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant representing Kylla as a portfolio assistant.
Answer questions about their background, skills, and experience based on this resume:

${RESUME_CONTENT}

Be concise, professional, and friendly. Only answer questions related to their professional background.`;

type Message = { role: 'user' | 'assistant'; content: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body as { messages: Message[] };

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content ?? 'No response received.';
    return res.status(200).json({ message });
  } catch (err) {
    console.error('Groq API error:', err);
    return res.status(500).json({ error: 'Failed to get response from AI.' });
  }
}
