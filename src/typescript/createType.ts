export type CreateType = {
    name: string
    fields: string[]
    description?: string
}

export const createType = ({name, fields, description}: CreateType) => `
${description ? `/** ${description} */` : ``}
export type ${name} = {
${fields.map(t => `    ${t}`).join(`\n`)}
}
`
