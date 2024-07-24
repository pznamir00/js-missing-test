import { LookupStrategy } from '../types/lookup-strategy.enum'
import { SrcAndTestFilesPair } from '../types/src-and-test-files-pair.type'
import { TreeRow } from '../types/tree-row.type'

function srcFilePathToTestFilePath(
  srcFilePath: string,
  testFileExt: string,
  lookupStrategy: string
): string {
  const removeExtension = (path: string) => {
    const srcParts = path.split('.')
    srcParts.pop()
    return srcParts.join('.')
  }

  if (lookupStrategy === LookupStrategy.SAME_DIR) {
    const srcWithoutExt = removeExtension(srcFilePath)
    return `${srcWithoutExt}.${testFileExt}`
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, dirPath] = lookupStrategy.split(':')
    const srcFile = srcFilePath.split('/').pop() as string
    const srcFileName = removeExtension(srcFile)
    return `${dirPath}/${srcFileName}.${testFileExt}`
  }
}

export default function findMissingTests(
  changedFileNames: string[],
  tree: TreeRow[],
  testFileExt: string,
  lookupStrategy: string
): SrcAndTestFilesPair[] {
  return changedFileNames
    .map(
      (fn): SrcAndTestFilesPair => ({
        srcPath: fn,
        testPath: srcFilePathToTestFilePath(fn, testFileExt, lookupStrategy)
      })
    )
    .filter(pair => !tree.find(row => row.path === pair.testPath))
}
