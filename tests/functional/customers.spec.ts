import db from '@adonisjs/lucid/services/db'
import { ApiClient } from '@japa/api-client'
import { test } from '@japa/runner'

test.group('Customers functional tests', (group) => {
  let userToken: string
  let userId: string

  const address = {
    street: 'street01',
    number: '1030',
    zipCode: 'zipCode',
    city: 'city',
    state: 'state',
    country: 'country',
  }
  const telephone = {
    number: '(27) 99999-8888',
  }
  const customer01 = {
    name: 'user01',
    cpf: '12345678945',
    address,
    telephone,
  }
  const customer02 = {
    name: 'user01',
    cpf: '98765432145',
    address,
    telephone,
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

    const storeResponse = await client
      .post('/api/customers')
      .json({
        ...customer02,
      })
      .bearerToken(userToken)
    const { id } = storeResponse.body()

    userId = id
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('Should List customers while authenticated', async ({ client }) => {
    const response = await client.get('/api/customers').bearerToken(userToken)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        name: customer02.name,
        cpf: customer02.cpf,
      },
    ])
  })

  test('Could not List customers while not authenticated', async ({ client }) => {
    const response = await client.get('/api/customers')

    response.assertStatus(401)
    response.assertTextIncludes('Unauthorized access')
  })

  test('Should show a customer', async ({ client }) => {
    const response = await client.get(`/api/customers/${userId}`).bearerToken(userToken)

    response.assertStatus(200)
    response.assertBodyContains({
      name: customer02.name,
      cpf: customer02.cpf,
    })
  })

  test('Could not show a customer by invalid Id', async ({ client }) => {
    const response = await client.get('/api/customers/70').bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Row not found',
    })
  })

  test('Should create a Customer', async ({ client }) => {
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

  test('Could not create a User with cpf already taken', async ({ client }) => {
    const response = await client
      .post('/api/customers')
      .json({
        name: 'different_user',
        cpf: customer02.cpf,
        address,
        telephone,
      })
      .bearerToken(userToken)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Cpf already registered',
    })
  })

  test('Should update a customer', async ({ client }) => {
    const response = await client
      .put(`/api/customers/${userId}`)
      .json({
        ...customer02,
        name: 'User new name',
      })
      .bearerToken(userToken)

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'User new name',
      cpf: customer02.cpf,
    })
  })

  test('Could not update a customer by invalid Id', async ({ client }) => {
    const response = await client
      .put(`/api/customers/70`)
      .json({
        ...customer02,
        name: 'User new name',
      })
      .bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Row not found',
    })
  })

  test('Could not update a customer by invalid cpf data', async ({ client }) => {
    const response = await client
      .put(`/api/customers/${userId}`)
      .json({
        ...customer02,
        name: 'User new name',
        cpf: customer01.cpf,
      })
      .bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Row not found',
    })
  })

  test('Could not update a customer by invalid cpf data and customerId', async ({ client }) => {
    const secondCustomer = await client
      .post('/api/customers')
      .json({
        ...customer01,
      })
      .bearerToken(userToken)
    const { id } = secondCustomer.body()

    const response = await client
      .put(`/api/customers/${id}`)
      .json({
        ...customer02,
        name: 'User new name',
      })
      .bearerToken(userToken)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Invalid data',
    })
  })

  test('Should delete a customer by Id', async ({ client }) => {
    const response = await client.delete(`/api/customers/${userId}`).bearerToken(userToken)

    response.assertStatus(204)
  })

  test('Could not delete a customer by invalid Id', async ({ client }) => {
    const response = await client.delete(`/api/customers/70`).bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Customer not found',
    })
  })
})
