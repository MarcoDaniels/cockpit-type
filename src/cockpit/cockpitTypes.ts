interface BaseField {
    name: string
    label?: string
    localize: boolean
    required: boolean
    options: any
}

export interface AnyField extends BaseField {
    type: 'text' | 'boolean' | 'moderation' | 'markdown' | 'image' | 'code'
}

export interface SelectField extends BaseField {
    type: 'select' | 'multipleselect'
    options: {
        options: string
        default?: string
    }
}

export interface CollectionLinkField extends BaseField {
    type: 'collectionlinkselect' | 'collectionlink'
    options: {
        link: string
        display: string
        multiple: boolean
        limit: boolean
    }
}

export type Field = AnyField | SelectField | CollectionLinkField

export type FieldSchema = {
    name: string
    label?: string
    group?: string
    fields: Field[]
}

export type Schema = {
    [key: string]: FieldSchema
}
