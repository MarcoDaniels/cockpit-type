import { PlopPromptAnswers } from './plopPrompt'
import { filterBy } from '../utils/filterBy'
import { cockpitClient } from '../cockpit/cockpitClient'
import { SchemaTemplate, schemaTemplate } from '../utils/schemaTemplate'
import { LanguageType } from '../plopfile'
import { maker as LanguageMaker } from '../maker/maker'

export type PlopAddTransform = {
    language: LanguageType
    formatOutput?: (template: string) => string | Promise<string>
}

export const plopAddTransform = ({ language, formatOutput }: PlopAddTransform) => async (
    template: string,
    answers: PlopPromptAnswers,
) => {
    const schema: SchemaTemplate = {
        maker: LanguageMaker(language),
        prefix: answers.prefix,
    }

    const filters = filterBy(answers.filter)
    if (filters) {
        switch (filters.filterBy) {
            case 'collection':
                const collection = await cockpitClient.collectionSchema(filters.filterName)
                if (collection.type === 'success') {
                    template += schemaTemplate(schema)(collection.data)
                }

                return formatOutput ? formatOutput(template) : template
            case 'singleton':
                const singleton = await cockpitClient.singletonSchema(filters.filterName)
                if (singleton.type === 'success') {
                    template += schemaTemplate(schema)(singleton.data)
                }

                return formatOutput ? formatOutput(template) : template
            case 'group':
                const collectionResponse = await cockpitClient.collections(filters.filterName)
                const singletonResponse = await cockpitClient.singletons(filters.filterName)
                if (collectionResponse.type === 'success' && singletonResponse.type === 'success') {
                    collectionResponse.data
                        .concat(singletonResponse.data)
                        .map(schemaTemplate(schema))
                        .map((schemaTemplate) => (template += schemaTemplate))
                }

                return formatOutput ? formatOutput(template) : template
        }
    }

    const collectionResponse = await cockpitClient.collections()
    const singletonResponse = await cockpitClient.singletons()
    if (collectionResponse.type === 'success' && singletonResponse.type === 'success') {
        collectionResponse.data
            .concat(singletonResponse.data)
            .map(schemaTemplate(schema))
            .map((schemaTemplate) => (template += schemaTemplate))
    }

    return formatOutput ? formatOutput(template) : template
}
