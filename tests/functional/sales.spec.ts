import db from '@adonisjs/lucid/services/db'
import { ApiClient } from '@japa/api-client'
import { test } from '@japa/runner'

test.group('Product functional tests', (group) => {
  let userToken: string
  let customerId: number
  let product01Id: number
  let product02Id: number

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
  const customer = {
    name: 'user01',
    cpf: '12345678945',
    address,
    telephone,
  }

  const product01 = {
    productName: 'shampoo',
    image: 'url.do.produto',
    description: 'shampoo para cabelos secos',
    category: 'produto de beleza',
    brand: 'Seda',
    price: 19.99,
    supplier: 'Seda',
    status: 'available',
  }
  const product02 = {
    productName: 'apontador',
    image: 'url.do.produto',
    description: 'apontador para lápis aquarela',
    category: 'arte',
    brand: 'Faber-Castell',
    price: 9.99,
    supplier: 'Gecore',
    status: 'out_of_stock',
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

    const storeProduct01Response = await client
      .post('/api/products')
      .json({
        ...product01,
      })
      .bearerToken(userToken)

    const { id: productStored01Id } = storeProduct01Response.body()
    product01Id = Number(productStored01Id)

    const storeProduct02Response = await client
      .post('/api/products')
      .json({
        ...product02,
      })
      .bearerToken(userToken)

    const { id: productStored02Id } = storeProduct02Response.body()
    product02Id = Number(productStored02Id)

    const storeCustomerResponse = await client
      .post('/api/customers')
      .json({
        ...customer,
      })
      .bearerToken(userToken)
    const { id: customerStoredId } = storeCustomerResponse.body()

    customerId = Number(customerStoredId)
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('Could not add any sale to customer while not authenticated', async ({ client }) => {
    const response = await client.post('/api/sales').json({
      customerId,
      products: [
        {
          productId: product01Id,
          quantity: 1,
        },
        {
          productId: product02Id,
          quantity: 2,
        },
      ],
    })

    response.assertStatus(401)
    response.assertTextIncludes('Unauthorized access')
  })

  test('Should add a sale to a customer', async ({ client, assert }) => {
    const response = await client
      .post('/api/sales')
      .json({
        customerId,
        products: [
          {
            productId: product01Id,
            quantity: 1,
          },
          {
            productId: product02Id,
            quantity: 2,
          },
        ],
      })
      .bearerToken(userToken)

    response.assertStatus(201)
    response.assertBodyContains({
      customerId,
      totalPrice: 39.97,
    })

    const { items } = response.body()
    assert.isArray(items)
    assert.equal(items.length, 2)

    assert.equal(items[0].quantity, 1)
    assert.equal(items[0].price, product01.price)
    assert.equal(items[0].productId, product01Id)
    assert.equal(items[1].quantity, 2)
    assert.equal(items[1].price, product02.price)
    assert.equal(items[1].productId, product02Id)
  })

  test('could not add a sale if invalid customerId value', async ({ client }) => {
    const response = await client
      .post('/api/sales')
      .json({
        customerId: 70,
        products: [
          {
            productId: product01Id,
            quantity: 1,
          },
          {
            productId: product02Id,
            quantity: 2,
          },
        ],
      })
      .bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Customer not found',
    })
  })

  test('could not add a sale if product is not available or invalid Id', async ({ client }) => {
    const response = await client
      .post('/api/sales')
      .json({
        customerId,
        products: [
          {
            productId: 70,
            quantity: 1,
          },
          {
            productId: product02Id,
            quantity: 2,
          },
        ],
      })
      .bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Product not found or available',
    })
  })
})
