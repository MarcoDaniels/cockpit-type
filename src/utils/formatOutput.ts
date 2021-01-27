import { PlopPrompt } from '../plop/plopPrompt'
import { format, resolveConfig } from 'prettier'

export const formatOutput = async (input: string, language: PlopPrompt['language']): Promise<string> => {
    switch (language) {
        case 'typescript': {
            const prettierConfig = await resolveConfig(process.cwd())
            if (prettierConfig) {
                return format(input, { parser: 'babel-ts', ...prettierConfig })
            }

            return format(input, {
                parser: 'babel-ts',
                semi: false,
                trailingComma: 'all',
                singleQuote: true,
                printWidth: 120,
                tabWidth: 4,
                arrowParens: 'always',
            })
        }
        case 'scala':
            return input
    }
}
