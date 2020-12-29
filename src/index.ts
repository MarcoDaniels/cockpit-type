import {NodePlopAPI} from 'plop'
import {cockpitClient} from "./cockpit/cockpitClient"
import {createType} from "./typescript/createType"
import {createTypeName} from "./typescript/createTypeName"
import {createTypeEntry} from "./typescript/createTypeEntry"
import {cockpitFieldMap} from "./cockpit/cockpitFieldMap"

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
                templateFile: 'typescript/template.ts',
                force: true,
                transform: async (template: string, answers: Answers) => {
                    const response = await cockpitClient.collections(answers.group)
                    switch (response.type) {
                        case "success":
                            response.data.map(schema => {
                                const entryItems = schema.fields
                                    .map(cockpitFieldMap)
                                    .map(field => {
                                        if (field.template) template += field.template
                                        return createTypeEntry(field)
                                    })

                                const entryTypeName = createTypeName(schema.label ?
                                    schema.label.replace(' ', '') : schema.name)

                                template += createType({
                                    name: entryTypeName,
                                    fields: entryItems,
                                    description: schema.description,
                                })

                                template += createType({
                                    name: `${entryTypeName}Data`,
                                    fields: [`entries: ${entryTypeName}[]`]
                                })
                            })

                            return template
                    }
                    // TODO: prettier on writing
                    return ''
                }
            }
        ],
    })

}