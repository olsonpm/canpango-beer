//---------//
// Imports //
//---------//

import animate from 'velocity-animate'
import classNames from 'classnames'
import React, { Component } from 'react'
import { Provider, Subscribe } from 'unstated'

import Beer from './beer'
import eventManager from '../../event-manager'
import store from '../../store'
import { bindAllFunctions, isEmpty_array as isEmpty } from '../../utils'
import {
  addBeer as AddBeerIcon,
  chevronDown as ChevronDownIcon,
  trash as TrashIcon,
} from '../../icons'

//
//------//
// Init //
//------//

// TODO: import duration from scss
const duration = 300

//
//------//
// Main //
//------//

class Category extends Component {
  constructor() {
    super()

    bindAllFunctions(this)
    this.categoryRef = React.createRef()
  }

  state = {
    expanded: false,
    expanding: false,
  }

  addBeer() {
    const categoryId = this.props.id
    return eventManager.publish('goToBeer', [null, categoryId])
  }

  deleteCategory() {
    const { id } = this.props
    return eventManager.publish('deleteCategory', [id])
  }

  collapse() {
    const categoryEl = this.categoryRef.current,
      from = categoryEl.getBoundingClientRect().height + 'px'

    categoryEl.classList.remove('expanded')
    const to = categoryEl.getBoundingClientRect().height + 'px'
    categoryEl.classList.add('animating')

    return animate(categoryEl, { height: [to, from] }, { duration }).then(
      () => {
        categoryEl.classList.remove('animating')
        categoryEl.style.height = null
        this.setState({
          expanded: false,
        })
      }
    )
  }

  expand() {
    const categoryEl = this.categoryRef.current,
      from = categoryEl.getBoundingClientRect().height + 'px'

    categoryEl.classList.add('expanded')
    const to = categoryEl.getBoundingClientRect().height + 'px'
    categoryEl.classList.add('animating')

    return animate(categoryEl, { height: [to, from] }, { duration }).then(
      () => {
        categoryEl.classList.remove('animating')
        categoryEl.style.height = null
        this.setState({ expanded: true })
      }
    )
  }

  render() {
    const { canEdit, listOfBeers, name } = this.props,
      { expanded } = this.state,
      myself = this,
      categoryClicked = () => {
        if (expanded) myself.collapse()
        else myself.expand()
      },
      beerComponents = listOfBeers.map(toBeerComponent),
      categoryClasses = classNames('category', {
        'can-edit': canEdit,
        expanded,
      })

    return (
      <li className={categoryClasses} ref={this.categoryRef}>
        <button className="expand" type="button" onClick={categoryClicked}>
          <h4>{name}</h4>
          <ChevronDownIcon />
        </button>

        {isEmpty(beerComponents) && (
          <button
            className="category-control delete-category"
            type="button"
            onClick={this.deleteCategory}
          >
            <span>Delete Category</span>
            <div className="wrapper">
              <TrashIcon />
            </div>
          </button>
        )}

        <button
          className="category-control add-beer"
          type="button"
          onClick={this.addBeer}
        >
          <span>Add A Beer</span>
          <div className="wrapper">
            <AddBeerIcon />
          </div>
        </button>

        <ul className="beer-list">{beerComponents}</ul>
      </li>
    )
  }
}

const ConnectedCategory = props => {
  const { id, name } = props

  return (
    <Provider>
      <Subscribe to={[store.beer, store.edit]}>
        {(beerStore, editStore) => {
          const listOfBeers = beerStore.getBeersForCategoryId(id)

          return (
            <Category
              canEdit={editStore.state.canEdit}
              id={id}
              name={name}
              listOfBeers={listOfBeers}
            />
          )
        }}
      </Subscribe>
    </Provider>
  )
}

//
//------------------//
// Helper Functions //
//------------------//

function toBeerComponent(beerData) {
  const { id } = beerData

  return <Beer key={id} {...beerData} />
}

//
//---------//
// Exports //
//---------//

export default ConnectedCategory
