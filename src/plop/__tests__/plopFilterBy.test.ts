import test from 'ava'
import { plopFilterBy } from '../plopFilterBy'

test('validate filterBy collection', (t) => {
    const filterBy = plopFilterBy(`collection=My Collection`)

    t.deepEqual(filterBy, { filterBy: 'collection', filterName: 'My Collection' })
})

test('validate filterBy group', (t) => {
    const filterBy = plopFilterBy(`group=My Group`)

    t.deepEqual(filterBy, { filterBy: 'group', filterName: 'My Group' })
})

test('validate filterBy singleton', (t) => {
    const filterBy = plopFilterBy(`singleton=MySingleton`)

    t.deepEqual(filterBy, { filterBy: 'singleton', filterName: 'MySingleton' })
})

test('invalid filterBy input', (t) => {
    const filterBy = plopFilterBy(`groups=My Wrong Groups`)

    t.is(filterBy, undefined)
})
