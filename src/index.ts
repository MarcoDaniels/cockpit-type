import {NodePlopAPI} from 'plop'
import {collectionSchema} from "./client/client"

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
                // TODO: can path be global
                path: '../delete-me.ts',
                templateFile: 'templates/TypeScript.ts',
                force: true,
                transform: async (template: string, data: Answers) => {
                    const collection = await collectionSchema({id: data.collection})

                    const items = collection.fields.map(field => {
                        return `${field.name}${field.required ? `` : `?`}: string`
                    })

                    const interfaceName = collection.label ?
                        collection.label.replace(' ', '') : collection.name

                    const result = `export interface ${interfaceName} { \n  ${items.join('\n  ')}\n}`

                    return `${template}\n${result}`
                }
            }
        ],
    })

}