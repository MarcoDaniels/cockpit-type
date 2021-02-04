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
        case 'textarea':
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
            return { value: `${prefix}AssetType` }
        case 'image':
            return { value: `${prefix}ImageType` }
        case 'gallery':
            return { value: `${maker.makeMultiple(`${prefix}GalleryType`)}` }
        case 'repeater': {
            const fields = field.options.fields.map((f) => {
                const fieldName = maker.makeTypeName(`${field.name}${f.label}`)
                return {
                    name: fieldName,
                    type: maker.makeType({
                        name: fieldName,
                        fields: [
                            `field: ${maker.makeObject(f)}`,
                            `value: ${mapField({ prefix, maker, field: f }).value}`,
                        ],
                    }),
                }
            })

            return {
                value: maker.makeUnionMultiple(fields.map((t) => t.name)),
                template: fields.map((t) => t.type).join(''),
            }
        }
        case 'layout':
        case 'layout-grid': {
            const fieldName = maker.makeTypeName(field.name)

            const defaultComponents = layoutComponents
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

            const customComponents = field.options.components
                ? Object.keys(field.options.components).map((c) => {
                      const fields = field.options.components?.[c].fields || []
                      const component = c.toLowerCase()

                      return {
                          name: `${prefix}${fieldName}${maker.makeTypeName(component)}`,
                          type: maker.makeType({
                              name: `${prefix}${fieldName}${maker.makeTypeName(component)}`,
                              fields: [
                                  `component: ${maker.makeLiteral(component)}`,
                                  `${fields.map((f) =>
                                      cockpitMapperLayout({ component: f.type, fieldName, prefix, maker }),
                                  )}`,
                              ],
                          }),
                      }
                  })
                : []

            const components = defaultComponents.concat(customComponents)

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
