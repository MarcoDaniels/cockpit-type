import { Field, layoutComponents } from './cockpitTypes'
import { cockpitLayoutComponentMap, LayoutChildrenSuffix } from './cockpitLayoutComponentMap'
import * as util from 'util'
import { SchemaTemplate } from '../utils/schemaTemplate'

export type FieldMap = SchemaTemplate & {
    field: Field
}

export type FieldMapOutput = {
    value: string
    template?: string
}

export const fieldMap = ({ prefix, maker, field }: FieldMap): FieldMapOutput => {
    switch (field.type) {
        case 'text':
        case 'markdown':
        case 'code':
        case 'file':
            return { value: `string` }
        case 'boolean':
            return { value: `boolean` }
        case 'select':
            switch (typeof field.options.options) {
                case 'object':
                    return { value: maker.makeUnionStringType(field.options.options.map((t) => t.value)) }
                default:
                    return { value: maker.makeUnionStringType(field.options.options.split(', ')) }
            }
        case 'multipleselect':
            switch (typeof field.options.options) {
                case 'object':
                    return { value: maker.makeUnionStingMultipleType(field.options.options.map((t) => t.value)) }
                default:
                    return { value: maker.makeUnionStingMultipleType(field.options.options.split(', ')) }
            }
        case 'collectionlink':
        case 'collectionlinkselect':
            return {
                value: `${prefix}${maker.makeTypeName(field.options.link)}${field.options.multiple ? `[]` : ``}`,
            }
        case 'moderation':
            return { value: maker.makeUnionStringType(['Unpublished', 'Draft', 'Published']) }
        case 'asset':
            return { value: `AssetType` }
        case 'image':
            return { value: `ImageType` }
        case 'gallery':
            return { value: `GalleryType[]` }
        case 'repeater':
            const fields = field.options.fields.map((f) => ({
                name: `${field.name}${f.label}`,
                type: maker.makeType({
                    name: `${field.name}${f.label}`,
                    fields: [
                        `field: ${util.inspect(f)}`,
                        `value: ${fieldMap({ prefix, maker, field: { ...f, required: true } }).value}`,
                    ],
                }),
            }))

            return {
                value: maker.makeUnionMultipleType(fields.map((t) => t.name)),
                template: fields.map((t) => t.type).join(''),
            }
        case 'layout':
        case 'layout-grid':
            const fieldName = maker.makeTypeName(field.name)

            const components = layoutComponents
                .filter((c) => !field.options.exclude || !field.options.exclude.includes(c))
                .map((component) => ({
                    name: `${prefix}${fieldName}${maker.makeTypeName(component)}`,
                    type: maker.makeType({
                        name: `${prefix}${fieldName}${maker.makeTypeName(component)}`,
                        fields: [
                            `component: '${component}'`,
                            `${cockpitLayoutComponentMap({ component, fieldName, prefix })}`,
                        ],
                    }),
                }))

            const layoutChildrenType = maker.makeType({
                name: `${prefix}${fieldName}${LayoutChildrenSuffix}`,
                fields: [`children: ${maker.makeUnionMultipleType(components.map((t) => t.name))}`],
            })

            return {
                value: maker.makeUnionMultipleType(components.map((t) => t.name)),
                template: `${layoutChildrenType}${components.map((t) => t.type).join('')}`,
            }
        default:
            return { value: `any // TODO: field type "${field.type}" is not being handled` }
    }
}

export type CockpitFieldMapOutput = FieldMapOutput & {
    comment: string | null
    key: string
}

export const cockpitFieldMap = (schema: SchemaTemplate) => (field: Field): CockpitFieldMapOutput => ({
    comment: field.info || null,
    key: `${field.name}${field.required ? `` : `?`}`,
    ...fieldMap({ ...schema, field }),
})
