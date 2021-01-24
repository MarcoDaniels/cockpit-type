import { FieldSchema } from '../cockpit/cockpitTypes'
import { cockpitFieldMap } from '../cockpit/cockpitFieldMap'
import { MakerType } from '../maker/MakerType'

export type SchemaTemplate = {
    maker: MakerType
    prefix?: string
}

export const schemaTemplate = ({ prefix, maker }: SchemaTemplate) => (schema: FieldSchema) => {
    let template = ''

    const entryTypeName = `${prefix}${maker.makeTypeName(schema.label ? schema.label.replace(' ', '') : schema.name)}`

    const entryItems = schema.fields.map(cockpitFieldMap({ prefix, maker })).map((field) => {
        if (field.template) template += field.template
        return maker.makeTypeEntry(field)
    })

    // create main entry type
    template += maker.makeType({
        name: `${entryTypeName}`,
        fields: entryItems,
        description: schema.description,
    })

    // create main entry type data
    template += maker.makeType({
        name: `${entryTypeName}Data`,
        fields: [`entries: ${entryTypeName}[]`],
    })

    return template
}
