import {Field, layoutComponents} from "./cockpitTypes"
import {cockpitLayoutComponentMap, LayoutChildrenSuffix} from "./cockpitLayoutComponentMap"
import {createUnion, createUnionMultiple, createUnionType, createUnionTypeMultiple} from "../typescript/createUnion"
import {createTypeName} from "../typescript/createTypeName"
import {createType} from "../typescript/createType"
import * as util from "util"

type FieldMap = {
    value: string
    template?: string
}

const fieldMap = (prefix?: string) => (field: Field): FieldMap => {
    const withMaybeType = (type: string) =>
        field.required ? `${type}` : `${prefix}MaybeType<${type}>`

    switch (field.type) {
        case 'text':
        case 'markdown':
        case 'code':
        case 'file':
            return {value: withMaybeType('string')}
        case 'boolean':
            return {value: withMaybeType('boolean')}
        case 'select':
            return {value: withMaybeType(createUnion(field.options.options.split(', ')))}
        case 'multipleselect':
            return {value: withMaybeType(createUnionMultiple(field.options.options.split(', ')))}
        case "collectionlink":
        case "collectionlinkselect":
            return {
                value: `${withMaybeType(`${prefix}${createTypeName(field.options.link)}`)}${field.options.multiple ? `[]` : ``}`
            }
        case "moderation":
            return {value: withMaybeType(createUnion(['Unpublished', 'Draft', 'Published']))}
        case "asset":
            return {value: withMaybeType(`${prefix}AssetType`)}
        case "image":
            return {value: withMaybeType(`${prefix}ImageType`)}
        case "gallery":
            return {value: withMaybeType(`${prefix}GalleryType[]`)}
        case "repeater":
            const fields = field.options.fields.map(f => ({
                name: `${field.name}${f.label}`,
                type: createType({
                    name: `${field.name}${f.label}`,
                    fields: [
                        `field: ${util.inspect(f)}`,
                        `value: ${fieldMap(prefix)({...f, required: true}).value}`,
                    ]
                })
            }))

            return {
                value: withMaybeType(createUnionType(fields.map(t => t.name))),
                template: fields.map(t => t.type).join('')
            }
        case "layout":
        case "layout-grid":
            const fieldName = createTypeName(field.name)

            const components = layoutComponents
                .filter(c => !field.options.exclude || !field.options.exclude.includes(c))
                .map(component => ({
                    name: `${prefix}${fieldName}${createTypeName(component)}`,
                    type: createType({
                        name: `${prefix}${fieldName}${createTypeName(component)}`,
                        fields: [
                            `component: '${component}'`,
                            `${cockpitLayoutComponentMap({component, fieldName, prefix})}`
                        ]
                    })

                }))

            const layoutChildrenType = createType({
                name: `${prefix}${fieldName}${LayoutChildrenSuffix}`,
                fields: [`children: ${createUnionTypeMultiple(components.map(t => t.name))}`]
            })

            return {
                value: withMaybeType(createUnionTypeMultiple(components.map(t => t.name))),
                template: `${layoutChildrenType}${components.map(t => t.type).join('')}`
            }
        default:
            return {value: `any // TODO: field type "${field.type}" is not being handled`}
    }
}

export type CockpitFieldMap = FieldMap & {
    comment: string | null
    key: string
}

export const cockpitFieldMap = (prefix?: string) => (field: Field): CockpitFieldMap => ({
    comment: field.info || null,
    key: `${field.name}${field.required ? `` : `?`}`,
    ...fieldMap(prefix)(field)
})