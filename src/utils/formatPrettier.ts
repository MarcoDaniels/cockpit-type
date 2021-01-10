import { format, resolveConfig } from 'prettier'

export const formatPrettier = async (input: string) => {
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
