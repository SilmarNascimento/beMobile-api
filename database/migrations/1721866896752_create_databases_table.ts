import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateDatabases extends BaseSchema {
  async up() {
    this.defer(async (db) => {
      await db.rawQuery(`CREATE DATABASE IF NOT EXISTS bemobile`)
      await db.rawQuery(`CREATE DATABASE IF NOT EXISTS bemobile_test`)
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.rawQuery(`DROP DATABASE IF EXISTS bemobile`)
      await db.rawQuery(`DROP DATABASE IF EXISTS bemobile_test`)
    })
  }
}
