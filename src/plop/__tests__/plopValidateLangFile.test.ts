import test from 'ava'
import { plopValidateLangFile } from '../plopValidateLangFile'

test('valid path answer for typescript', (t) => {
    const validate = plopValidateLangFile({
        path: 'valid-file.ts',
        language: 'typescript',
        filter: '',
    })

    t.truthy(validate)
})

test('invalid path answer for typescript', (t) => {
    const validate = plopValidateLangFile({
        path: 'invalid-file.typescript',
        language: 'typescript',
        filter: '',
    })

    t.not(validate, true)
    t.is(validate, 'Please provide a valid TypeScript file path')
})

test('valid path answer for scala', (t) => {
    const validate = plopValidateLangFile({
        path: 'valid-file.scala',
        language: 'scala',
        filter: '',
    })

    t.truthy(validate)
})

test('invalid path answer for scala', (t) => {
    const validate = plopValidateLangFile({
        path: 'invalid-file.sc',
        language: 'scala',
        filter: '',
    })

    t.not(validate, true)
    t.is(validate, 'Please provide a valid Scala file path')
})
