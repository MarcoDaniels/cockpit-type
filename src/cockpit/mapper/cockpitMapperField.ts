import { Field, layoutComponents } from '../cockpitTypes'
import { cockpitMapperLayout, LayoutChildrenSuffix } from './cockpitMapperLayout'
import { CockpitSchemaTemplate } from '../cockpitSchemaTemplate'

export type MapField = CockpitSchemaTemplate & {
    field: Field
}

export type MapFieldOutput = {
    value: string
    template?: string
}

export const mapField = ({ prefix, maker, field }: MapField): MapFieldOutput => {
    switch (field.type) {
        case 'text':
        case 'markdown':
        case 'code':
        case 'file':
            return { value: maker.makeString() }
        case 'boolean':
            return { value: maker.makeBoolean() }
        case 'collectionlink':
        case 'collectionlinkselect': {
            const linkType = maker.makeTypeName(field.options.link)
            return {
                value: `${prefix}${field.options.multiple ? maker.makeMultiple(linkType) : linkType}`,
            }
        }
        case 'select':
            switch (typeof field.options.options) {
                case 'object':
                    return { value: maker.makeUnionString(field.options.options.map((t) => t.value)) }
                default:
                    return { value: maker.makeUnionString(field.options.options.split(', ')) }
            }
        case 'multipleselect':
            switch (typeof field.options.options) {
                case 'object':
                    return { value: maker.makeUnionStringMultiple(field.options.options.map((t) => t.value)) }
                default:
                    return { value: maker.makeUnionStringMultiple(field.options.options.split(', ')) }
            }
        case 'moderation':
            return { value: maker.makeUnionString(['Unpublished', 'Draft', 'Published']) }
        case 'asset':
            return { value: `AssetType` }
        case 'image':
            return { value: `ImageType` }
        case 'gallery':
            return { value: `${maker.makeMultiple(`GalleryType`)}` }
        case 'repeater': {
            const fields = field.options.fields.map((f) => ({
                name: `${field.name}${f.label}`,
                type: maker.makeType({
                    name: `${field.name}${f.label}`,
                    fields: [`field: ${maker.makeObject(f)}`, `value: ${mapField({ prefix, maker, field: f }).value}`],
                }),
            }))

            return {
                value: maker.makeUnionMultiple(fields.map((t) => t.name)),
                template: fields.map((t) => t.type).join(''),
            }
        }
        case 'layout':
        case 'layout-grid': {
            const fieldName = maker.makeTypeName(field.name)

            const components = layoutComponents
                .filter((c) => !field.options.exclude || !field.options.exclude.includes(c))
                .map((component) => ({
                    name: `${prefix}${fieldName}${maker.makeTypeName(component)}`,
                    type: maker.makeType({
                        name: `${prefix}${fieldName}${maker.makeTypeName(component)}`,
                        fields: [
                            `component: ${maker.makeLiteral(component)}`,
                            `${cockpitMapperLayout({ component, fieldName, prefix, maker })}`,
                        ],
                    }),
                }))

            const layoutChildrenType = maker.makeType({
                name: `${prefix}${fieldName}${LayoutChildrenSuffix}`,
                fields: [`children: ${maker.makeUnionMultiple(components.map((t) => t.name))}`],
            })

            return {
                value: maker.makeUnionMultiple(components.map((t) => t.name)),
                template: `${layoutChildrenType}${components.map((t) => t.type).join('')}`,
            }
        }
        default:
            return { value: maker.makeAny(field.type) }
    }
}

export type CockpitMapperFieldOutput = MapFieldOutput & {
    comment: string | null
    required: boolean
    key: string
}

export const cockpitMapperField = (schema: CockpitSchemaTemplate) => (field: Field): CockpitMapperFieldOutput => ({
    comment: field.info || null,
    required: field.required,
    key: field.name,
    ...mapField({ ...schema, field }),
})
