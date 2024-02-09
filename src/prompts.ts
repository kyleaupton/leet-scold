import { ChatCompletionFunctionMessageParam } from 'openai'

const prompts = {
    default: (problem: string): ChatCompletionFunctionMessageParam => {
        return {
            role: 'user',
            content: `Today's daily problem is the following in HTML format. Incorporate the problem into your message. ${problem}.`
        }
    }
}

export { prompts }
