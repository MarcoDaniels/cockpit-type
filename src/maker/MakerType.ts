export type MakeType = {
    name: string
    fields: string[]
    description?: string
}

export type MakeTypeEntry = {
    comment: string | null
    key: string
    value: string
}

export type MakeTypeName = string

export type MakeUnionType = string[]

export type MakerType = {
    makeType: ({}: MakeType) => string
    makeTypeEntry: ({}: MakeTypeEntry) => string
    makeTypeName: (name: MakeTypeName) => string
    makeUnionStringType: (data: MakeUnionType) => string
    makeUnionStingMultipleType: (data: MakeUnionType) => string
    makeUnionType: (data: MakeUnionType) => string
    makeUnionMultipleType: (data: MakeUnionType) => string
}
