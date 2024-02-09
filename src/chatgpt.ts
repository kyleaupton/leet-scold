import OpenAI from 'openai'
import { config } from 'dotenv'
import { fetchDailyProblem } from './leeetcode.js'
import { logger } from './logger.js'
import { envPath } from './utils.js'

config({ path: envPath() })

export const generateHelpfulReminder = async (): Promise<string> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  const openai = new OpenAI()
  const model = process.env.CHAT_MODEL ?? 'gpt-3.5-turbo'

  const problemText = await fetchDailyProblem()

  const res = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Deliver a mean, vulgar, and sarcastic message reminding a user to do their daily leetcode problem. Use curse words. The message should be so mean and condescending that the user wants to do it to spite you. It should be no more than 1000 characters. Below is the daily leetcode problem provided in HTML format. Incorporate the problem into your message'
      },
      {
        role: 'user',
        content: `Today's daily problem is ${problemText}. Explain the problem condescendlingly to a 5 year old. Ignore constraints.`
      }
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
