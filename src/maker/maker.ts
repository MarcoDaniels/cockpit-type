import { MakeType, MakeTypeEntry, MakeTypeName, MakeUnionType, MakerType } from './makerTypes'
import * as util from 'util'
import { PlopPrompt } from '../plop/plopPrompt'

export const makeFormatName = (s: string) => (s.charAt(0).toUpperCase() + s.slice(1)).replace(/ /g, '')

export const maker = (language: PlopPrompt['language']): MakerType =>
    <MakerType>{
        makeType: ({ name, description, fields }: MakeType) => {
            switch (language) {
                case 'typescript':
                    return `
${description ? `/** ${description} */` : ``}
export type ${name} = {
${fields.map((t) => `    ${t}`).join(`\n`)}
}
`
                case 'scala':
                    return `
@JsonCodec
case class ${name}(
${fields.map((t) => `    ${t}`).join(`,\n`)}
)
`
            }
        },
        makeTypeEntry: ({ comment, required, key, value }: MakeTypeEntry) => {
            switch (language) {
                case 'typescript':
                    return `${
                        comment
                            ? `/** ${comment} */
    `
                            : ``
                    }${key}${required ? `` : `?`}: ${value}`
                case 'scala':
                    return `${key}: ${required ? value : `Option[${value}]`}`
            }
        },
        makeTypeName: (name: MakeTypeName) => {
            if (Array.isArray(name)) {
                return name.map(makeFormatName).join('')
            }
            return makeFormatName(name)
        },
        makeUnion: (data: MakeUnionType) => {
            switch (language) {
                case 'typescript':
                    return `${data.join(' | ')}`
                case 'scala':
                    return `Json`
            }
        },
        makeUnionMultiple: (data: MakeUnionType) => {
            switch (language) {
                case 'typescript':
                    return `(${data.join(' | ')})[]`
                case 'scala':
                    return `List[Json]`
            }
        },
        makeUnionString: (data: MakeUnionType) => {
            switch (language) {
                case 'typescript':
                    return `'${data.join("' | '")}'`
                case 'scala':
                    return `String`
            }
        },
        makeUnionStringMultiple: (data: MakeUnionType) => {
            switch (language) {
                case 'typescript':
                    return `('${data.join("' | '")}')[]`
                case 'scala':
                    return `List[String]`
            }
        },
        makeString: () => {
            switch (language) {
                case 'typescript':
                    return 'string'
                case 'scala':
                    return 'String'
            }
        },
        makeBoolean: () => {
            switch (language) {
                case 'typescript':
                    return 'boolean'
                case 'scala':
                    return 'Boolean'
            }
        },
        makeNumber: () => {
            switch (language) {
                case 'typescript':
                    return 'number'
                case 'scala':
                    return 'Int'
            }
        },
        makeObject: (obj: string | Record<string, unknown>, raw?: boolean) => {
            switch (language) {
                case 'typescript':
                    return raw ? obj : util.inspect(obj)
                case 'scala':
                    return `Json`
            }
        },
        makeLiteral: (literal: string) => {
            switch (language) {
                case 'typescript':
                    return `'${literal}'`
                case 'scala':
                    return `String`
            }
        },
        makeMultiple: (type) => {
            switch (language) {
                case 'typescript':
                    return `${type}[]`
                case 'scala':
                    return `List[${type}]`
            }
        },
        makeAny: (field: string) => {
            switch (language) {
                case 'typescript':
                    return `any // TODO: field "${field}" is not being handled`
                case 'scala':
                    return `Json // TODO: field "${field}" is not being handled`
            }
        },
    }
