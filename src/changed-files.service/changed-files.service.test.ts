import { GitHub } from '@actions/github/lib/utils'
import getChangedFileNames from './changed-files.service'

describe('changed files service', () => {
  describe('getChangedFileNames', () => {
    it('calls listFiles', async () => {
      const { octokit, owner, repo, prNumber } = setup()
      await getChangedFileNames(octokit, owner, repo, prNumber)
      expect(octokit.rest.pulls.listFiles).toHaveBeenCalledWith({
        owner,
        repo,
        pull_number: prNumber
      })
    })

    it('returns file names list', async () => {
      const { octokit, owner, repo, prNumber } = setup()
      const result = await getChangedFileNames(octokit, owner, repo, prNumber)
      expect(result).toEqual(['file1.js', 'file2.js', 'file3.js', 'file4.js'])
    })

    it('returns only js files', async () => {
      const { octokit, owner, repo, prNumber } = setup()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      octokit.rest.pulls.listFiles.mockReturnValueOnce({
        data: [
          { filename: 'file.js' },
          { filename: 'file.html' },
          { filename: 'file.yml' },
          { filename: 'file.tsx' }
        ]
      })
      const result = await getChangedFileNames(octokit, owner, repo, prNumber)
      expect(result).toEqual(['file.js', 'file.tsx'])
    })
  })
})

function setup() {
  const octokit = {
    rest: {
      pulls: {
        listFiles: jest.fn(() => ({
          data: [
            { filename: 'file1.js' },
            { filename: 'file2.js' },
            { filename: 'file3.js' },
            { filename: 'file4.js' }
          ]
        }))
      }
    }
  } as unknown as InstanceType<typeof GitHub>
  const owner = 'owner123'
  const repo = 'test-project-123'
  const prNumber = 2137
  return { octokit, owner, repo, prNumber }
}
