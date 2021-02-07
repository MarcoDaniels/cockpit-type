import test from 'ava'
import { plopPromptValidate } from '../plopPromptValidate'

test('prompt path with no language', (t) => {
    t.true(plopPromptValidate.path('debug.ts'))
})

test('prompt path with language', (t) => {
    const path = plopPromptValidate.path('debug.type', {
        language: 'typescript',
        path: '',
        filter: '',
    })

    t.not(path, true)
    t.is(path, 'Please provide a valid TypeScript file path')
})

test('prompt prefix valid', (t) => {
    t.true(plopPromptValidate.prefix('MyType'))
})

test('prompt prefix invalid', (t) => {
    t.is(plopPromptValidate.prefix('My Type'), 'Prefix cannot include space.')
})

test('prompt filter valid options', (t) => {
    const filters = ['group', 'collection', 'singleton']

    filters.map((f) => t.true(plopPromptValidate.filter(`${f}=MyFilter`)))
})

test('prompt filter invalid options', (t) => {
    const filter = plopPromptValidate.filter(`filer=MyFilter`)

    t.not(filter, true)
    t.is(filter, 'Please provide one of the following filterItem (collection|singleton|group)')
})
