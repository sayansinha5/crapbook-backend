import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'document_content_files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary().notNullable();
      table.string('uuid').notNullable().unique();

      table.integer('document_id').unsigned();
      table.foreign('document_id').references('id').inTable('documents').onDelete('CASCADE');

      table.string('name', 255).nullable();
      table.string('real_name', 255).nullable();
      table.string('type', 255).nullable();
      table.string('extension', 255).nullable();
      table.integer('size').nullable();

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
