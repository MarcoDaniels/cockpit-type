import test from 'ava'
import nock from 'nock'
import { cockpitClient } from '../cockpit/cockpitClient'
import { mockCollections, mockCollectionsId } from './_mocks'

test.afterEach(() => nock.cleanAll())

test('request collections ID', async (t) => {
    mockCollectionsId()

    const collectionResponse = await cockpitClient.collectionsId()

    t.is(collectionResponse.type, 'success')

    if (collectionResponse.type === 'success') {
        t.deepEqual(collectionResponse.data, ['collectionOne', 'collectionTwo'])
    }
})

test('request collections', async (t) => {
    mockCollections()

    const collectionResponse = await cockpitClient.collections()

    t.is(collectionResponse.type, 'success')

    if (collectionResponse.type === 'success') {
        collectionResponse.data.map((data) => {
            t.is(data.name, 'collectionOne')
            t.is(data.fields.length, 2)
        })
    }
})
