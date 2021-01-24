import { LanguageType } from '../plopfile'
import { MakeType, MakeTypeEntry, MakeTypeName, MakeUnionType, MakerType } from './MakerType'

// TODO: implement language case
export const maker = (language: LanguageType): MakerType => ({
    makeType: ({ name, description, fields }: MakeType) => `
${description ? `/** ${description} */` : ``}
export type ${name} = {
${fields.map((t) => `    ${t}`).join(`\n`)}
}
`,
    makeTypeEntry: ({ comment, key, value }: MakeTypeEntry) =>
        `${
            comment
                ? `/** ${comment} */
    `
                : ``
        }${key}: ${value}`,
    makeTypeName: (name: MakeTypeName) => name.charAt(0).toUpperCase() + name.slice(1),
    makeUnionType: (data: MakeUnionType) => `${data.join(' | ')}`,
    makeUnionMultipleType: (data: MakeUnionType) => `(${data.join(' | ')})[]`,
    makeUnionStingMultipleType: (data: MakeUnionType) => `('${data.join("' | '")}')[]`,
    makeUnionStringType: (data: MakeUnionType) => `'${data.join("' | '")}'`,
})
