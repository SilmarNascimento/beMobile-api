import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.timestamp('deleted_at').nullable().after('updated_at')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('deleted_at')
    })
  }
}
