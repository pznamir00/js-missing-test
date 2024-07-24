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

function removeFilesOutOfRootDir(files: string[], rootDir: string) {
  return files.filter(fn => fn.includes(`${rootDir}/`))
}

function getOnlyJSFiles(files: string[]) {
  return files.filter(fn => JS_FILE_EXTENSIONS.includes(fileExt(fn)))
}

function removeFilesToIgnore(files: string[], ignorePattern: RegExp) {
  return files.filter(fn => fn.match(ignorePattern))
}

function removeTestFiles(files: string[], testFileExt: string) {
  return files.filter(fn => !fn.endsWith(testFileExt))
}

export default async function getChangedFileNames(
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  prNumber: number,
  ignorePattern: string,
  rootDir: string,
  testFileExt: string
) {
  const changedFiles = await getChangedFilesList(octokit, owner, repo, prNumber)
  let filenames = changedFiles.map(file => file.filename)
  filenames = getOnlyJSFiles(filenames)
  filenames = removeFilesOutOfRootDir(filenames, rootDir)
  filenames = removeTestFiles(filenames, testFileExt)
  return removeFilesToIgnore(filenames, new RegExp(ignorePattern))
}
