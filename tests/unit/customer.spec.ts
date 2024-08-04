// import { test } from '@japa/runner'
// import sinon from 'sinon'
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import CustomersController from '#controllers/customers_controller'
// import db from '@adonisjs/lucid/services/db'
// import Customer from '#models/customer'
// import {
//   createCustomerValidator,
//   customerAttributeFields,
//   updateCustomerValidator,
// } from '#validators/customer_validator'
// import { Database } from '@adonisjs/lucid/database'
// import { TransactionClientContract } from '@adonisjs/lucid/types/database'

// test.group('CustomersController', (group) => {
//   let customersController: CustomersController
//   let context: Partial<HttpContextContract>
//   const address = {
//     street: 'street',
//     number: 1030,
//     zipCode: 'zipCode',
//     city: 'city',
//     state: 'state',
//     country: 'country',
//   }

//   const telephone = {
//     number: '(27) 99999-8888',
//   }

//   group.each.setup(async () => {
//     customersController = new CustomersController()
//     context = {
//       request: {
//         only: sinon.stub(),
//         qs: sinon.stub(),
//         all: sinon.stub(),
//       } as any,
//       response: {
//         created: sinon.stub(),
//         badRequest: sinon.stub(),
//         send: sinon.stub(),
//         noContent: sinon.stub(),
//         notFound: sinon.stub(),
//       } as any,
//       params: {},
//     }
//     await db.beginGlobalTransaction()
//   })

//   group.each.teardown(async () => {
//     await db.rollbackGlobalTransaction()
//     sinon.restore()
//   })

//   test('should list all customers', async ({ assert }) => {
//     const customerData = [{ id: 1, name: 'User', cpf: '12345678901', address, telephone }]

//     sinon.stub(Customer, 'query').returns({
//       preload: sinon.stub().returnsThis(),
//       orderBy: sinon.stub().resolves(customerData),
//     } as any)

//     const customers = await customersController.index(context as HttpContextContract)

//     assert.equal(customers, customerData)
//   })

//   test('should show an individual customer', async ({ assert }) => {
//     const customerData = { id: 1, name: 'User', cpf: '12345678902', address, telephone }
//     context.params.id = 1
//     context.request.qs.returns({})

//     sinon.stub(Customer, 'query').returns({
//       where: sinon.stub().returnsThis(),
//       preload: sinon.stub().returnsThis(),
//       orderBy: sinon.stub().returnsThis(),
//       firstOrFail: sinon.stub().resolves(customerData),
//     } as any)

//     const customer = await customersController.show(context as HttpContextContract)

//     assert.deepEqual(customer, customerData)
//   })

//   test('should create a new customer', async ({ assert }) => {
//     const trxStub = sinon
//       .stub(Database.prototype, 'transaction')
//       .callsFake(
//         async (
//           callback: (trx: TransactionClientContract) => Promise<any>,
//           options?: { isolationLevel?: string }
//         ) => {
//           const trx = {
//             commit: sinon.stub(),
//             rollback: sinon.stub(),
//           } as unknown as TransactionClientContract
//           return callback(trx)
//         }
//       )

//     const requestData = {
//       name: 'New User',
//       cpf: '123.456.789-01',
//       address,
//       telephone,
//     }
//     const validatedData = {
//       name: 'New User',
//       cpf: '123.456.789-01',
//       address,
//       telephone,
//     }

//     context.request.only.withArgs(customerAttributeFields).returns(requestData)
//     const validateStub = sinon.stub(createCustomerValidator, 'validate').resolves(validatedData)
//     const findByStub = sinon.stub(Customer, 'findBy').resolves(null)
//     const customerStub = sinon.stub(Customer.prototype, 'save').resolves()
//     const createAddressStub = sinon.stub(Customer.prototype.related('address'), 'create').resolves()
//     const createTelephoneStub = sinon
//       .stub(Customer.prototype.related('telephone'), 'create')
//       .resolves()

//     // const trxStub = {
//     //   useTransaction: sinon.stub(),
//     //   commit: sinon.stub(),
//     //   rollback: sinon.stub(),
//     // }
//     // sinon.stub(db, 'transaction').callsFake(async (cb) => {
//     //   await cb(trxStub)
//     // })

//     await customersController.store(context as HttpContextContract)

//     assert.isTrue(context.response.created.calledOnce)
//     assert.isTrue(context.response.created.calledOnce)
//     assert.isTrue(trxStub.calledOnce)
//     assert.isTrue(customerStub.calledOnce)
//     assert.isTrue(createAddressStub.calledOnce)
//     assert.isTrue(createTelephoneStub.calledOnce)
//   })

//   // test('should update an existing customer', async ({ assert }) => {
//   //   const requestData = {
//   //     name: 'New User2',
//   //     cpf: '123.456.789-01',
//   //     address,
//   //     telephone,
//   //   }
//   //   const validatedData = {
//   //     name: 'New User2',
//   //     cpf: '123.456.789-01',
//   //     address,
//   //     telephone,
//   //   }
//   //   const customerData = { id: 1, ...validatedData }

//   //   context.params.id = 1
//   //   context.request.only.withArgs(customerAttributeFields).returns(requestData)
//   //   sinon.stub(updateCustomerValidator, 'validate').resolves(validatedData)
//   //   sinon.stub(Customer, 'findOrFail').resolves(customerData as any)
//   //   sinon.stub(Customer, 'findByOrFail').resolves(customerData as any)

//   //   const saveStub = sinon.stub(customerData, 'save').resolves()
//   //   const addressStub = sinon
//   //     .stub(customerData.related('address').query(), 'firstOrFail')
//   //     .resolves({
//   //       merge: sinon.stub().returnsThis(),
//   //       save: sinon.stub().resolves(),
//   //     } as any)
//   //   const telephoneStub = sinon
//   //     .stub(customerData.related('telephone').query(), 'firstOrFail')
//   //     .resolves({
//   //       merge: sinon.stub().returnsThis(),
//   //       save: sinon.stub().resolves(),
//   //     } as any)

//   //   await customersController.update(context as HttpContextContract)

//   //   assert.isTrue(context.response.send.calledOnce)
//   // })

//   test('should delete an existing customer', async ({ assert }) => {
//     const customerData = new Customer()
//     customerData.id = 1
//     customerData.name = 'User'
//     customerData.cpf = '12345678901'

//     context.params.id = 1

//     sinon.stub(Customer, 'findOrFail').resolves(customerData)
//     const deleteStub = sinon.stub(customerData, 'delete').resolves()

//     await customersController.destroy(context as HttpContextContract)

//     assert.isTrue(deleteStub.calledOnce)
//     assert.isTrue(context.response.noContent.calledOnce)
//   })

//   test('should throw an exception due to not find a user to delete', async ({ assert }) => {
//     context.params.id = 1

//     const findOrFailStub = sinon.stub(Customer, 'findOrFail').throwsException()

//     await customersController.destroy(context as HttpContextContract)

//     assert.isTrue(context.response.notFound.calledOnce)
//     findOrFailStub.restore()
//   })
// })
