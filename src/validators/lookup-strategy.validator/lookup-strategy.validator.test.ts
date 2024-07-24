import validateLookupStrategy from './lookup-strategy.validator'

describe('lookup strategy validator', () => {
  describe('validateLookupStrategy', () => {
    it('passes if same-dir is provided', () => {
      expect(() => {
        validateLookupStrategy('same-dir')
      }).not.toThrow()
    })

    it('passes if sep-dir is provided with valid format', () => {
      expect(() => {
        validateLookupStrategy('sep-dir:path/to/dir')
      }).not.toThrow()
    })

    it('does not pass if sep-dir is provided with wrong format', () => {
      expect(() => {
        validateLookupStrategy('sep-dir:')
      }).toThrow()

      expect(() => {
        validateLookupStrategy('sep-dir:path:to:dir')
      }).toThrow()
    })
  })
})
