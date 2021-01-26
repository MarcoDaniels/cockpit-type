import { plopFilterBy } from './plopFilterBy'
import { cockpitClient } from '../cockpit/cockpitClient'
import { CockpitSchemaTemplate, cockpitSchemaTemplate } from '../cockpit/cockpitSchemaTemplate'
import { LanguageType } from '../plopfile'
import { maker as LanguageMaker } from '../maker/maker'

export type PlopPromptAnswers = {
    filter: string
    prefix?: string
}

export type PlopTransform = {
    language: LanguageType
    formatOutput?: (template: string) => string | Promise<string>
}

export const plopTransform = (transform: PlopTransform) => async (
    template: string,
    answers: PlopPromptAnswers,
): Promise<string> => {
    const { language, formatOutput } = transform
    const schema: CockpitSchemaTemplate = { maker: LanguageMaker(language), prefix: answers.prefix }
    const filters = plopFilterBy(answers.filter)

    if (filters) {
        switch (filters.filterBy) {
            case 'collection': {
                const collection = await cockpitClient.collectionSchema(filters.filterName)
                if (collection.type === 'success') {
                    template += cockpitSchemaTemplate(schema)(collection.data)
                }

                return formatOutput ? formatOutput(template) : template
            }
            case 'singleton': {
                const singleton = await cockpitClient.singletonSchema(filters.filterName)
                if (singleton.type === 'success') {
                    template += cockpitSchemaTemplate(schema)(singleton.data)
                }

                return formatOutput ? formatOutput(template) : template
            }
            case 'group': {
                const collection = await cockpitClient.collections(filters.filterName)
                const singleton = await cockpitClient.singletons(filters.filterName)
                if (collection.type === 'success' && singleton.type === 'success') {
                    collection.data
                        .concat(singleton.data)
                        .map(cockpitSchemaTemplate(schema))
                        .map((schemaTemplate) => (template += schemaTemplate))
                }

                return formatOutput ? formatOutput(template) : template
            }
        }
    }

    const collection = await cockpitClient.collections()
    const singleton = await cockpitClient.singletons()
    if (collection.type === 'success' && singleton.type === 'success') {
        collection.data
            .concat(singleton.data)
            .map(cockpitSchemaTemplate(schema))
            .map((schemaTemplate) => (template += schemaTemplate))
    }

    return formatOutput ? formatOutput(template) : template
}
