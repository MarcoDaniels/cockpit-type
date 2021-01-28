import { LayoutFieldComponents } from '../cockpitTypes'
import { MakerType } from '../../maker/makerTypes'

export const LayoutChildrenSuffix = `LayoutChildren`

export type CockpitMapperLayout = {
    component: LayoutFieldComponents
    fieldName: string
    prefix?: string
    maker: MakerType
}

export const cockpitMapperLayout = ({ component, fieldName, prefix, maker }: CockpitMapperLayout): string => {
    switch (component) {
        case 'text':
            return `settings: ${maker.makeObject(`{text: string}`, true)}`
        case 'image':
            return `settings: ${maker.makeObject(`{image: ${prefix}ImageType}`, true)}`
        case 'grid':
            return `columns: ${maker.makeMultiple(
                maker.makeObject(`${prefix}${fieldName}${LayoutChildrenSuffix}`, true),
            )}`
        case 'section':
            return `children: ${maker.makeObject(`${prefix}${fieldName}${LayoutChildrenSuffix}['children']`, true)}`
        case 'html':
            return `settings: ${maker.makeObject(`{html: string}`, true)}`
        case 'heading':
            return `settings: ${maker.makeObject(`{text: string, tag: string}`, true)}`
        case 'gallery':
            return `settings: ${maker.makeObject(`{gallery: ${prefix}GalleryType[]}`, true)}`
        case 'divider':
            return `settings: ${maker.makeObject(`{style: string}`, true)}`
        case 'button':
            return `settings: ${maker.makeObject(`{text: string, url: string}`, true)}`
        default:
            return `todo: ${maker.makeAny(component)}`
    }
}
