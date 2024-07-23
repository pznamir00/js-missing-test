import { LookupStrategy } from '../types/lookup-strategy.enum'
import { SrcAndTestFilesPair } from '../types/src-and-test-files-pair.type'
import { TreeRow } from '../types/tree-row.type'

function srcFilePathToTestFilePath(
  srcFilePath: string,
  testFileExt: string,
  lookupStrategy: string
): string {
  if (lookupStrategy === LookupStrategy.SAME_DIR) {
    const srcParts = srcFilePath.split('.')
    srcParts.pop()
    const srcWithoutExt = srcParts.join('.')
    return `${srcWithoutExt}.${testFileExt}`
  } else {
    const dirPath = lookupStrategy.split(':').pop()
    const srcFile = srcFilePath.split('/').pop()
    const srcFileName = srcFile?.split('.')[0]
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
    .filter(pair => tree.find(row => row.path === pair.testPath))
}
