import AuthController from '#controllers/auth_controller'
import User from '#models/user'
import { loginValidator, signUpValidator } from '#validators/auth_validator'
import { test } from '@japa/runner'
import sinon from 'sinon'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

test.group('AuthController', (group) => {
  let authController: AuthController
  let context: Partial<HttpContextContract>

  // Setup before each test
  group.each.setup(() => {
    authController = new AuthController()

    // Mock HttpContext
    context = {
      request: {
        only: sinon.stub(),
        all: sinon.stub(),
      } as any,
      response: {
        conflict: sinon.stub(),
        created: sinon.stub(),
      } as any,
      auth: {
        use: sinon.stub().returnsThis(),
        generate: sinon.stub(),
      } as any,
    }
  })

  // Restore the default sandbox after each test
  group.each.teardown(() => {
    sinon.restore()
  })

  test('should register a new user', async ({ assert }) => {
    const requestData = { fullName: 'John Doe', email: 'john@example.com', password: 'password' }
    const validatedData = { fullName: 'John Doe', email: 'john@example.com', password: 'password' }

    context.request.only.withArgs(['fullName', 'email', 'password']).returns(requestData)
    sinon.stub(signUpValidator, 'validate').resolves(validatedData)
    sinon.stub(User, 'findBy').resolves(null)
    sinon.stub(User, 'create').resolves(validatedData as any)

    await authController.signUp(context as HttpContextContract)

    assert.isTrue(context.response.created.calledWith(validatedData))
  })

  test('should not register a user if email is already registered', async ({ assert }) => {
    const requestData = { fullName: 'John Doe', email: 'john@example.com', password: 'password' }
    const validatedData = { fullName: 'John Doe', email: 'john@example.com', password: 'password' }

    context.request.only.withArgs(['fullName', 'email', 'password']).returns(requestData)
    sinon.stub(signUpValidator, 'validate').resolves(validatedData)
    sinon.stub(User, 'findBy').resolves({} as any)

    await authController.signUp(context as HttpContextContract)

    assert.isTrue(context.response.conflict.calledWith({ message: 'User already registered' }))
  })

  test('should authenticate the user', async ({ assert }) => {
    const requestData = { email: 'john@example.com', password: 'password' }
    const user = { id: 1, email: 'john@example.com' }

    context.request.all.returns(requestData)
    sinon.stub(loginValidator, 'validate').resolves()
    sinon.stub(User, 'verifyCredentials').resolves(user as any)
    context.auth.generate.resolves('jwt_token')

    const result = await authController.login(context as HttpContextContract)

    assert.equal(result, 'jwt_token')
  })
})
