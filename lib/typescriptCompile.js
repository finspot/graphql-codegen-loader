const typescript = require('typescript')

module.exports.typescriptCompile = function typescriptCompile(sourceFilename, sourceContent, compilerOptions) {
  return new Promise((resolve, reject) => {
    const compilerHost = typescript.createCompilerHost(compilerOptions)

    compilerHost.getSourceFile = (filename, languageVersion) => {
      if (filename === sourceFilename) {
        return typescript.createSourceFile(filename, sourceContent, typescript.ScriptTarget.Latest)
      }

      const sourceText = typescript.sys.readFile(filename)

      return typescript.createSourceFile(filename, sourceText, languageVersion)
    }

    compilerHost.writeFile = (filename, content, writeByteOrderMark, onError, sourceFiles) => {
      const [{ fileName }] = sourceFiles

      if (fileName !== sourceFilename) {
        return
      }

      resolve({ filename, content })
    }

    const compilerProgram = typescript.createProgram([sourceFilename], compilerOptions, compilerHost)
    const result = compilerProgram.emit()

    if (result.emitSkipped) {
      reject('An error occured while transpiling the typescript file.')
    }
  })
}
