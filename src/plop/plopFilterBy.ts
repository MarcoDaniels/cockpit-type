export const filterByReg = /(collection|group|singleton)=([^]*)/iu

export type PlopFilterBy = {
    filterBy: 'collection' | 'group' | 'singleton'
    filterName: string
}

export const plopFilterBy = (input: string): PlopFilterBy | undefined => {
    const matchInput = input.match(filterByReg)

    if (matchInput) {
        const [filters] = matchInput
            .map((t) => t.split('='))
            .map(([filterBy, filterName]) => ({ filterBy, filterName }))

        return filters as PlopFilterBy
    }

    return undefined
}
