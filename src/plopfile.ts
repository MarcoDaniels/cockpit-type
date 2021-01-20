import { NodePlopAPI } from 'plop'
import { cockpitClient } from './cockpit/cockpitClient'
import { schemaTemplate } from './typescript/schemaTemplate'
import { filterBy, filterByReg } from './utils/filterBy'
import { formatPrettier } from './utils/formatPrettier'

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
                templateFile: 'template/typescript.ts',
                force: true,
                transform: async (template: string, answers: Answers) => {
                    const filters = filterBy(answers.filter)
                    if (filters) {
                        switch (filters.filterBy) {
                            case 'collection':
                                const collection = await cockpitClient.collectionSchema(filters.filterName)
                                if (collection.type === 'success') {
                                    template += schemaTemplate(answers.prefix)(collection.data)
                                }

                                return formatPrettier(template)
                            case 'singleton':
                                const singleton = await cockpitClient.singletonSchema(filters.filterName)
                                if (singleton.type === 'success') {
                                    template += schemaTemplate(answers.prefix)(singleton.data)
                                }

                                return formatPrettier(template)
                            case 'group':
                                const collectionResponse = await cockpitClient.collections(filters.filterName)
                                const singletonResponse = await cockpitClient.singletons(filters.filterName)
                                if (collectionResponse.type === 'success' && singletonResponse.type === 'success') {
                                    collectionResponse.data
                                        .concat(singletonResponse.data)
                                        .map(schemaTemplate(answers.prefix))
                                        .map((schemaTemplate) => (template += schemaTemplate))
                                }

                                return formatPrettier(template)
                        }
                    }

                    const collectionResponse = await cockpitClient.collections()
                    const singletonResponse = await cockpitClient.singletons()
                    if (collectionResponse.type === 'success' && singletonResponse.type === 'success') {
                        collectionResponse.data
                            .concat(singletonResponse.data)
                            .map(schemaTemplate(answers.prefix))
                            .map((schemaTemplate) => (template += schemaTemplate))
                    }

                    return formatPrettier(template)
                },
            },
        ],
    })
