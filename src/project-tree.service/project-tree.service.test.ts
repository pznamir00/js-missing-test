import { GitHub } from '@actions/github/lib/utils'
import { treeMock } from '../../mocks/tree.mock'
import getProjectTreeByPRNumber from './project-tree.service'

describe('project tree service', () => {
  describe('getProjectTreeByPRNumber', () => {
    it('calls rest.pulls.get', async () => {
      const { octokit, owner, repo, prNumber } = setup()
      await getProjectTreeByPRNumber(octokit, owner, repo, prNumber)
      expect(octokit.rest.pulls.get).toHaveBeenCalledWith({
        owner,
        repo,
        pull_number: prNumber
      })
    })

    it('calls rest.git.getCommit', async () => {
      const { octokit, owner, repo, prNumber } = setup()
      await getProjectTreeByPRNumber(octokit, owner, repo, prNumber)
      expect(octokit.rest.git.getCommit).toHaveBeenCalledWith({
        owner,
        repo,
        commit_sha: '1234'
      })
    })

    it('calls rest.git.getTree', async () => {
      const { octokit, owner, repo, prNumber } = setup()
      await getProjectTreeByPRNumber(octokit, owner, repo, prNumber)
      expect(octokit.rest.git.getTree).toHaveBeenCalledWith({
        owner,
        repo,
        tree_sha: '5698',
        recursive: 'true'
      })
    })

    it('returns tree', async () => {
      const { octokit, owner, repo, prNumber } = setup()
      const res = await getProjectTreeByPRNumber(octokit, owner, repo, prNumber)
      expect(res).toEqual([...treeMock.tree])
    })
  })
})

function setup() {
  const octokit = {
    rest: {
      pulls: {
        get: jest.fn(() => ({
          data: {
            head: {
              sha: '1234'
            }
          }
        }))
      },
      git: {
        getCommit: jest.fn(() => ({
          data: {
            tree: {
              sha: '5698'
            }
          }
        })),
        getTree: jest.fn(() => ({
          data: {
            tree: [...treeMock.tree]
          }
        }))
      }
    }
  } as unknown as InstanceType<typeof GitHub>
  const owner = 'owner123'
  const repo = 'test-project-123'
  const prNumber = 2137
  return { octokit, owner, repo, prNumber }
}
