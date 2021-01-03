import {FieldSchema} from "../cockpit/cockpitTypes"
import {cockpitFieldMap} from "../cockpit/cockpitFieldMap"
import {createTypeEntry} from "./createTypeEntry"
import {createTypeName} from "./createTypeName"
import {createType} from "./createType"

export const schemaTemplate = (schema: FieldSchema) => {
    let template = ''

    const entryItems = schema.fields
        .map(cockpitFieldMap)
        .map(field => {
            if (field.template) template += field.template
            return createTypeEntry(field)
        })

    const entryTypeName = createTypeName(schema.label ?
        schema.label.replace(' ', '') : schema.name)

    // create main entry type
    template += createType({
        name: entryTypeName,
        fields: entryItems,
        description: schema.description,
    })

    // create main entry type data
    template += createType({
        name: `${entryTypeName}Data`,
        fields: [`entries: ${entryTypeName}[]`]
    })

    return template
}