import { openai } from "../config/openAI-config.ts";

// export async function getQuizQuestion() {
//     const prompt = 'Generate a multiple-choice question with four options, where one is correct and three are incorrect.';
    
//     const response = await openai.createCompletion({
//       engine: 'text-davinci-002',
//       prompt: prompt,
//       max_tokens: 100,
//     });
  
//     return response['choices'][0]['text'];
//   }
  

async function getAIQuizQuestion(prompt) {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `${OPEN_AI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt },
          ],
        })
      }
    );
  
    const data = await response.json();
    const message = data.choices[0].message;
    return message.content;
  }

  async function getAIQuizAnswer(prompt) {
    const response = await fetch(
      'https://api.openai.com/v1/answers',
      {
        method: 'POST',
        headers: {
          'Authorization': `${OPEN_AI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'curie',
          question: prompt,
          examples: [
            {
              question: 'What is the capital of France?',
              answer: 'Paris'
            },
            {
              question: 'What is the capital of Germany?',
              answer: 'Berlin'
            },
            {
              question: 'What is the capital of Russia?',
              answer: 'Moscow'
            },
            {
              question: 'What is the capital of the USA?',
              answer: 'Washington, D.C.'
            },
          ]
        })
      }
    );

    const data = await response.json();
    const answer = data.answers[0].answer;
    return answer;
  }