import { PlopPrompt } from './plopPrompt'

export const plopValidateAnswers = (answers: PlopPrompt): string | boolean => {
    switch (answers.language) {
        case 'typescript':
            if (/(.*\.(?:d.ts|ts))/i.test(answers.path)) return true
            return 'Please provide a valid TypeScript file path'
        case 'scala':
            if (!/(.*\.(?:scala))/i.test(answers.path)) return true
            return 'Please provide a valid Scala file path'
    }
}
