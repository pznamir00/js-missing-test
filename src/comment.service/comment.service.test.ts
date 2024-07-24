import { GitHub } from '@actions/github/lib/utils'
import createComment from './comment.service'

describe('comment service', () => {
  describe('createComment', () => {
    it('calls rest.issues.createComment', async () => {
      const { octokit, owner, repo, prNumber } = setup()
      await createComment(octokit, owner, repo, prNumber, [
        {
          srcPath: 'src/file1.js',
          testPath: 'src/file1.test.js'
        },
        {
          srcPath: 'src/file2.js',
          testPath: 'src/file2.test.js'
        },
        {
          srcPath: 'src/file3.js',
          testPath: 'src/file3.test.js'
        },
        {
          srcPath: 'src/file4.js',
          testPath: 'src/file4.test.js'
        }
      ])
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        octokit.rest.issues.createComment.mock.calls[0][0].body
      ).toMatchSnapshot()
    })
  })
})

function setup() {
  const octokit = {
    rest: {
      issues: {
        createComment: jest.fn()
      }
    }
  } as unknown as InstanceType<typeof GitHub>
  const owner = 'owner123'
  const repo = 'test-project-123'
  const prNumber = 2137
  return { octokit, owner, repo, prNumber }
}
