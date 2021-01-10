# cockpit-type

> Typings generator for your [Cockpit CMS](https://getcockpit.com/) content model.

## Usage

`cockpit-type` uses [plopjs](https://plopjs.com/documentation) therefore all prompts and CLI usage are extended from it.

```
# install
yarn add -D cockpit-type

# use it as script
cockpit-type <destinationFile> <typePrefix> <filterOptions>
```

run `cockpit-type` command without options, and the interactive CLI will kick in.

## Command line options

```
path          Destination file
prefix        Prefix for the types
filter        Filter option ex: 'group=My Groups'
              allowed filters: 'collection', 'singleton' or 'group'
```
