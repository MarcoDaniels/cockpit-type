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

export const plopTransform = (transform: PlopTransform) => async (template: string, answers: PlopPromptAnswers) => {
    const { language, formatOutput } = transform
    const schema: CockpitSchemaTemplate = { maker: LanguageMaker(language), prefix: answers.prefix }
    const filters = plopFilterBy(answers.filter)

    if (filters) {
        switch (filters.filterBy) {
            case 'collection':
                const collection = await cockpitClient.collectionSchema(filters.filterName)
                if (collection.type === 'success') {
                    template += cockpitSchemaTemplate(schema)(collection.data)
                }

                return formatOutput ? formatOutput(template) : template
            case 'singleton':
                const singleton = await cockpitClient.singletonSchema(filters.filterName)
                if (singleton.type === 'success') {
                    template += cockpitSchemaTemplate(schema)(singleton.data)
                }

                return formatOutput ? formatOutput(template) : template
            case 'group':
                const collectionResponse = await cockpitClient.collections(filters.filterName)
                const singletonResponse = await cockpitClient.singletons(filters.filterName)
                if (collectionResponse.type === 'success' && singletonResponse.type === 'success') {
                    collectionResponse.data
                        .concat(singletonResponse.data)
                        .map(cockpitSchemaTemplate(schema))
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
            .map(cockpitSchemaTemplate(schema))
            .map((schemaTemplate) => (template += schemaTemplate))
    }

    return formatOutput ? formatOutput(template) : template
}
