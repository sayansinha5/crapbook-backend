import DocumentContentFile from '#models/document_content_file'

export default class DocumentContentFileTransformer {
  public static async transform(documentContentFile: DocumentContentFile) {

    return {
      id: documentContentFile.uuid,

      document_id: documentContentFile.document_id,
      name: documentContentFile.name,
      real_name: documentContentFile.real_name,
      type: documentContentFile.type,
      extension: documentContentFile.extension,
      size: documentContentFile.size,

      created_at: documentContentFile.createdAt,
      updated_at: documentContentFile.updatedAt,
    }
  }

  public static async collection(documentContentFiles: DocumentContentFile[]) {
    return Promise.all(documentContentFiles.map((documentContentFile) => this.transform(documentContentFile)))
  }
}
