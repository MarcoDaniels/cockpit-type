export const createUnion = (data: string[]) => `'${data.join("' | '")}'`

export const createUnionMultiple = (data: string[]) => `('${data.join("' | '")}')[]`

export const createUnionType = (data: string[]) => `${data.join(' | ')}`

export const createUnionTypeMultiple = (data: string[]) => `(${data.join(' | ')})[]`
