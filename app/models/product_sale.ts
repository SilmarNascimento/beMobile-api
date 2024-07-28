import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import Sale from './sale.js'
import Product from './product.js'
import { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'

export default class ProductSale extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare quantity: number

  @column()
  declare totalPrice: number

  @column()
  declare saleId: number

  @column()
  declare productId: number

  @belongsTo(() => Sale)
  declare sale: BelongsTo<typeof Sale>

  @hasOne(() => Product)
  declare product: HasOne<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
