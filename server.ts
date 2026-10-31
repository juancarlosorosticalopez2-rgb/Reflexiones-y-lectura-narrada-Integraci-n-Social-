import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client server-side with required headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Cache for synthesized audio to ensure instant replay
const audioCache = new Map<string, string>();

app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore', style = 'Voz serena, reflexiva, dicción clara y elocuente' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const cacheKey = `${voice}:${text.slice(0, 80)}:${text.length}`;
    if (audioCache.has(cacheKey)) {
      return res.json({ audioUrl: audioCache.get(cacheKey), cached: true });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY not configured',
        fallback: 'use_speech_synthesis',
      });
    }

    const validVoices = ['Kore', 'Fenrir', 'Puck', 'Charon', 'Zephyr'];
    const chosenVoice = validVoices.includes(voice) ? voice : 'Kore';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 1800),
              speechMetadata: {
                style: `${style}, en español claro, cadencia reposada de narración de ensayo.`,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio content returned from Gemini TTS model');
    }

    const audioUrl = `data:audio/wav;base64,${base64Audio}`;
    audioCache.set(cacheKey, audioUrl);

    return res.json({ audioUrl, cached: false });
  } catch (err: any) {
    console.error('Gemini TTS error:', err?.message || err);
    return res.status(500).json({
      error: err?.message || 'Error executing speech synthesis',
      fallback: 'use_speech_synthesis',
    });
  }
});

// Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Audio narrator server running on http://localhost:${port}`);
});
