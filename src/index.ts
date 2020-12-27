import {NodePlopAPI} from 'plop'
import {cockpitClient} from "./cockpit/cockpitClient"
import {mapTypeName} from "./mappers/mapTypeName"
import {createType} from "./typescript/createType"
import {createTypeField} from "./typescript/createTypeField"

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
                    const response = await cockpitClient.collections()

                    switch (response.type) {
                        case "success":
                            let output = ``

                            response.data.map(schema => {
                                const entryItems = schema.fields.map(createTypeField)

                                const entryTypeName = mapTypeName(schema.label ?
                                    schema.label.replace(' ', '') : schema.name)

                                output += createType({
                                    name: `${entryTypeName}Entry`,
                                    fields: entryItems,
                                    description: schema.description,
                                })

                                output += createType({
                                    name: entryTypeName,
                                    fields: [`entries: ${entryTypeName}Entry[]`]
                                })
                            })

                            return `${template}${output}`
                    }
                    // TODO: prettier on writing
                    return ''
                }
            }
        ],
    })

}