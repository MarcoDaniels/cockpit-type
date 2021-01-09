import got, { Got } from 'got'
import { config } from '../utils/config'
import { FieldSchema, Schema } from './cockpitTypes'

const baseClient: Got = got.extend({
    prefixUrl: config.cockpitAPIURL,
    headers: {
        'Content-Type': 'application/json',
        'Cockpit-Token': config.cockpitAPIToken,
    },
    responseType: 'json',
    mutableDefaults: true,
    handlers: [
        (options, next) => {
            if (options.isStream) return next(options)

            return (async () => {
                try {
                    return await next(options)
                } catch (error) {
                    const { response } = error

                    let errorMessage = `${options.method} cockpit-type`

                    if (response) {
                        console.error(`${options.url.pathname}`)
                        errorMessage += ` ${response.statusCode} - ${response.statusMessage}`
                    }

                    throw Error(errorMessage)
                }
            })()
        },
    ],
})

export type ResponseError = {
    type: 'error'
    message: string
}

export type ResponseSuccess<T> = {
    type: 'success'
    data: T
}

export type ResponseResult<T> = Promise<ResponseSuccess<T> | ResponseError>

interface BaseCockpitClient<R, T> {
    url: string
    modFn: (res: R) => T
}

const baseCockpitClient = <R, T>({ url, modFn }: BaseCockpitClient<R, T>): ResponseResult<T> =>
    new Promise((resolve) =>
        baseClient
            .get<R>(url)
            .then((res) => resolve({ type: 'success', data: modFn(res.body) }))
            .catch((err) => resolve({ type: 'error', message: err.toString() })),
    )

const baseFn = <T>(data: T) => data

const filterFn = (filterByGroup?: string) => <T>(schema: T) =>
    filterByGroup
        ? Object.values(schema).filter((data) => data.group && data.group === filterByGroup)
        : Object.values(schema)

export const cockpitClient = {
    collectionsId: () =>
        baseCockpitClient<string[], string[]>({
            url: `collections/listCollections`,
            modFn: baseFn,
        }),
    collections: (filterByGroup?: string) =>
        baseCockpitClient<Schema, FieldSchema[]>({
            url: `collections/listCollections/extended`,
            modFn: filterFn(filterByGroup),
        }),
    collectionSchema: (id: string) =>
        baseCockpitClient<FieldSchema, FieldSchema>({
            url: `collections/collection/${id}`,
            modFn: baseFn,
        }),
    singletonsId: () =>
        baseCockpitClient<string[], string[]>({
            url: `singletons/listSingletons`,
            modFn: baseFn,
        }),
    singletons: (filterByGroup?: string) =>
        baseCockpitClient<Schema, FieldSchema[]>({
            url: `singletons/listSingletons/extended`,
            modFn: filterFn(filterByGroup),
        }),
    singletonSchema: (id: string) =>
        baseCockpitClient<FieldSchema, FieldSchema>({
            url: `singletons/singleton/${id}`,
            modFn: baseFn,
        }),
}
