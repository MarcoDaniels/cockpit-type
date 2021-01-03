export type CreateTypeEntry = {
    comment: string | null
    key: string
    value: string
}

export const createTypeEntry = (field: CreateTypeEntry) =>
    `${
        field.comment
            ? `/** ${field.comment} */
    `
            : ``
    }${field.key}: ${field.value}`
