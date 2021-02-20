import { plopFilterBy } from './plopFilterBy'
import { cockpitClient } from 'cockpit-http-client'
import { CockpitSchemaTemplate, cockpitSchemaTemplate } from '../cockpit/cockpitSchemaTemplate'
import { maker as LanguageMaker } from '../maker/maker'
import { PlopPrompt } from './plopPrompt'
import { formatOutput } from '../utils/formatOutput'
import { plopValidateLangFile } from './plopValidateLangFile'
import { config } from '../utils/config'
import { FieldSchema } from '../cockpit/cockpitTypes'

export const plopTransform = async (template: string, answers: PlopPrompt): Promise<string> => {
    const validation = plopValidateLangFile(answers)
    if (typeof validation === 'string') {
        return validation
    }

    const client = cockpitClient({ apiURL: config.cockpitAPIURL, apiToken: config.cockpitAPIToken })

    const schema: CockpitSchemaTemplate = { maker: LanguageMaker(answers.language), prefix: answers.prefix }
    const filters = plopFilterBy(answers.filter)

    if (filters) {
        switch (filters.filterBy) {
            case 'collection': {
                // TODO: next cockpit-http-client will allow type param instead of using `as`
                const collection = await client.collections.schema(filters.filterName)
                if (collection.success) {
                    template += cockpitSchemaTemplate(schema)(collection.data as FieldSchema)
                }

                return formatOutput(template, answers.language)
            }
            case 'singleton': {
                const singleton = await client.singletons.schema(filters.filterName)
                if (singleton.success) {
                    template += cockpitSchemaTemplate(schema)(singleton.data as FieldSchema)
                }

                return formatOutput(template, answers.language)
            }
            case 'group': {
                const collection = await client.collections.schemas()
                const singleton = await client.singletons.schemas()

                if (collection.success && singleton.success) {
                    Object.values(collection.data)
                        .concat(Object.values(singleton.data))
                        .filter((d) => d.group && d.group === filters.filterName)
                        .map((data) => cockpitSchemaTemplate(schema)(data as FieldSchema))
                        .map((schemaTemplate) => (template += schemaTemplate))
                }

                return formatOutput(template, answers.language)
            }
        }
    }

    const collection = await client.collections.schemas()
    const singleton = await client.singletons.schemas()

    if (collection.success && singleton.success) {
        Object.values(collection.data)
            .concat(Object.values(singleton.data))
            .map((data) => cockpitSchemaTemplate(schema)(data as FieldSchema))
            .map((schemaTemplate) => (template += schemaTemplate))
    }

    return formatOutput(template, answers.language)
}
