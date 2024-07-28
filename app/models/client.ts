import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Address from './address.js'
import Telephone from './telephone.js'
import { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Sale from './sale.js'
import User from './user.js'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: number

  @column()
  declare cpf: number

  @hasOne(() => Address)
  declare address: HasOne<typeof Address>

  @hasOne(() => Telephone)
  declare telephone: HasOne<typeof Telephone>

  @hasOne(() => User)
  declare user: HasOne<typeof User>

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
