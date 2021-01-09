import { format } from 'prettier'

export const formatPrettier = (input: string) =>
    format(input, {
        parser: 'babel-ts',
        semi: false,
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 120,
        tabWidth: 4,
        arrowParens: 'always',
    })
