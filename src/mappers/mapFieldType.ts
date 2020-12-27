import {Field} from '../cockpit/cockpitTypes'

export const mapFieldType = (field: Field) => {
    switch (field.type) {
        case 'text':
        case 'markdown':
        case 'code':
            return `string`
        case 'boolean':
            return `boolean`
        case 'select':
            return `'${field.options.options.split(', ').join('\' | \'')}'`
        case 'multipleselect':
            return `('${field.options.options.split(', ').join('\' | \'')}')[]`
        default:
            return `any // TODO: handle "${field.type}" type`
    }
}