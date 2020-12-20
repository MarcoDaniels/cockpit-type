export type FieldType =
    'text' | 'moderation' | 'markdown' | 'image'

export type Field = {
    name: string
    label?: string
    type: FieldType
    localize: boolean
    required: boolean
}

export type Schema = {
    name: string
    label?: string
    fields: Field[]
}