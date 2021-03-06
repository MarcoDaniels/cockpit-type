type BaseField = {
    name: string
    info?: string
    label?: string
    localize: boolean
    required: boolean
}

export type AnyField = BaseField & {
    type:
        | 'text'
        | 'textarea'
        | 'markdown'
        | 'code'
        | 'boolean'
        | 'moderation'
        | 'file'
        | 'asset'
        | 'gallery'
        | 'image'
        | 'wysiwyg'
        | 'autourl'
        | 'any-other' // just for ts to reach default
    options?: never
}

export type SelectFieldOptions = {
    value: string
    label: string
    group?: string
}

export type SelectField = BaseField & {
    type: 'select' | 'multipleselect'
    options: {
        options: string | SelectFieldOptions[]
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

export type SetField = BaseField & {
    type: 'set'
    options: {
        fields: Field[]
    }
}

export const layoutComponents = <const>[
    'section',
    'grid',
    'text',
    'image',
    'html',
    'heading',
    'gallery',
    'divider',
    'button',
]

export type LayoutFieldComponents = typeof layoutComponents[number]

export type LayoutField = BaseField & {
    type: 'layout' | 'layout-grid'
    options: {
        exclude?: LayoutFieldComponents[]
        components?: {
            [key: string]: {
                fields: Field[]
            }
        }
    }
}

export type Field = AnyField | SelectField | CollectionLinkField | RepeaterField | SetField | LayoutField

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
