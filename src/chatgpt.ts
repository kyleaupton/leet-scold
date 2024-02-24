import OpenAI from 'openai'
import { config } from 'dotenv'
import { fetchDailyProblem } from './leetcode.js'
import { logger } from './logger.js'
import { envPath } from './utils.js'
import { prompts } from './prompts.js'

config({ path: envPath() })

export const generateHelpfulReminder = async (): Promise<string> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  const openai = new OpenAI()
  const model = process.env.CHAT_MODEL ?? 'gpt-4'

  const problemText = await fetchDailyProblem()
  const prompt = prompts.default(problemText)

  const res = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a sarcastic assistant. Your role is to provide not so nice reminders to users who have not done their daily leetcode problem.'
      },
      prompt
    ],
    model
  })

  const message = res.choices[0].message.content
  if (!message) {
    throw Error('Could not get message')
  }

  logger.info(`Generated message using ${model}`)

  return message
}
