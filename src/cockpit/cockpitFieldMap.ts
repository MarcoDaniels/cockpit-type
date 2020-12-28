import {Field} from "./cockpitTypes"
import {createUnion, createUnionMultiple} from "../typescript/createUnion"
import {createTypeName} from "../typescript/createTypeName"
import {createType} from "../typescript/createType"

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
            return {
                value: `Repeat // TODO: handle repeater`,
                template: createType({name: 'Repeat', fields: ['key: string']})
            }
        default:
            return {value: `any // TODO: handle "${field.type}" type`}
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