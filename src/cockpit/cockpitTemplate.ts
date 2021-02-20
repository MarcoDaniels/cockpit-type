import { FieldSchema } from './cockpitTypes'
import { cockpitMapperField } from './mapper/cockpitMapperField'
import { MakerType } from '../maker/makerTypes'

export type CockpitTemplate = {
    maker: MakerType
    prefix?: string
}

export type CockpitTemplateReturn = {
    accTemplate: string
    syncType: string
}

export const cockpitTemplate = ({ prefix, maker }: CockpitTemplate) => (schema: FieldSchema): CockpitTemplateReturn => {
    let template = ''

    const entryTypeName = `${prefix}${maker.makeTypeName(schema.name)}`

    const entryItems = schema.fields
        .map(cockpitMapperField({ prefix, maker, baseTypeName: schema.name }))
        .map((field) => {
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
        fields: [
            maker.makeTypeEntry({
                key: `entries`,
                value: maker.makeMultiple(entryTypeName),
                required: true,
                comment: null,
            }),
            maker.makeTypeEntry({
                key: `total`,
                value: maker.makeNumber(),
                required: true,
                comment: null,
            }),
        ],
    })

    return {
        accTemplate: template,
        syncType: `${maker.makeTypeEntry({
            key: schema.name,
            value: `${entryTypeName}Data`,
            required: true,
            comment: null,
        })}`,
    }
}
