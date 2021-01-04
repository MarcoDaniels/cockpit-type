#!/usr/bin/env node
import path from 'path'
import { Plop, run } from 'plop'

const args = process.argv.slice(2)
const argv = require('minimist')(args)

Plop.launch(
    {
        cwd: argv.cwd,
        configPath: path.join(__dirname, 'plopfile.js'),
        require: argv.require,
        completion: argv.completion,
    },
    (env) => {
        const options = { ...env, dest: process.cwd() }
        return run(options, undefined, true)
    },
)
