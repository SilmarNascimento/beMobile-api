import vine from '@vinejs/vine'
import { ProductStatus } from '../types/product_status.js'

export const productAttributeFields = [
  'productName',
  'image',
  'description',
  'category',
  'brand',
  'price',
  'supplier',
  'status',
]

export const createProductValidator = vine.compile(
  vine.object({
    productName: vine.string().trim().minLength(3),
    image: vine.string(),
    description: vine.string(),
    category: vine.string(),
    brand: vine.string(),
    price: vine.number(),
    supplier: vine.string(),
    status: vine.enum(Object.values(ProductStatus)),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    productName: vine.string().trim().minLength(3).optional(),
    image: vine.string().optional(),
    description: vine.string().optional(),
    category: vine.string().optional(),
    brand: vine.string().optional(),
    price: vine.number().optional(),
    supplier: vine.string().optional(),
    status: vine.enum(Object.values(ProductStatus)).optional(),
    restore: vine.boolean().optional(),
  })
)
