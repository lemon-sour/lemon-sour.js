import { YmlInterface } from '../interface/yml-interface'
import C from '../common/constants'

export default function ymlValidator(doc: YmlInterface) {
  if (!doc.hasOwnProperty('version')) {
    throw new Error('yml does not has version')
  }

  if (doc.version !== C.VALID_YML_VERSION) {
    throw new Error('yml version is not valid')
  }
}
