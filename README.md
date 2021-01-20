# cockpit-type

[![GitHub release](https://img.shields.io/github/v/release/marcodaniels/cockpit-type?include_prereleases)](https://www.npmjs.com/package/cockpit-type)
[![Publish](https://github.com/marcodaniels/cockpit-type/workflows/On%20Publish/badge.svg)](https://github.com/MarcoDaniels/cockpit-type/releases)

> Typings generator for your [Cockpit CMS](https://getcockpit.com/) content model.

## Usage

`cockpit-type` uses [plopjs](https://plopjs.com/documentation) therefore all prompts and CLI usage are extended from it.

### Add it to your project

`yarn add -D cockpit-type` or `npm install --save-dev cockpit-type`

### Use it as script (see [CLI Options](#CLI-options))

`cockpit-type <options>` or `cockpit-type` without options, and the interactive CLI will prompt the options.

## CLI options

|Option|Type|Description|
|---|:---:|---|
|path|string|Destination file|
|prefix|string|Prefix for the types|
|filter|string|Filter option ex: 'group=My Groups' allowed filters: 'collection', 'singleton' or 'group'|