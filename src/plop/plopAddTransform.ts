import { PlopPromptAnswers } from './plopPrompt'
import { filterBy } from '../utils/filterBy'
import { cockpitClient } from '../cockpit/cockpitClient'
import { schemaTemplate } from '../typescript/schemaTemplate'
import { LanguageType } from '../plopfile'

export type PlopAddTransform = {
    language: LanguageType
    formatOutput?: (template: string) => string | Promise<string>
}

export const plopAddTransform = ({ language, formatOutput }: PlopAddTransform) => async (
    template: string,
    answers: PlopPromptAnswers,
) => {
    const filters = filterBy(answers.filter)
    if (filters) {
        switch (filters.filterBy) {
            case 'collection':
                const collection = await cockpitClient.collectionSchema(filters.filterName)
                if (collection.type === 'success') {
                    template += schemaTemplate(answers.prefix)(collection.data)
                }

                return formatOutput ? formatOutput(template) : template
            case 'singleton':
                const singleton = await cockpitClient.singletonSchema(filters.filterName)
                if (singleton.type === 'success') {
                    template += schemaTemplate(answers.prefix)(singleton.data)
                }

                return formatOutput ? formatOutput(template) : template
            case 'group':
                const collectionResponse = await cockpitClient.collections(filters.filterName)
                const singletonResponse = await cockpitClient.singletons(filters.filterName)
                if (collectionResponse.type === 'success' && singletonResponse.type === 'success') {
                    collectionResponse.data
                        .concat(singletonResponse.data)
                        .map(schemaTemplate(answers.prefix))
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
            .map(schemaTemplate(answers.prefix))
            .map((schemaTemplate) => (template += schemaTemplate))
    }

    return formatOutput ? formatOutput(template) : template
}
