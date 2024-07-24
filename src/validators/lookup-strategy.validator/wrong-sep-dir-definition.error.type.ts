export default class WrongSeparateDirectoryDefinitionError extends Error {
  constructor() {
    super(
      'Wrong separate directory definition. Correct definition should be "sep-dir:<path/to/dir>"'
    )
  }
}
