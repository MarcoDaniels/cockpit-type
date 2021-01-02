import {LayoutFieldComponents} from "./cockpitTypes"

export const LayoutChildrenSuffix = `LayoutChildren`

export type CockpitLayoutComponentMap = {
    component: LayoutFieldComponents
    fieldName: string
}

export const cockpitLayoutComponentMap = ({component, fieldName}: CockpitLayoutComponentMap) => {
    switch (component) {
        case "text":
            return `settings: {text: string}`
        case "image":
            return `settings: {image: ImageType}`
        case "grid":
            return `columns: ${fieldName}${LayoutChildrenSuffix}[]`
        case "section":
            return `children: ${fieldName}${LayoutChildrenSuffix}['children']`
        case "html":
            return `settings: {html: string}`
        case "heading":
            return `settings: {text: string, tag: string}`
        case "gallery":
            return `settings: {gallery: GalleryType[]}`
        case "divider":
            return `settings: {style: string}`
        case "button":
            return `settings: {text: string, url: string}`
        default:
            return `todo: any // TODO: layout field for component ${component}`
    }
}