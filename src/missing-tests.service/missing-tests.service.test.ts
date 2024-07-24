import { treeMock } from '../../mocks/tree.mock'
import { LookupStrategy } from '../types/lookup-strategy.enum'
import findMissingTests from './missing-tests.service'

describe('missing tests service', () => {
  describe('findMissingTests', () => {
    it('returns valid files pair for same-dir mode', () => {
      const { tree } = setup()
      const changedFileNames = [
        'src/utils.js',
        'src/changed-files.service/changed-files.service.js'
      ]
      const result = findMissingTests(
        changedFileNames,
        tree,
        'test.js',
        LookupStrategy.SAME_DIR
      )
      expect(result).toEqual([
        {
          srcPath: 'src/utils.js',
          testPath: 'src/utils.test.js'
        },
        {
          srcPath: 'src/changed-files.service/changed-files.service.js',
          testPath: 'src/changed-files.service/changed-files.service.test.js'
        }
      ])
    })

    it('returns valid files pair for sep-dir mode', () => {
      const { tree } = setup()
      const changedFileNames = [
        'src/utils.js',
        'src/main.js',
        'src/index.js',
        'src/changed-files.service/changed-files.service.js'
      ]
      const result = findMissingTests(
        changedFileNames,
        tree,
        'test.js',
        `${LookupStrategy.SEP_DIR}:__tests__`
      )
      expect(result).toEqual([
        {
          srcPath: 'src/utils.js',
          testPath: '__tests__/utils.test.js'
        },
        {
          srcPath: 'src/main.js',
          testPath: '__tests__/main.test.js'
        },
        {
          srcPath: 'src/changed-files.service/changed-files.service.js',
          testPath: '__tests__/changed-files.service.test.js'
        }
      ])
    })
  })
})

function setup() {
  const tree = [...treeMock.tree]
  return { tree }
}
