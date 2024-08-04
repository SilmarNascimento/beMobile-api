import { configure } from '@japa/runner'

configure({
  files: ['test/**/*.spec.ts'],
  plugins: [require('@japa/typescript').default(), require('@japa/spec-reporter').default()],
})
