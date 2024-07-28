import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('client_id')
    })
  }
}
