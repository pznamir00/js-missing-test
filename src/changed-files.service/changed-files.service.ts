import { GitHub } from '@actions/github/lib/utils'
import fileExt from 'file-extension'

const JS_FILE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx']

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

function getOnlyJSFiles(files: string[]) {
  return files.filter(fn => JS_FILE_EXTENSIONS.includes(fileExt(fn)))
}

export default async function getChangedFileNames(
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  prNumber: number
) {
  const changedFiles = await getChangedFilesList(octokit, owner, repo, prNumber)
  const changedFilenames = changedFiles.map(file => file.filename)
  return getOnlyJSFiles(changedFilenames)
}
