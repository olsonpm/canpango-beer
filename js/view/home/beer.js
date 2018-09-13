//---------//
// Imports //
//---------//

import React, { Component } from 'react'

import eventManager from '../../event-manager'
import { bindAllFunctions } from '../../utils'

//
//------//
// Main //
//------//

class Beer extends Component {
  constructor() {
    super()

    bindAllFunctions(this)
  }

  beerClicked() {
    const { id } = this.props

    return eventManager.publish('goToBeer', [id])
  }

  render() {
    return (
      <li>
        <button type="button" onClick={this.beerClicked}>
          <h5>{this.props.name}</h5>
        </button>
      </li>
    )
  }
}

//
//---------//
// Exports //
//---------//

export default Beer
