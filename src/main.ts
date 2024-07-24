import getChangedFileNames from './changed-files.service/changed-files.service'
import findMissingTests from './missing-tests.service/missing-tests.service'
import createComment from './comment.service/comment.service'
import getProjectTreeByPRNumber from './project-tree.service/project-tree.service'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const core = require('@actions/core')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const github = require('@actions/github')

export async function run() {
  try {
    const owner = core.getInput('owner', { required: true })
    const repo = core.getInput('repo', { required: true })
    const prNumber = +core.getInput('pr_number', { required: true })
    const token = core.getInput('token', { required: true })
    const testFileExt = core.getInput('test_file_ext', { required: true })
    const lookupStrategy = core.getInput('lookup_strategy', { required: true })

    const oct = github.getOctokit(token)
    const changedFileNames = await getChangedFileNames(
      oct,
      owner,
      repo,
      prNumber
    )
    const tree = await getProjectTreeByPRNumber(oct, owner, repo, prNumber)
    const missingTestFiles = findMissingTests(
      changedFileNames,
      tree,
      testFileExt,
      lookupStrategy
    )
    await createComment(oct, owner, repo, prNumber, missingTestFiles)
  } catch (error: unknown) {
    core.setFailed((error as Error).message)
  }
}
