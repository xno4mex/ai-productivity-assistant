import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function analyzeTask(task: string, context: string) {
  if (!openai) {
    return '🤖 ИИ-анализ недоступен без настройки OpenAI API ключа'
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Ты - ИИ-ассистент для повышения продуктивности. Анализируй задачи и давай практические советы."
      },
      {
        role: "user",
        content: `Задача: ${task}\nКонтекст: ${context}\n\nДай рекомендации по выполнению этой задачи и предложи приоритет (low/medium/high).`
      }
    ],
    max_tokens: 300,
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content || ''
}

export async function generateProductivityTips(userData: any) {
  if (!openai) {
    return '🤖 ИИ-советы недоступны без настройки OpenAI API ключа'
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Ты - эксперт по продуктивности. Анализируй данные пользователя и давай персонализированные советы."
      },
      {
        role: "user",
        content: `Данные пользователя: ${JSON.stringify(userData)}\n\nДай 3-5 практических советов по улучшению продуктивности.`
      }
    ],
    max_tokens: 500,
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content || ''
}

export async function suggestHabits(userGoals: string[]) {
  if (!openai) {
    return '🤖 ИИ-рекомендации привычек недоступны без настройки OpenAI API ключа'
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Ты - тренер по формированию привычек. Предлагай полезные привычки на основе целей пользователя."
      },
      {
        role: "user",
        content: `Цели пользователя: ${userGoals.join(', ')}\n\nПредложи 3-5 полезных привычек, которые помогут достичь этих целей.`
      }
    ],
    max_tokens: 400,
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content || ''
}
