import db from '@adonisjs/lucid/services/db'
import { ApiClient } from '@japa/api-client'
import { test } from '@japa/runner'

test.group('Customers', (group) => {
  let userToken: string
  const customer01 = {
    name: 'user01',
    cpf: '12345678945',
    address: {
      street: 'street01',
      number: '1030',
      zipCode: 'zipCode',
      city: 'city',
      state: 'state',
      country: 'country',
    },
    telephone: {
      number: '(27) 99999-8888',
    },
  }

  group.each.setup(async () => {
    await db.beginGlobalTransaction()

    const client = new ApiClient()
    await client.post('/api/register').json({
      fullName: 'user_test',
      email: 'user@test.com',
      password: '123456',
    })
    const login = await client.post('/api/login').json({
      email: 'user@test.com',
      password: '123456',
    })

    const { token } = login.body()
    userToken = token
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('Should List customers while authenticate', async ({ client }) => {
    const response = await client.get('/api/customers').bearerToken(userToken)

    response.assertStatus(200)
    response.assertBody([])
  })

  test('Should create a Customer while authenticate', async ({ client }) => {
    const response = await client
      .post('/api/customers')
      .json({
        ...customer01,
      })
      .bearerToken(userToken)

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'user01',
      cpf: '12345678945',
      telephone: {
        number: '27999998888',
      },
    })
  })

  // test('Should not create a User with invalid email', async ({ client }) => {
  //   const response = await client.post('/users').json({
  //     email: 'user_invalidtest.com',
  //     password: '123456',
  //   })

  //   response.assertStatus(422)
  //   response.assertBody({
  //     errors: [
  //       {
  //         field: 'email',
  //         message: 'The email field must be a valid email address',
  //         rule: 'email',
  //       },
  //     ],
  //   })
  // })

  // test('Should not create a User without password', async ({ client }) => {
  //   const response = await client.post('/users').json({
  //     email: 'user_invalid@test.com',
  //   })

  //   response.assertStatus(422)
  //   response.assertBody({
  //     errors: [
  //       {
  //         field: 'password',
  //         message: 'The password field must be defined',
  //         rule: 'required',
  //       },
  //     ],
  //   })
  // })

  // test('Should not create a User if e-mail already exists', async ({ client }) => {
  //   const response = await client.post('/users').json({
  //     email: 'user_valid@test.com',
  //     password: '123456',
  //   })

  //   response.assertStatus(409)
  //   response.assertBodyContains({
  //     message: 'User already exists',
  //   })
  // })
})
