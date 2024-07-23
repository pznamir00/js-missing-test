import { GitHub } from '@actions/github/lib/utils'

async function getChangedFilesList(
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  prNumber: number
) {
  const { data: changedFiles } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber
  })

  return changedFiles
}

export default async function getChangedFileNames(
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  prNumber: number
) {
  const changedFiles = await getChangedFilesList(octokit, owner, repo, prNumber)
  const changedFilenames = changedFiles.map(file => file.filename)
  return changedFilenames
}
