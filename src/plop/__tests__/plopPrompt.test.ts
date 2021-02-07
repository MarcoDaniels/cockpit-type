import test from 'ava'
import { plopPrompt } from '../plopPrompt'

test('prompt options length', (t) => {
    t.is(plopPrompt().length, 4)
})
