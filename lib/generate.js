const fs = require('fs-extra')
const path = require('path')
const typescript = require('typescript')

const { generateTypesFiles } = require('./generateTypesFiles')
const { typescriptCompile } = require('./typescriptCompile')

const declarationCompilerOptions = {
  declaration: true,
  emitDeclarationOnly: true,
  skipLibCheck: true,
  noEmit: false,
}

const defaultCodegenConfig = {
  silent: true,
  skipGraphQLImport: false,
}

module.exports.generate = async function generate(documentPath, localTypesPath, rootPath, isFirstRun, options) {
  const typescriptConfigPath = path.resolve(rootPath, options.typescriptConfig)

  const { error, config } = typescript.readConfigFile(typescriptConfigPath, typescript.sys.readFile)

  if (error) {
    throw new Error(error.messageText)
  }

  const { errors, options: typescriptConfigOptions } = typescript.convertCompilerOptionsFromJson(config.compilerOptions)

  if (errors.length > 0) {
    throw new Error(errors)
  }

  const compilerOptions = {
    ...typescriptConfigOptions,
    ...declarationCompilerOptions,
  }

  const codegenConfig = {
    ...defaultCodegenConfig,
    schema: options.schema,
  }

  const typesFiles = await generateTypesFiles(
    documentPath,
    localTypesPath,
    rootPath,
    codegenConfig,
    isFirstRun,
    options
  )

  if (options.emitFiles) {
    for (const typesFile of typesFiles) {
      const { content, declarative, filename } = typesFile

      if (content.length === 0) {
        continue
      }

      if (declarative) {
        const { content, filename } = await typescriptCompile(typesFile.filename, typesFile.content, compilerOptions)

        await fs.outputFile(filename, content)
      } else {
        await fs.outputFile(filename, content)
      }
    }
  }

  return typesFiles
}
