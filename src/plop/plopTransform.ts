import { plopFilterBy } from './plopFilterBy'
import { cockpitClient } from '../cockpit/cockpitClient'
import { CockpitSchemaTemplate, cockpitSchemaTemplate } from '../cockpit/cockpitSchemaTemplate'
import { maker as LanguageMaker } from '../maker/maker'
import { PlopPrompt } from './plopPrompt'
import { formatOutput } from '../utils/formatOutput'
import { plopValidateAnswers } from './plopValidateAnswers'

export const plopTransform = async (template: string, answers: PlopPrompt): Promise<string> => {
    const validation = plopValidateAnswers(answers)
    if (typeof validation === 'string') {
        return validation
    }

    const schema: CockpitSchemaTemplate = { maker: LanguageMaker(answers.language), prefix: answers.prefix }
    const filters = plopFilterBy(answers.filter)

    if (filters) {
        switch (filters.filterBy) {
            case 'collection': {
                const collection = await cockpitClient.collectionSchema(filters.filterName)
                if (collection.type === 'success') {
                    template += cockpitSchemaTemplate(schema)(collection.data)
                }

                return formatOutput(template, answers.language)
            }
            case 'singleton': {
                const singleton = await cockpitClient.singletonSchema(filters.filterName)
                if (singleton.type === 'success') {
                    template += cockpitSchemaTemplate(schema)(singleton.data)
                }

                return formatOutput(template, answers.language)
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

                return formatOutput(template, answers.language)
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

    return formatOutput(template, answers.language)
}
