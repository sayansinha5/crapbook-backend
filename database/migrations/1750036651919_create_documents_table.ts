import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary().notNullable();
      table.string('uuid').notNullable().unique();

      table.integer('user_id').unsigned();
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

      table.integer('customer_id').unsigned();
      table.foreign('customer_id').references('id').inTable('customers').onDelete('CASCADE');

      table.string('editor_type').nullable();

      table.string('title', 255).nullable();
      table.string('description').nullable();
      table.string('tags').nullable();

      table.text('content', 'longtext').nullable();
      table.json('content_json').nullable();
      table.text('content_markdown').nullable();

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
