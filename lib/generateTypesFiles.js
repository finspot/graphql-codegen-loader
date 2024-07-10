const { generate } = require('@graphql-codegen/cli')
const path = require('path')

const ENUMS_PATHNAME = './enums'
const SCHEMA_PATHNAME = './schema'

module.exports.generateTypesFiles = async function generateTypesFiles(
  documentPath,
  localTypesPath,
  rootPath,
  codegenConfig,
  isFirstRun,
  options
) {
  const { name } = require(path.resolve(rootPath, 'package.json'))

  const enumsPath = path.join(options.schemaTypesPath, `${ENUMS_PATHNAME}.ts`)
  const schemaTypesPath = path.join(options.schemaTypesPath, `${SCHEMA_PATHNAME}.ts`)

  const enumValues = options.useWorkspaces
    ? path.join(name, path.relative(rootPath, options.schemaTypesPath), ENUMS_PATHNAME)
    : ENUMS_PATHNAME

  const typesPath = options.useWorkspaces
    ? path.join(name, path.relative(rootPath, options.schemaTypesPath), SCHEMA_PATHNAME)
    : path.join(path.relative(path.dirname(documentPath), options.schemaTypesPath), SCHEMA_PATHNAME)

  const generates = isFirstRun
    ? {
        [enumsPath]: {
          config: {
            onlyEnums: true,
          },
          plugins: ['typescript'],
        },
        [schemaTypesPath]: {
          config: {
            enumValues,
          },
          plugins: ['typescript'],
        },
      }
    : {}

  const plugins = options.plugins.map(plugin => {
    if (typeof plugin === 'string') {
      return {
        [plugin]: {
          importOperationTypesFrom: '',
        },
      }
    }

    return {
      [plugin.plugin]: {
        importOperationTypesFrom: '',
        ...(plugin?.options ?? {}),
      },
    }
  })

  const config = {
    ...codegenConfig,
    generates: {
      ...generates,
      [localTypesPath]: {
        documents: [...options.fragmentsPaths, documentPath],
        plugins: [
          {
            'typescript-operations': {
              importOperationTypesFrom: '',
            },
          },
          ...plugins,
        ],
        preset: 'import-types',
        presetConfig: {
          typesPath,
        },
      },
    },
  }

  try {
    const typesFiles = await generate(config, false)

    return typesFiles.map(typesFile => ({
      ...typesFile,
      declarative: typesFile.filename !== enumsPath,
    }))
  } catch (error) {
    throw new Error(`An error occured while generating types files: ${error}`)
  }
}
