import {NodePlopAPI} from 'plop'
import {collectionSchema} from "./client/client"
import {mapFieldType} from "./mapFieldType"

export type Answers = {
    collection: string
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
        ],
        actions: [
            {
                type: 'add',
                path: '../debug.ts', // TODO: can path be global
                templateFile: 'templates/TypeScript.ts',
                force: true,
                transform: async (template: string, data: Answers) => {
                    const collection = await collectionSchema({id: data.collection})

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

                    // TODO: prettier after writing
                    return `${template}\n${result.join(`\n`)}\n`
                }
            }
        ],
    })

}