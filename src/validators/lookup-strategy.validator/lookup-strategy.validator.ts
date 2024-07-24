import { LookupStrategy } from '../../types/lookup-strategy.enum'
import WrongSeparateDirectoryDefinitionError from './wrong-sep-dir-definition.error.type'

export default function validateLookupStrategy(value: string) {
  if (value === LookupStrategy.SAME_DIR) {
    return
  }

  if (!value.match(/^sep-dir:(?:[^/:]+\/?)+$/)) {
    throw new WrongSeparateDirectoryDefinitionError()
  }
}
