import { OpenAI } from 'openai';

const key = import.meta.env.VITE_APP_OPEN_API_KEY;
const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });

export async function getQuizQuestion() {
  const prompt = 'Generate a multiple-choice question with four options, where one is correct and three are incorrect.';
  
  const response = await openai.completions.create({
    model: 'text-davinci-002',
    prompt: prompt,
    max_tokens: 100,
  });

  return response['choices'][0]['text'];
}



