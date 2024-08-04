import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

test.group('Authorization', async (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('Should register a user', async ({ client }) => {
    const response = await client.post('/api/register').json({
      fullName: 'user_test',
      email: 'user@test.com',
      password: '123456',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      fullName: 'user_test',
      email: 'user@test.com',
    })
  })
  test('Should authenticated a valid user', async ({ client }) => {
    await client.post('/api/register').json({
      fullName: 'user_test',
      email: 'user@test.com',
      password: '123456',
    })

    const response = await client.post('/api/login').json({
      email: 'user@test.com',
      password: '123456',
    })

    response.assertStatus(200)
  })
  test('Should not authenticate a invalid user', async ({ client }) => {
    const response = await client.post('/api/login').json({
      email: 'invalid_user@test.com',
      password: '1234561',
    })
    response.assertStatus(400)

    response.assertBody({
      errors: [
        {
          message: 'Invalid user credentials',
        },
      ],
    })
  })
})
