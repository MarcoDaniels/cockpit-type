case class {{prefix}}AssetType(
    path: String,
    title: String,
    mime: String,
    description: Option[String],
    size: Int,
    image: Boolean,
    video: Boolean,
    audio: Boolean,
    archive: Boolean,
    document: Boolean,
    code: Boolean,
    created: Int,
    modified: Int,
    width: Int,
    height: Int,
    colors: List[String],
    folder: String
)

case class {{prefix}}ImageType(path: String)

case class {{prefix}}MetaType(title: String, asset: String)

case class {{prefix}}GalleryType(meta: MetaType, path: String)
