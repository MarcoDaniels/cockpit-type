type BaseField = {
    name: string
    info?: string
    label?: string
    localize: boolean
    required: boolean
}

export type AnyField = BaseField & {
    type: 'text'
        | 'markdown'
        | 'code'
        | 'boolean'
        | 'moderation'
        | 'file'
        | 'asset'
        | 'gallery'
        | 'image'
        | 'layout'
        | 'layout-grid'
}

export type SelectField = BaseField & {
    type: 'select' | 'multipleselect'
    options: {
        options: string
        default?: string
    }
}

export type CollectionLinkField = BaseField & {
    type: 'collectionlinkselect' | 'collectionlink'
    options: {
        link: string
        display: string
        multiple: boolean
        limit: boolean
    }
}

export type RepeaterField = BaseField & {
    type: 'repeater'
    options: {
        fields: Field[]
    }
}

export type Field = AnyField | SelectField | CollectionLinkField | RepeaterField

export type FieldSchema = {
    name: string
    label?: string
    group?: string
    description?: string
    fields: Field[]
}

export type Schema = {
    [key: string]: FieldSchema
}
