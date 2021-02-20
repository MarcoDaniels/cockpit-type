import { plopFilterBy } from './plopFilterBy'
import { cockpitClient } from 'cockpit-http-client'
import { CockpitTemplate, cockpitTemplate } from '../cockpit/cockpitTemplate'
import { maker as LanguageMaker } from '../maker/maker'
import { PlopPrompt } from './plopPrompt'
import { formatOutput } from '../utils/formatOutput'
import { plopValidateLangFile } from './plopValidateLangFile'
import { config } from '../utils/config'
import { FieldSchema } from '../cockpit/cockpitTypes'
import { cockpitSyncType, SyncData } from '../cockpit/cockpitSyncType'

export const plopTransform = async (template: string, answers: PlopPrompt): Promise<string> => {
    const validation = plopValidateLangFile(answers)
    if (typeof validation === 'string') {
        return validation
    }

    const syncDataType: SyncData[] = []

    const client = cockpitClient({ apiURL: config.cockpitAPIURL, apiToken: config.cockpitAPIToken })

    const maker = LanguageMaker(answers.language)

    const schema: CockpitTemplate = { maker, prefix: answers.prefix }

    const filters = plopFilterBy(answers.filter)
    if (filters) {
        switch (filters.filterBy) {
            case 'collection': {
                // TODO: next cockpit-http-client will allow type param instead of using `as`
                const collection = await client.collections.schema(filters.filterName)
                if (collection.success) {
                    const { accTemplate, syncType } = cockpitTemplate(schema)(collection.data as FieldSchema)
                    template += accTemplate
                    syncDataType.push({
                        type: 'collections',
                        template: syncType,
                    })
                }

                template += cockpitSyncType({ syncData: syncDataType, maker, prefix: answers.prefix })

                return formatOutput(template, answers.language)
            }
            case 'singleton': {
                const singleton = await client.singletons.schema(filters.filterName)
                if (singleton.success) {
                    const { accTemplate, syncType } = cockpitTemplate(schema)(singleton.data as FieldSchema)
                    template += accTemplate
                    syncDataType.push({
                        type: 'singletons',
                        template: syncType,
                    })
                }

                template += cockpitSyncType({ syncData: syncDataType, maker, prefix: answers.prefix })

                return formatOutput(template, answers.language)
            }
            case 'group': {
                const collection = await client.collections.schemas()
                const singleton = await client.singletons.schemas()

                if (collection.success && singleton.success) {
                    Object.values(collection.data)
                        .filter((d) => d.group && d.group === filters.filterName)
                        .map((data) => cockpitTemplate(schema)(data as FieldSchema))
                        .map(({ accTemplate, syncType }) => {
                            template += accTemplate
                            syncDataType.push({
                                type: 'collections',
                                template: syncType,
                            })
                        })

                    Object.values(singleton.data)
                        .filter((d) => d.group && d.group === filters.filterName)
                        .map((data) => cockpitTemplate(schema)(data as FieldSchema))
                        .map(({ accTemplate, syncType }) => {
                            template += accTemplate
                            syncDataType.push({
                                type: 'singletons',
                                template: syncType,
                            })
                        })
                }

                template += cockpitSyncType({ syncData: syncDataType, maker, prefix: answers.prefix })

                return formatOutput(template, answers.language)
            }
        }
    }

    const collection = await client.collections.schemas()
    const singleton = await client.singletons.schemas()

    if (collection.success && singleton.success) {
        Object.values(collection.data)
            .map((data) => cockpitTemplate(schema)(data as FieldSchema))
            .map(({ accTemplate, syncType }) => {
                template += accTemplate
                syncDataType.push({
                    type: 'collections',
                    template: syncType,
                })
            })

        Object.values(singleton.data)
            .map((data) => cockpitTemplate(schema)(data as FieldSchema))
            .map(({ accTemplate, syncType }) => {
                template += accTemplate
                syncDataType.push({
                    type: 'singletons',
                    template: syncType,
                })
            })
    }

    template += cockpitSyncType({ syncData: syncDataType, maker, prefix: answers.prefix })

    return formatOutput(template, answers.language)
}
