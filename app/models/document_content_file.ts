import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Document from './document.js'

export default class DocumentContentFile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string
  @beforeCreate()
  static assignUuid(documentContentFile: DocumentContentFile) {
    documentContentFile.uuid = crypto.randomUUID()
  }

  @column()
  declare document_id: number | null
  @belongsTo(() => Document, { foreignKey: 'document_id' })
  declare document: BelongsTo<typeof Document>

  @column()
  declare name: string | null

  @column()
  declare real_name: string | null

  @column()
  declare type: string | null

  @column()
  declare extension: string | null

  @column()
  declare size: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
