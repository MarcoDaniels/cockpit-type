import { plopValidateLangFile } from './plopValidateLangFile'
import { PlopPrompt } from './plopPrompt'
import { filterByReg } from './plopFilterBy'

export type PlopPromptValidate = string | boolean

export const plopPromptValidate = {
    path: (path: string, answers?: PlopPrompt): PlopPromptValidate => {
        if (!answers) return true // when bypassing prompt no answer is available
        return plopValidateLangFile({ ...answers, path })
    },
    prefix: (prefix: string): PlopPromptValidate => {
        if (/\s/.test(prefix)) return 'Prefix cannot include space.'
        return true
    },
    filter: (filter: string): PlopPromptValidate => {
        if (!filter || filterByReg.test(filter)) return true
        return 'Please provide one of the following filterItem (collection|singleton|group)'
    },
}
