import { Container } from 'unstated'

import { bindAllFunctions } from '../utils'

class Edit extends Container {
  state = { canEdit: false }

  makeEditable(trueOrFalse) {
    return this.setState({ canEdit: trueOrFalse })
  }
}

const instance = new Edit()
bindAllFunctions(instance)

export default instance
