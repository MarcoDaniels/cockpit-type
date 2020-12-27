import {Field} from "../cockpit/cockpitTypes"
import {mapFieldType} from "../mappers/mapFieldType"

export const createTypeField = (field: Field) =>
    `${field.info ? `/** ${field.info} */
    ` : ``}${field.name}${field.required ? `` : `?`}: ${mapFieldType(field)}`
