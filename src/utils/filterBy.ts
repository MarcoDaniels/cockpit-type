export const filterByReg = /(collection|group|singleton)=([^]*)/giu

export type FilterBy = {
    filterBy: 'collection' | 'group' | 'singleton'
    filterName: string
}

export const filterBy = (input: string): FilterBy | undefined => {
    const matchInput = input.match(filterByReg)

    if (matchInput) {
        const [filters] = matchInput
            .map((t) => t.split('='))
            .map(([filterBy, filterName]) => ({ filterBy, filterName }))

        return filters as FilterBy
    }

    return undefined
}