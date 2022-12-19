const { generate } = require('@graphql-codegen/cli')
const path = require('path')

module.exports.generateTypesFiles = async function generateTypesFiles(
  documentPath,
  localTypesPath,
  rootPath,
  codegenConfig,
  lastRunAt,
  options
) {
  const { name: packageName } = require(path.resolve(rootPath, 'package.json'))

  const enumsPath = path.join(options.schemaTypesPath, 'enums.ts')
  const schemaTypesPath = path.join(options.schemaTypesPath, 'schema.ts')

  const typesPath = options.useWorkspaces
    ? path.join(packageName, path.relative(rootPath, options.schemaTypesPath), 'schema')
    : path.join(path.relative(path.dirname(documentPath), options.schemaTypesPath), 'schema')

  const generates = !lastRunAt
    ? {
        [enumsPath]: {
          config: {
            onlyEnums: true,
          },
          plugins: ['typescript'],
        },
        [schemaTypesPath]: {
          config: {
            enumValues: './enums',
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
        documents: [documentPath],
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
