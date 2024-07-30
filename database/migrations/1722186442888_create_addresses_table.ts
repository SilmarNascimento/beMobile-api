import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('street').notNullable()
      table.integer('number').nullable()
      table.string('zip_code').notNullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.string('country')

      table
        .integer('customer_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('customers')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
