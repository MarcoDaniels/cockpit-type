import {NodePlopAPI} from 'plop'
import {cockpitClient} from "./cockpit/cockpitClient"
import {mapFieldType} from "./mapFieldType"

export type Answers = {
    collection: string
    group: string
}

export default (plop: NodePlopAPI) => {
    plop.setGenerator(`generate`, {
        description: 'Generates types for Cockpit',
        prompts: [
            {
                type: 'input',
                name: 'collection',
                message: 'Collection Name:',
            },
            {
                type: 'input',
                name: 'group',
                message: 'Group Name:',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '../debug.ts', // TODO: can path be global
                templateFile: 'templates/TypeScript.ts',
                force: true,
                transform: async (template: string, answers: Answers) => {
                    const response = await cockpitClient.collections(answers.group)
                    switch (response.type) {
                        case "success":
                            const result = response.data.map(collection => {
                                const items = collection.fields.map(field => {
                                    return `${field.name}${field.required ? `` : `?`}: ${mapFieldType(field)}`
                                })

                                const interfaceName = collection.label ?
                                    collection.label.replace(' ', '') : collection.name

                                const result = [
                                    `export type ${interfaceName}Entry = {`,
                                    items.join(`\n`),
                                    `}`,
                                    ``,
                                    `export type ${interfaceName} = {`,
                                    `entries: ${interfaceName}Entry[]`,
                                    `}`
                                ]

                                return result.join(`\n`)
                            })
                            // TODO: fix typings
                            return `${template}\n${result.join(`\n`)}\n`
                    }
                    // TODO: prettier on writing
                    return ''
                }
            }
        ],
    })

}