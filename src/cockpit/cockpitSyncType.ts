import { MakerType } from '../maker/makerTypes'

export type SyncData = {
    type: 'collections' | 'singletons'
    template: string
}

export type CockpitSyncType = {
    syncData: SyncData[]
    maker: MakerType
    prefix?: string
}

type SyncType = {
    [n: string]: string[]
}

export const cockpitSyncType = ({ syncData, maker, prefix }: CockpitSyncType): string => {
    const sync: SyncType = syncData.reduce((res, data) => {
        res[data.type] = res[data.type] || []
        res[data.type].push(data.template)

        return res
    }, Object.create({}))

    return Object.entries(sync)
        .map(([key, fields]) =>
            maker.makeType({
                name: `${prefix}${maker.makeTypeName(key)}Sync`,
                fields: fields,
            }),
        )
        .join('')
        .concat(
            maker.makeType({
                name: `${prefix}SyncData`,
                fields: Object.keys(sync).map((key) =>
                    maker.makeTypeEntry({
                        key: key,
                        value: `${prefix}${maker.makeTypeName(key)}Sync`,
                        required: true,
                        comment: null,
                    }),
                ),
            }),
        )
}
