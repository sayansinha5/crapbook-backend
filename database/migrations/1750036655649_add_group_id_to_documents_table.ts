import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('group_id').unsigned().nullable().after('uuid');
      table.foreign('group_id').references('id').inTable('groups').onDelete('SET NULL');
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('group_id');
      table.dropColumn('group_id')
    })
  }
}
