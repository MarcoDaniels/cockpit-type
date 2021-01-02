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

// TODO: setup Maybe type with Nothing that is empty string ''
const fieldMap = (field: Field): FieldMap => {
    switch (field.type) {
        case 'text':
        case 'markdown':
        case 'code':
        case 'file':
            return {value: `string`}
        case 'boolean':
            return {value: `boolean`}
        case 'select':
            return {value: createUnion(field.options.options.split(', '))}
        case 'multipleselect':
            return {value: createUnionMultiple(field.options.options.split(', '))}
        case "collectionlink":
        case "collectionlinkselect":
            return {
                value: `${createTypeName(field.options.link)}${field.options.multiple ? `[]` : ``}`
            }
        case "moderation":
            return {value: createUnion(['Unpublished', 'Draft', 'Published'])}
        case "asset":
            return {value: `AssetType`}
        case "image":
            return {value: `ImageType`}
        case "gallery":
            return {value: `GalleryType`}
        case "repeater":
            const fields = field.options.fields.map(f => ({
                name: `${field.name}${f.label}`,
                type: createType({
                    name: `${field.name}${f.label}`,
                    fields: [
                        `field: ${util.inspect(f)}`,
                        `value: ${fieldMap(f).value}`,
                    ]
                })
            }))

            return {
                value: createUnionType(fields.map(t => t.name)),
                template: fields.map(t => t.type).join('')
            }
        case "layout":
        case "layout-grid":
            const components = layoutComponents
                .filter(c => !field.options.exclude || !field.options.exclude.includes(c))
                .map(component => ({
                    name: `${field.name}${createTypeName(component)}`,
                    type: createType({
                        name: `${field.name}${createTypeName(component)}`,
                        fields: [
                            `component: '${component}'`,
                            `${cockpitLayoutComponentMap({component, fieldName: field.name})}`
                        ]
                    })

                }))

            const layoutChildrenType = createType({
                name: `${field.name}${LayoutChildrenSuffix}`,
                fields: [`children: ${createUnionTypeMultiple(components.map(t => t.name))}`]
            })

            return {
                value: createUnionTypeMultiple(components.map(t => t.name)),
                template: `${layoutChildrenType}${components.map(t => t.type).join('')}`
            }
        default:
            return {value: `any // TODO: field type "${field.type}" is not being handled`}
    }
}

type CockpitFieldMap = FieldMap & {
    comment: string | null
    key: string
}

export const cockpitFieldMap = (field: Field): CockpitFieldMap => ({
    comment: field.info || null,
    key: `${field.name}${field.required ? `` : `?`}`,
    ...fieldMap(field)
})