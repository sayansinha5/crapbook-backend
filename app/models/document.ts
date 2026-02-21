import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Customer from './customer.js'

export default class Document extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string
  @beforeCreate()
  static assignUuid(document: Document) {
    document.uuid = crypto.randomUUID()
  }

  @column()
  declare user_id: number | null
  @belongsTo(() => User, { foreignKey: 'user_id' })
  declare user: BelongsTo<typeof User>

  @column()
  declare customer_id: number | null
  @belongsTo(() => Customer, { foreignKey: 'customer_id' })
  declare customer: BelongsTo<typeof Customer>

  @column()
  declare editor_type: string | null

  @column()
  declare title: string | null

  @column()
  declare description: string | null

  @column()
  declare tags: string | null

  @column()
  declare content: string | null

  @column()
  declare content_json: object | null

  @column()
  declare content_markdown: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
