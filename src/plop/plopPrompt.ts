import { PlopGenerator } from 'plop'
import { filterByReg } from './plopFilterBy'

export type PlopPrompt = {
    language: 'typescript' | 'scala'
    path: string
    filter: string
    prefix?: string
}

export const plopPrompt = (): PlopGenerator['prompts'] => [
    {
        type: 'list',
        name: 'language',
        message: 'Select programing language:',
        choices: [
            { name: 'TypeScript', value: 'typescript' },
            { name: 'Scala', value: 'scala' },
        ],
    },
    {
        type: 'input',
        name: 'path',
        message: 'Destination File:',
        validate: (path: string, answers: PlopPrompt) => {
            switch (answers.language) {
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
        validate: (prefix: string) => {
            if (/\s/.test(prefix)) return 'Prefix cannot include space.'
            return true
        },
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
