import { NodePlopAPI } from 'plop'
import { cockpitClient } from './cockpit/cockpitClient'
import { schemaTemplate } from './typescript/schemaTemplate'
import { format, resolveConfig } from 'prettier'
import { filterBy, filterByReg } from './utils/filterBy'

export type Answers = {
    filter: string
    prefix?: string
}

export default (plop: NodePlopAPI) =>
    plop.setGenerator(`generate`, {
        description: 'Generates types for Cockpit',
        prompts: [
            {
                type: 'input',
                name: 'path',
                message: 'Destination File:',
                validate: (path: string) => {
                    if (/(.*\.(?:d.ts|ts))/i.test(path)) return true

                    return 'Please provide a valid TypeScript file path'
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
        ],
        actions: [
            {
                type: 'add',
                path: `${process.cwd()}/{{path}}`,
                templateFile: 'template/typescript.hbs',
                force: true,
                transform: async (template: string, answers: Answers) => {
                    // TODO: make response generic
                    const filters = filterBy(answers.filter)
                    if (filters) {
                        switch (filters.filterBy) {
                            case 'collection':
                                const collectionResponse = await cockpitClient.collectionSchema(filters.filterName)
                                if (collectionResponse.type === 'success')
                                    template += schemaTemplate(answers.prefix)(collectionResponse.data)

                                return format(template, { parser: 'babel-ts', ...resolveConfig.sync(`.prettierrc`) })
                            default:
                                const response = await cockpitClient.collections()
                                if (response.type === 'success')
                                    response.data
                                        .map(schemaTemplate(answers.prefix))
                                        .map((schemaTemplate) => (template += schemaTemplate))

                                return format(template, { parser: 'babel-ts', ...resolveConfig.sync(`.prettierrc`) })
                        }
                    }

                    const response = await cockpitClient.collections(answers.filter)
                    if (response.type === 'success')
                        response.data
                            .map(schemaTemplate(answers.prefix))
                            .map((schemaTemplate) => (template += schemaTemplate))

                    return format(template, { parser: 'babel-ts', ...resolveConfig.sync(`.prettierrc`) })
                },
            },
        ],
    })
