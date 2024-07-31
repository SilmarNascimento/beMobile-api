import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { ProductStatus } from '../types/product_status.js'
import Sale from './sale.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productName: string

  @column()
  declare image: string

  @column()
  declare description: string

  @column()
  declare category: string

  @column()
  declare brand: string

  @column()
  declare price: number

  @column()
  declare supplier: string

  @column()
  declare status: ProductStatus

  @column()
  declare saleId: number

  @manyToMany(() => Sale, {
    pivotTable: 'product_sales',
    localKey: 'id',
    pivotForeignKey: 'product_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'sale_id',
  })
  declare sales: ManyToMany<typeof Sale>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime | null

  async softDelete() {
    this.deletedAt = DateTime.local()
    await this.save()
  }

  async restore() {
    this.deletedAt = null
    await this.save()
  }
}
