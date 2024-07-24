import { treeMock } from '../mocks/tree.mock'
import getChangedFileNames from './changed-files.service/changed-files.service'
import createComment from './comment.service/comment.service'
import { run } from './main'
import findMissingTests from './missing-tests.service/missing-tests.service'
import getProjectTreeByPRNumber from './project-tree.service/project-tree.service'
import validateLookupStrategy from './validators/lookup-strategy.validator/lookup-strategy.validator'
import { LookupStrategy } from './types/lookup-strategy.enum'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const core = require('@actions/core')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const github = require('@actions/github')

describe('action', () => {
  it('calls validateLookupStrategy', async () => {
    await run()
    expect(validateLookupStrategy).toHaveBeenCalledWith(LookupStrategy.SAME_DIR)
  })

  it('calls getOctokit', async () => {
    await run()
    expect(github.getOctokit).toHaveBeenCalledWith(
      'ji2hx93omx6nwi9o2184nxi9xgj35kn2'
    )
  })

  it('calls getChangedFileNames', async () => {
    await run()
    expect(getChangedFileNames).toHaveBeenCalledWith(
      { oct: true },
      'owner123',
      'test-repo-123',
      3877,
      '\\[]*!',
      'src',
      'test.js'
    )
  })

  it('calls getProjectTreeByPRNumber', async () => {
    await run()
    expect(getProjectTreeByPRNumber).toHaveBeenCalledWith(
      { oct: true },
      'owner123',
      'test-repo-123',
      3877
    )
  })

  it('calls findMissingTests', async () => {
    await run()
    expect(findMissingTests).toHaveBeenCalledWith(
      ['src/file1.js', 'src/file2.js'],
      [...treeMock.tree],
      'test.js',
      LookupStrategy.SAME_DIR
    )
  })

  it('calls createComment', async () => {
    await run()
    expect(createComment).toHaveBeenCalledWith(
      { oct: true },
      'owner123',
      'test-repo-123',
      3877,
      [
        {
          srcPath: 'src/file1.js',
          testPath: 'src/file1.test.js'
        }
      ]
    )
  })

  it('does not call createComment is all tests are provided', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    findMissingTests.mockReturnValueOnce([])
    await run()
    expect(createComment).not.toHaveBeenCalled()
  })

  it('calls core.setFailed if error has been thrown', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    findMissingTests.mockImplementationOnce(() => {
      throw new Error('error')
    })
    await run()
    expect(core.setFailed).toHaveBeenCalledWith('error')
  })
})

jest.mock('@actions/core', () => {
  const cr = {
    getInput: jest.fn(
      (key: string) =>
        ({
          owner: 'owner123',
          repo: 'test-repo-123',
          pr_number: '3877',
          token: 'ji2hx93omx6nwi9o2184nxi9xgj35kn2',
          test_file_ext: 'test.js',
          lookup_strategy: LookupStrategy.SAME_DIR,
          ignore_pattern: '\\[]*!',
          root_directory: 'src'
        })[key]
    ),
    setFailed: jest.fn()
  }
  return cr
})
jest.mock('@actions/github', () => {
  const gh = {
    getOctokit: jest.fn(() => ({ oct: true }))
  }
  return gh
})
jest.mock('./changed-files.service/changed-files.service', () =>
  jest.fn(() => ['src/file1.js', 'src/file2.js'])
)
jest.mock('./missing-tests.service/missing-tests.service', () =>
  jest.fn(() => [
    {
      srcPath: 'src/file1.js',
      testPath: 'src/file1.test.js'
    }
  ])
)
jest.mock('./comment.service/comment.service', () => jest.fn())
jest.mock('./project-tree.service/project-tree.service', () =>
  jest.fn(() => [...treeMock.tree])
)
jest.mock(
  './validators/lookup-strategy.validator/lookup-strategy.validator',
  () => jest.fn()
)
