import test from 'ava'
import { formatOutput } from '../utils/formatOutput'

test('formatOutput with TypeScript type', async (t) => {
    const template = `type User = { name: string; }`
    const output = await formatOutput(template, 'typescript')

    t.is(output, 'type User = { name: string }\n')
})

test('formatOutput with Scala case class', async (t) => {
    const template = `case class User(name: String)`
    const output = await formatOutput(template, 'scala')

    t.is(output, template)
})
