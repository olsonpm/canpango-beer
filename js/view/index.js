//---------//
// Imports //
//---------//

import animate from 'velocity-animate'
import React, { Component } from 'react'

import eventManager from '../event-manager'
import Beer from './beer'
import Home from './home'

import { bindAllFunctions, smoothScrollTo } from '../utils'

//
//------//
// Init //
//------//

const duration = 450,
  easing = 'easeOutSine',
  slide = {
    left: [`translateX(-100%)`, `translateX(0%)`],
    right: [`translateX(0%)`, `translateX(-100%)`],
  }

//
//------//
// Main //
//------//

class View extends Component {
  constructor() {
    super()

    bindAllFunctions(this)
    this.viewsRef = React.createRef()
    eventManager.subscribeTo('goToBeer', this.goToBeer)
    eventManager.subscribeTo('goHome', this.goHome)
  }

  goHome() {
    return Promise.all([this.hideBeerView(), this.showHomeView()])
  }

  goToBeer() {
    return Promise.all([this.hideHomeView(), this.showBeerView()]).then(
      maybeScrollToTop
    )
  }

  hideHomeView() {
    const homeViewEl = this.viewsRef.current.children[0]

    return animate(
      homeViewEl,
      { opacity: [0, 1], transform: slide.left },
      { duration, easing }
    )
  }

  showHomeView() {
    const homeViewEl = this.viewsRef.current.children[0]

    return animate(
      homeViewEl,
      { opacity: [1, 0], transform: slide.right },
      { duration, easing }
    )
  }

  hideBeerView() {
    const beerViewEl = this.viewsRef.current.children[1]

    return animate(
      beerViewEl,
      { opacity: [0, 1], transform: slide.right },
      { duration, easing }
    )
  }

  showBeerView() {
    const beerViewEl = this.viewsRef.current.children[1]

    return animate(
      beerViewEl,
      { opacity: [1, 0], transform: slide.left },
      { duration, easing }
    )
  }

  render() {
    // TODO: make this cleaner. There's probably a better html structure for
    //   this problem
    return (
      <ul className="views" ref={this.viewsRef}>
        <li className="home">
          <div className="content-container">
            <Home />
          </div>
        </li>
        <li className="beer">
          <div className="content-container">
            <Beer />
          </div>
        </li>
      </ul>
    )
  }
}

//
//------------------//
// Helper Functions //
//------------------//

function maybeScrollToTop() {
  return window.scrollY === 0 ? Promise.resolve() : smoothScrollTo(0)
}

//
//---------//
// Exports //
//---------//

export default View
