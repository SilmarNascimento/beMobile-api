import { BaseSchema } from '@adonisjs/lucid/schema'
import { ProductStatus } from '../../app/types/product_status.js'

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
      table.decimal('price', 12, 2).notNullable()
      table.string('supplier').notNullable()
      table.enum('status', Object.values(ProductStatus)).notNullable().defaultTo('available')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
