import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Customer from './customer.js'
import { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Telephone extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @belongsTo(() => Customer)
  declare client: BelongsTo<typeof Customer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
