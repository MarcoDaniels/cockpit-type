import { FieldSchema } from './cockpitTypes'
import { cockpitMapperField } from './mapper/cockpitMapperField'
import { MakerType } from '../maker/makerTypes'

export type CockpitSchemaTemplate = {
    maker: MakerType
    prefix?: string
}

export const cockpitSchemaTemplate = ({ prefix, maker }: CockpitSchemaTemplate) => (schema: FieldSchema) => {
    let template = ''

    const entryTypeName = `${prefix}${maker.makeTypeName(schema.label ? schema.label.replace(' ', '') : schema.name)}`

    const entryItems = schema.fields.map(cockpitMapperField({ prefix, maker })).map((field) => {
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
        fields: [`entries: ${maker.makeMultiple(entryTypeName)}`],
    })

    return template
}
