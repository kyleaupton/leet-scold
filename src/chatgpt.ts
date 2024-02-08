import OpenAI from 'openai'
import 'dotenv/config'

export const generateHelpfulReminder = async (): Promise<string> => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  const openai = new OpenAI()

  const res = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: 'Can you write a mean and sarcastic text message reminding me to do my daily leetcode problem? The message should be so mean and condescending I want to do it to spite you. It should also be shorter, no more than 1000 characters.'
      }
    ],
    model: 'gpt-3.5-turbo'
  })

  const message = res.choices[0].message.content
  if (!message) {
    throw Error('Could not get message')
  }

  return message
}
