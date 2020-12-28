export const createUnion = (data: string[]) => `'${data.join('\' | \'')}'`

export const createUnionMultiple = (data: string[]) => `('${data.join('\' | \'')}')[]`