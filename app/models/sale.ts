import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import ProductSale from './product_sale.js'
import { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Customer from './customer.js'

export default class Sale extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare totalPrice: number

  @column()
  declare clientId: number

  @belongsTo(() => Customer)
  declare client: BelongsTo<typeof Customer>

  @hasMany(() => ProductSale)
  declare items: HasMany<typeof ProductSale>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
