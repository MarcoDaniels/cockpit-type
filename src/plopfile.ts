import { NodePlopAPI } from 'plop'
import { plopPrompt } from './plop/plopPrompt'
import { plopAddTransform } from './plop/plopAddTransform'
import { formatPrettier } from './utils/formatPrettier'

export type LanguageType = 'typescript' | 'scala'

export default (plop: NodePlopAPI) => {
    plop.setGenerator(`typescript`, {
        description: 'Generates TypeScript types for Cockpit',
        prompts: plopPrompt('typescript'),
        actions: [
            {
                type: 'add',
                path: `${process.cwd()}/{{path}}`,
                templateFile: 'template/typescript.ts',
                force: true,
                transform: plopAddTransform({ language: 'typescript', formatOutput: formatPrettier }),
            },
        ],
    })

    plop.setGenerator(`scala`, {
        description: 'Generates Scala case class types for Cockpit',
        prompts: plopPrompt('scala'),
        actions: [
            {
                type: 'add',
                path: `${process.cwd()}/{{path}}`,
                templateFile: 'template/scala.scala',
                force: true,
            },
        ],
    })
}
