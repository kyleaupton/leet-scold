import OpenAI from 'openai'
import 'dotenv/config'

export const generateHelpfulReminder = async (): Promise<string> => {
  if (process.env.OPENAI_API_KEY === undefined) {
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
        content: 'Can you write a mean and sarcastic message reminding me to do my daily leetcode problem? The message should be so mean that it makes me want to do it just to spite you.'
      }
    ],
    model: 'gpt-3.5-turbo'
  })

  const message = res.choices[0].message.content
  if (message === null) {
    throw Error('Could not get message')
  }

  return message
}
