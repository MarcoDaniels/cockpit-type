import { PlopGenerator } from 'plop'
import { plopPromptValidate } from './plopPromptValidate'

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
        validate: plopPromptValidate.path,
    },
    {
        type: 'input',
        name: 'prefix',
        message: 'Prefix all your types with:',
        validate: plopPromptValidate.prefix,
    },
    {
        type: 'input',
        name: 'filter',
        message: 'Filter Types by (filterItem=filterName):',
        validate: plopPromptValidate.filter,
    },
]
