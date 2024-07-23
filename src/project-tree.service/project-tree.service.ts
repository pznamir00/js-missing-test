import { GitHub } from '@actions/github/lib/utils'
import { TreeRow } from '../types/tree-row.type'

async function getCommitSHAByPRNumber(
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  prNumber: number
) {
  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber
  })
  return pullRequest.head.sha
}

async function getTreeSHAByCommitSHA(
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  commitSha: string
) {
  const { data: commit } = await octokit.rest.git.getCommit({
    owner,
    repo,
    commit_sha: commitSha
  })
  return commit.tree.sha
}

async function getTreeBySHA(
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  treeSha: string
) {
  const {
    data: { tree }
  } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: treeSha,
    recursive: 'true'
  })
  return tree as TreeRow[]
}

export default async function getProjectTreeByPRNumber(
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  prNumber: number
) {
  const commitSha = await getCommitSHAByPRNumber(octokit, owner, repo, prNumber)
  const treeSha = await getTreeSHAByCommitSHA(octokit, owner, repo, commitSha)
  const tree = await getTreeBySHA(octokit, owner, repo, treeSha)
  return tree
}
