// import Customer from '#models/customer'
// import testUtils from '@adonisjs/core/services/test_utils'
// import { ApiClient } from '@japa/api-client'
// import { test } from '@japa/runner'

// test.group('CustomersController', async (group) => {
//   group.each.setup(async () => {
//     await testUtils.db().withGlobalTransaction()
//   })

//   let token: string

//   group.setup(async () => {
//     const apiClient = new ApiClient()
//     const loginResponse = await apiClient.post('/api/login').json({
//       email: 'user@test.com',
//       password: '123456',
//     })
//     console.log(loginResponse)

//     token = loginResponse.body().token
//     console.log(token)
//   })

//   test('should show a customer', async ({ client }) => {
//     const customer = await Customer.create({
//       name: 'John Doe',
//       cpf: '12345678901',
//     })

//     const response = await client.get(`/api/customers/${customer.id}`).bearerToken(token)
//     console.log(response)

//     response.assertStatus(200)
//     response.assertBodyContains({
//       id: customer.id,
//       name: 'John Doe',
//       cpf: '12345678901',
//     })
//   })

//   test('should create a customer', async ({ client }) => {
//     const response = await client.post('/customers').send({
//       name: 'Jane Doe',
//       cpf: '09876543210',
//       address: {
//         street: '123 Main St',
//         number: '456',
//         zip_code: '12345',
//         city: 'Anytown',
//         state: 'State',
//       },
//       telephone: {
//         number: '1234567890',
//       },
//     })

//     response.assertStatus(201)
//     response.assertBodyContains({
//       name: 'Jane Doe',
//       cpf: '09876543210',
//     })
//   })

//   test('should update a customer', async ({ client }) => {
//     const customer = await Customer.create({
//       name: 'John Doe',
//       cpf: '12345678901',
//     })

//     const response = await client
//       .put(`/customers/${customer.id}`)
//       .send({
//         name: 'John Smith',
//         cpf: '12345678901',
//       })
//       .end()

//     response.assertStatus(200)
//     response.assertBodyContains({
//       name: 'John Smith',
//     })
//   })

//   test('should delete a customer', async ({ client }) => {
//     const customer = await Customer.create({
//       name: 'John Doe',
//       cpf: '12345678901',
//     })

//     const response = await client.delete(`/customers/${customer.id}`)

//     response.assertStatus(204)
//   })
// })
