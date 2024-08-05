/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
const AuthController = () => import('#controllers/auth_controller')
const CustomersController = () => import('#controllers/customers_controller')
const ProductsController = () => import('#controllers/products_controller')
const SalesController = () => import('#controllers/sales_controller')

router.get('/', async () => {
  return {
    status: 'application is running',
  }
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar("/swagger"); to use Scalar instead
  // return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
})

router.post('/api/register', [AuthController, 'signUp'])
router.post('/api/login', [AuthController, 'login'])

router
  .group(() => {
    router.get('/', [CustomersController, 'index'])
    router.get('/:id', [CustomersController, 'show'])
    router.post('/', [CustomersController, 'store'])
    router.put('/:id', [CustomersController, 'update'])
    router.delete('/:id', [CustomersController, 'destroy'])
  })
  .prefix('api/customers')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [ProductsController, 'index'])
    router.get('/:id', [ProductsController, 'show'])
    router.post('/', [ProductsController, 'store'])
    router.put('/:id', [ProductsController, 'update'])
    router.delete('/:id', [ProductsController, 'destroy'])
  })
  .prefix('api/products')
  .use(middleware.auth())

router.post('/api/sales', [SalesController, 'store']).use(middleware.auth())
