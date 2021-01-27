import nock, { Scope } from 'nock'
import { config } from '../utils/config'

export const mockCollectionsId = (): Scope =>
    nock(config.cockpitAPIURL)
        .get('/collections/listCollections')
        .reply(200, ['collectionOne', 'collectionTwo'])
        .persist()

export const mockCollections = (): Scope =>
    nock(config.cockpitAPIURL)
        .get('/collections/listCollections/extended')
        .reply(200, {
            collectionOne: {
                name: 'collectionOne',
                fields: [
                    {
                        name: 'title',
                        label: 'Title',
                        type: 'text',
                        info: '',
                        group: '',
                        options: [],
                        required: true,
                    },
                    {
                        name: 'URL',
                        label: 'URL',
                        type: 'text',
                        info: '',
                        group: '',
                        options: [],
                        required: true,
                    },
                ],
            },
        })
        .persist()
