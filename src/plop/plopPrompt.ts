import { PlopGenerator } from 'plop'
import { filterByReg } from '../utils/filterBy'
import { LanguageType } from '../plopfile'

export type PlopPromptAnswers = {
    filter: string
    prefix?: string
}

export const plopPrompt = (lang: LanguageType): PlopGenerator['prompts'] => [
    {
        type: 'input',
        name: 'path',
        message: 'Destination File:',
        validate: (path: string) => {
            switch (lang) {
                case 'typescript':
                    if (/(.*\.(?:d.ts|ts))/i.test(path)) return true

                    return 'Please provide a valid TypeScript file path'
                case 'scala':
                    if (/(.*\.(?:scala))/i.test(path)) return true

                    return 'Please provide a valid Scala file path'
            }
        },
    },
    {
        type: 'input',
        name: 'prefix',
        message: 'Prefix all your types with:',
    },
    {
        type: 'input',
        name: 'filter',
        message: 'Filter Types by (filterItem=filterName):',
        validate: (filter: string) => {
            if (!filter || filterByReg.test(filter)) return true

            return 'Please provide one of the following filterItem (collection|singleton|group)'
        },
    },
]
