import test from 'ava'
import { maker } from '../maker'

const makerScala = maker('scala')

test('make type for scala', (t) => {
    const type = makerScala.makeType({
        name: 'MyType',
        description: 'This is a comment',
        fields: ['name: String'],
    })

    t.is(
        type,
        `
@JsonCodec
case class MyType(
    name: String
)
`,
    )
})

test('make type entry for scala', (t) => {
    const type = makerScala.makeTypeEntry({
        key: 'name',
        value: 'String',
        required: false,
        comment: 'User name',
    })

    t.is(type, `name: Option[String]`)

    const requiredType = makerScala.makeTypeEntry({
        key: 'name',
        value: 'String',
        required: true,
        comment: 'User name',
    })

    t.is(requiredType, `name: String`)
})

test('make type name for scala', (t) => {
    const type = makerScala.makeTypeName('This is my Type')

    t.is(type, 'ThisismyType')
})

test('make union string for scala', (t) => {
    const type = makerScala.makeUnionString(['Cat', 'Dog', 'Bird'])

    t.is(type, 'String')
})

test('make union string multiple for scala', (t) => {
    const type = makerScala.makeUnionStringMultiple(['Cat', 'Dog', 'Bird'])

    t.is(type, 'List[String]')
})

test('make union for scala', (t) => {
    const type = makerScala.makeUnion(['Cat', 'Dog', 'Bird'])

    t.is(type, 'Json')
})

test('make union multiple for scala', (t) => {
    const type = makerScala.makeUnionMultiple(['Cat', 'Dog', 'Bird'])

    t.is(type, 'List[Json]')
})

test('make common types for scala', (t) => {
    t.is(makerScala.makeString(), 'String')

    t.is(makerScala.makeNumber(), 'Int')

    t.is(makerScala.makeBoolean(), 'Boolean')
})

test('make object for scala', (t) => {
    const typeRecord = makerScala.makeObject({ user: 'string' })

    t.is(typeRecord, 'Json')

    const typeObject = makerScala.makeObject({ user: 'string' }, true)

    t.deepEqual<unknown>(typeObject, 'Json')
})

test('make literal for scala', (t) => {
    t.is(makerScala.makeLiteral('my-type'), 'String')
})

test('make multiple for scala', (t) => {
    t.is(makerScala.makeMultiple('String'), 'List[String]')
})

test('make any for scala', (t) => {
    t.is(makerScala.makeAny('name'), 'Json // TODO: field "name" is not being handled')
})
