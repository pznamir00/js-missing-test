import { GitHub } from '@actions/github/lib/utils'
import getChangedFileNames from './changed-files.service'

describe('changed files service', () => {
  describe('getChangedFileNames', () => {
    it('calls listFiles', async () => {
      const props = setup()
      await getChangedFileNames(
        props.octokit,
        props.owner,
        props.repo,
        props.prNumber,
        props.ignorePattern,
        props.rootDir,
        props.testFileExt
      )
      expect(props.octokit.rest.pulls.listFiles).toHaveBeenCalledWith({
        owner: props.owner,
        repo: props.repo,
        pull_number: props.prNumber
      })
    })

    it('returns file names list', async () => {
      const props = setup()
      const result = await getChangedFileNames(
        props.octokit,
        props.owner,
        props.repo,
        props.prNumber,
        props.ignorePattern,
        props.rootDir,
        props.testFileExt
      )
      expect(result).toEqual([
        'src/file1.js',
        'src/file2.js',
        'src/file3.js',
        'src/file4.js'
      ])
    })

    it('returns only js files', async () => {
      const props = setup()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      props.octokit.rest.pulls.listFiles.mockReturnValueOnce({
        data: [
          { filename: 'src/file.js' },
          { filename: 'src/file.html' },
          { filename: 'src/file.yml' },
          { filename: 'src/file.tsx' }
        ]
      })
      const result = await getChangedFileNames(
        props.octokit,
        props.owner,
        props.repo,
        props.prNumber,
        props.ignorePattern,
        props.rootDir,
        props.testFileExt
      )
      expect(result).toEqual(['src/file.js', 'src/file.tsx'])
    })

    it('does not return files to ignore, out of root dir and test files', async () => {
      const props = setup()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      props.octokit.rest.pulls.listFiles.mockReturnValueOnce({
        data: [
          { filename: 'src/file1.type.ts' },
          { filename: 'src/file2.enum.ts' },
          { filename: 'src/file3.d.ts' },
          { filename: 'src/file4.js' },
          { filename: 'src/file5.ts' },
          { filename: 'file6.test.js' },
          { filename: 'src/file7.test.js' }
        ]
      })
      const result = await getChangedFileNames(
        props.octokit,
        props.owner,
        props.repo,
        props.prNumber,
        props.ignorePattern,
        props.rootDir,
        props.testFileExt
      )
      expect(result).toEqual(['src/file4.js', 'src/file5.ts'])
    })
  })
})

function setup() {
  const octokit = {
    rest: {
      pulls: {
        listFiles: jest.fn(() => ({
          data: [
            { filename: 'src/file1.js' },
            { filename: 'src/file2.js' },
            { filename: 'src/file3.js' },
            { filename: 'src/file4.js' }
          ]
        }))
      }
    }
  } as unknown as InstanceType<typeof GitHub>
  const owner = 'owner123'
  const repo = 'test-project-123'
  const prNumber = 2137
  const ignorePattern = '^(?!.*\\.(type|enum|d)\\.ts$).*\\.(ts|js|jsx|tsx)$'
  const rootDir = 'src'
  const testFileExt = 'test.js'
  return { octokit, owner, repo, prNumber, ignorePattern, rootDir, testFileExt }
}
