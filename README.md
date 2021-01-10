# cockpit-type

> Typings generator for your Cockpit CMS content

## Usage

`cockpit-type` uses [plopjs](https://plopjs.com/documentation) therefore all prompts and CLI usage are extended from it.

```
# install
yarn add -D cockpit-type

# use it as script
cockpit-type <destinationFile> <typePrefix> <filterOptions>
```

## Command line options

```
  path          Destination file
  prefix        Prefix for the types
  filter        Filter by collection, singleton or group. ex: group=My Groups
```
