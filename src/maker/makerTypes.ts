export type MakeType = {
    name: string
    fields: string[]
    description?: string
}

export type MakeTypeEntry = {
    comment: string | null
    required: boolean
    key: string
    value: string
}

export type MakeTypeName = string | string[]

export type MakeUnionType = string[]

export type MakerType = {
    makeType: ({ name, description, fields }: MakeType) => string
    makeTypeEntry: ({ key, value, required, comment }: MakeTypeEntry) => string
    makeTypeName: (name: MakeTypeName) => string
    makeUnionString: (data: MakeUnionType) => string
    makeUnionStringMultiple: (data: MakeUnionType) => string
    makeUnion: (data: MakeUnionType) => string
    makeUnionMultiple: (data: MakeUnionType) => string
    makeString: () => string
    makeNumber: () => string
    makeBoolean: () => string
    makeObject: (obj: string | Record<string, unknown>, raw?: boolean) => string
    makeLiteral: (literal: string) => string
    makeMultiple: (type: string) => string
    makeAny: (field: string) => string
}
