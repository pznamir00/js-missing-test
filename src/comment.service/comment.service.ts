import { GitHub } from '@actions/github/lib/utils'
import { SrcAndTestFilesPair } from '../types/src-and-test-files-pair.type'

export default async function createComment(
  octokit: InstanceType<typeof GitHub>,
  owner: string,
  repo: string,
  prNumber: number,
  missingTestFiles: SrcAndTestFilesPair[]
) {
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: `
    Pull request #${prNumber} is missing ${missingTestFiles.length} tests:
    ${missingTestFiles
      .map(
        value =>
          `- source file: ${value.srcPath} is missing ${value.testPath} test file\n`
      )
      .join('')}
    `
  })
}
