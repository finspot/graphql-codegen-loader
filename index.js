const { validate } = require('schema-utils')

const { generate } = require('./lib/generate')

const cache = new Map()

const defaultOptions = {
  emitFiles: false,
  plugins: [],
  typescriptConfig: 'tsconfig.json',
  useWorspaces: false,
}

const schema = {
  additionalProperties: false,
  properties: {
    emitFiles: {
      type: 'boolean',
    },
    plugins: {
      items: {
        anyOf: [
          { type: 'string' },
          {
            properties: {
              options: { type: 'object' },
              plugin: { type: 'string' },
            },
            required: ['plugin'],
            type: 'object',
          },
        ],
      },
      type: 'array',
    },
    schema: {
      type: 'string',
    },
    schemaTypesPath: {
      type: 'string',
    },
    typescriptConfig: {
      type: 'string',
    },
    useWorkspaces: {
      type: 'boolean',
    },
  },
  required: ['schema', 'schemaTypesPath'],
  type: 'object',
}

module.exports = function (content, map, meta) {
  const callback = this.async()
  const inputOptions = this.getOptions()

  validate(schema, inputOptions, {
    name: 'GraphQL codegen',
  })

  const options = {
    ...defaultOptions,
    ...inputOptions,
  }

  const resourcePath = this.resourcePath
  const typescriptPath = `${resourcePath}.ts`

  const lastRunAt = cache.get('lastRunAt')

  cache.set('lastRunAt', Date.now())

  generate(resourcePath, typescriptPath, this.rootContext, lastRunAt, options)
    .then(typesFiles => {
      for (const typesFile of typesFiles) {
        if (typesFile.filename === typescriptPath) {
          return callback(null, typesFile.content, map, meta)
        }
      }

      callback('No files are being produced by the loader.')
    })
    .catch(error => {
      callback(error)
    })

  this.resourcePath = typescriptPath
}
