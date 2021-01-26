import { NodePlopAPI, PlopGenerator } from 'plop'
import { plopPrompt } from './plop/plopPrompt'
import { plopTransform } from './plop/plopTransform'

export default (plop: NodePlopAPI): PlopGenerator =>
    plop.setGenerator(`generate`, {
        description: 'Generates types for Cockpit',
        prompts: plopPrompt(),
        actions: [
            {
                type: 'add',
                path: `${process.cwd()}/{{path}}`,
                templateFile: 'template/template.{{language}}',
                force: true,
                transform: plopTransform,
            },
        ],
    })
