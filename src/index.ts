import {NodePlopAPI} from 'plop'
import {cockpitClient} from "./cockpit/cockpitClient"
import {schemaTemplate} from "./typescript/schemaTemplate"

export type Answers = {
    filterBy: 'collection' | 'group' | 'none'
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
                type: 'list',
                name: 'filterBy',
                message: 'Filter by:',
                choices: [
                    {name: 'None', value: 'none'},
                    {name: 'Collection', value: 'collection'},
                    {name: 'Group', value: 'group'},
                ],
            },
            {
                type: 'input',
                name: 'filter',
                message: 'Filter Name:',
                when: (answers: any) => answers.filterBy !== 'none'
            },
            {
                type: 'input',
                name: 'prefix',
                message: 'Prefix:'
            }
        ],
        actions: [
            {
                type: 'add',
                path: '{{path}}',
                templateFile: 'template/typescript.hbs',
                force: true,
                transform: async (template: string, answers: Answers) => {
                    switch (answers.filterBy) {
                        case "collection":
                            const collectionResponse = await cockpitClient.collectionSchema(answers.filter)
                            if (collectionResponse.type === 'success')
                                template += schemaTemplate(answers.prefix)(collectionResponse.data)

                            return template
                        default:
                            const response = await cockpitClient.collections(answers.filter)
                            if (response.type === 'success')
                                response.data.map(schemaTemplate(answers.prefix)).map(schemaTemplate => template += schemaTemplate)

                            return template
                    }
                }
            }
        ]
    })
