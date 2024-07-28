import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('product_name').notNullable()
      table.string('image').nullable()
      table.string('description').notNullable()
      table.string('category').nullable()
      table.string('brand').notNullable()
      table.decimal('price').notNullable()
      table.string('supplier').notNullable()
      table
        .enum('status', ['available', 'out_of_stock', 'discontinued'])
        .notNullable()
        .defaultTo('available')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
