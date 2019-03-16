import ora from 'ora'
import C from '../common/constants'

const spinner = ora({
  spinner: C.HEARTS_SPINNER,
  color: 'yellow'
}).start()

export default function getOra() {
  return spinner
}
