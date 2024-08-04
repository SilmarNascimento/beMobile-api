import db from '@adonisjs/lucid/services/db'
import { ApiClient } from '@japa/api-client'
import { test } from '@japa/runner'

test.group('Product functional tests', (group) => {
  let userToken: string
  let productId: string

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

    const storeResponse = await client
      .post('/api/products')
      .json({
        ...product02,
      })
      .bearerToken(userToken)

    const { id } = storeResponse.body()
    productId = id
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('Should List products while authenticated', async ({ client }) => {
    const response = await client.get('/api/products').bearerToken(userToken)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        productName: product02.productName,
        brand: product02.brand,
        status: product02.status,
      },
    ])
  })

  test('Could not List products while not authenticated', async ({ client }) => {
    const response = await client.get('/api/products')

    response.assertStatus(401)
    response.assertTextIncludes('Unauthorized access')
  })

  test('Should show a product by its Id', async ({ client }) => {
    const response = await client.get(`/api/products/${productId}`).bearerToken(userToken)

    response.assertStatus(200)
    response.assertBodyContains({
      productName: product02.productName,
      brand: product02.brand,
      status: product02.status,
    })
  })

  test('Could not show a product by invalid Id', async ({ client }) => {
    const response = await client.get('/api/products/70').bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Row not found',
    })
  })

  test('Should create a product', async ({ client }) => {
    const response = await client
      .post('/api/products')
      .json({
        ...product01,
      })
      .bearerToken(userToken)

    response.assertStatus(201)
    response.assertBodyContains({
      productName: product01.productName,
      brand: product01.brand,
      status: product01.status,
    })
  })

  test('Should update a product by its Id', async ({ client }) => {
    const response = await client
      .put(`/api/products/${productId}`)
      .json({
        ...product02,
        productName: 'Lápis de cor',
      })
      .bearerToken(userToken)

    response.assertStatus(200)
    response.assertBodyContains({
      productName: 'Lápis de cor',
      brand: product02.brand,
      status: product02.status,
    })
  })

  test('Could not update a product by invalid Id', async ({ client }) => {
    const response = await client
      .put(`/api/products/70`)
      .json({
        ...product02,
        productName: 'Lápis de cor',
      })
      .bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Row not found',
    })
  })

  test('Should soft delete a product by its Id', async ({ client }) => {
    const response = await client.delete(`/api/products/${productId}`).bearerToken(userToken)

    response.assertStatus(204)
  })

  test('Could not soft delete a product by invalid Id', async ({ client }) => {
    const response = await client.delete(`/api/products/70`).bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Product not found',
    })
  })

  test('Could not show a product soft deleted by its Id', async ({ client }) => {
    await client.delete(`/api/products/${productId}`).bearerToken(userToken)

    const response = await client.get(`/api/products/${productId}`).bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Row not found',
    })
  })

  test('Should update a product if it is soft deleted and will be restored', async ({ client }) => {
    await client.delete(`/api/products/${productId}`).bearerToken(userToken)

    const response = await client
      .put(`/api/products/${productId}`)
      .json({
        ...product02,
        productName: 'Lápis de cor',
        restore: true,
      })
      .bearerToken(userToken)

    response.assertStatus(200)
    response.assertBodyContains({
      productName: 'Lápis de cor',
      brand: product02.brand,
      status: product02.status,
    })
  })

  test('Could not update a product if it is soft deleted and will not be restored', async ({
    client,
  }) => {
    await client.delete(`/api/products/${productId}`).bearerToken(userToken)

    const response = await client
      .put(`/api/products/${productId}`)
      .json({
        ...product02,
        productName: 'Lápis de cor',
      })
      .bearerToken(userToken)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Product not available',
    })
  })

  test('Should restore a product if it is soft deleted', async ({ client }) => {
    await client.delete(`/api/products/${productId}`).bearerToken(userToken)

    const response = await client
      .put(`/api/products/${productId}`)
      .json({
        restore: true,
      })
      .bearerToken(userToken)

    response.assertStatus(200)
    response.assertBodyContains({
      productName: product02.productName,
      brand: product02.brand,
      status: product02.status,
    })
  })
})
