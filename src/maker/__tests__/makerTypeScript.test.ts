import test from 'ava'
import { maker } from '../maker'

const makerTypeScript = maker('typescript')

test('make type for typescript', (t) => {
    const type = makerTypeScript.makeType({
        name: 'MyType',
        description: 'This is a comment',
        fields: ['name: string'],
    })

    t.is(
        type,
        `
/** This is a comment */
export type MyType = {
    name: string
}
`,
    )
})

test('make type entry for typescript', (t) => {
    const type = makerTypeScript.makeTypeEntry({
        key: 'name',
        value: 'string',
        required: false,
        comment: 'User name',
    })

    t.is(
        type,
        `/** User name */
    name?: string`,
    )

    const requiredType = makerTypeScript.makeTypeEntry({
        key: 'name',
        value: 'string',
        required: true,
        comment: 'User name',
    })

    t.is(
        requiredType,
        `/** User name */
    name: string`,
    )
})

test('make type name for typescript', (t) => {
    const type = makerTypeScript.makeTypeName('This is my Type')

    t.is(type, 'ThisismyType')
})

test('make union string for typescript', (t) => {
    const type = makerTypeScript.makeUnionString(['Cat', 'Dog', 'Bird'])

    t.is(type, "'Cat' | 'Dog' | 'Bird'")
})

test('make union string multiple for typescript', (t) => {
    const type = makerTypeScript.makeUnionStringMultiple(['Cat', 'Dog', 'Bird'])

    t.is(type, "('Cat' | 'Dog' | 'Bird')[]")
})

test('make union for typescript', (t) => {
    const type = makerTypeScript.makeUnion(['Cat', 'Dog', 'Bird'])

    t.is(type, 'Cat | Dog | Bird')
})

test('make union multiple for typescript', (t) => {
    const type = makerTypeScript.makeUnionMultiple(['Cat', 'Dog', 'Bird'])

    t.is(type, '(Cat | Dog | Bird)[]')
})

test('make common types for typescript', (t) => {
    t.is(makerTypeScript.makeString(), 'string')

    t.is(makerTypeScript.makeNumber(), 'number')

    t.is(makerTypeScript.makeBoolean(), 'boolean')
})

test('make object for typescript', (t) => {
    const typeRecord = makerTypeScript.makeObject({ user: 'string' })

    t.is(typeRecord, "{ user: 'string' }")

    const typeObject = makerTypeScript.makeObject({ user: 'string' }, true)

    t.deepEqual<unknown>(typeObject, { user: 'string' })
})

test('make literal for typescript', (t) => {
    t.is(makerTypeScript.makeLiteral('my-type'), "'my-type'")
})

test('make multiple for typescript', (t) => {
    t.is(makerTypeScript.makeMultiple('string'), 'string[]')
})

test('make any for typescript', (t) => {
    t.is(makerTypeScript.makeAny('name'), 'any // TODO: field "name" is not being handled')
})
