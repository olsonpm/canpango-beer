//
// TODO: implement form validation
// TODO: use controlled inputs and traditional react form state management as
//   opposed to the current hack
//

//---------//
// Imports //
//---------//

import _ from 'lodash'
import animate from 'velocity-animate'
import React, { Component } from 'react'
import { Provider, Subscribe } from 'unstated'

import eventManager from '../event-manager'
import store from '../store'

import {
  bindAllFunctions,
  map_array as map,
  passThrough,
  waitMs,
} from '../utils'

import {
  checkCircle as CheckCircleIcon,
  arrowLeftCircle as BackIcon,
} from '../icons'

import '../../scss/views/beer.scss'

//
//------//
// Init //
//------//

const detailKeys = getDetailKeys(),
  setOfKeysToFormatForTheServer = new Set(['calories', 'ibu']),
  duration = 500

//
//------//
// Main //
//------//

class Beer extends Component {
  constructor() {
    super()

    bindAllFunctions(this)

    // this ref is a hack because I don't feel like learning how to forward
    //   refs.  I really don't like the lack of dom access in React in
    //   comparison to vue
    this.formRef = React.createRef()
  }

  goHome() {
    return eventManager.publish('goHome')
  }

  deleteBeer() {
    const beerId = this.props.data.id,
      { clearCurrentBeer } = this.props

    //
    // TODO: make the currentBeer store hold a snapshot of the beer data.
    //   Currently the ux suffers because ideally we would be able to delete the
    //   beer before transitioning back to the home page.  But if we do that now
    //   then the current beer page goes blank, so for now we'll just live with
    //   an element that gets noticeably removed while on the home screen.
    //
    return this.goHome()
      .then(clearCurrentBeer)
      .then(() => eventManager.publish('deleteCurrentBeer', [beerId]))
  }

  createNewBeer() {
    const formData = gatherFormData(),
      { newBeerCategoryId } = this.props

    return Object.assign({}, formData, {
      created_on: new Date().toISOString(),
      category: getUrl(newBeerCategoryId),
      categoryId: newBeerCategoryId,
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    event.stopPropagation()

    const { data, isNewBeer } = this.props

    const udpatedBeerData = isNewBeer
      ? this.createNewBeer()
      : Object.assign({}, data, gatherFormData())

    const createOrUpdate = isNewBeer ? 'createBeer' : 'updateBeer'

    return eventManager
      .publish(createOrUpdate, [udpatedBeerData])
      .then(() => {
        const successEl = this.formRef.current.querySelector(
          '.icon.check-circle'
        )
        return animate(successEl, { opacity: [1, 0] }, duration)
      })
      .then(() => waitMs(2000))
      .then(() => {
        const successEl = this.formRef.current.querySelector(
          '.icon.check-circle'
        )
        return animate(successEl, { opacity: [0, 1] }, duration)
      })
      .catch(error => {
        /* eslint-disable no-console */
        console.error('error during update')
        console.error(error)
        /* eslint-enable no-console */
      })
  }

  handleInputChange(event) {
    const { name: key, value } = event.target

    this.props.updateEditableValue(value, key)
  }

  createRestOfInputs() {
    const { editableData } = this.props,
      { handleInputChange } = this

    return passThrough(detailKeys, [map(toLabelInputPair), _.flatten])

    // scoped helper function
    function toLabelInputPair(key) {
      const id = getIdFromKey(key)

      return [
        <label key={`label-${key}`} htmlFor={id}>
          {_.lowerCase(key)}
        </label>,
        <input
          key={`input-${key}`}
          id={getIdFromKey(key)}
          name={key}
          value={editableData[key] || ''}
          onChange={handleInputChange}
        />,
      ]
    }
  }

  renderForm() {
    const { canEdit, categoryName, editableData, isNewBeer } = this.props,
      restOfInputs = this.createRestOfInputs()

    return (
      <form onSubmit={this.handleSubmit} noValidate ref={this.formRef}>
        <div className="fields">
          <label htmlFor="edit-beer_category-name">category</label>
          <input
            id="edit-beer_category-name"
            data-noclear
            defaultValue={categoryName || ''}
            disabled
          />

          <label htmlFor="edit-beer_name">name</label>
          <input
            id="edit-beer_name"
            name="name"
            value={editableData.name || ''}
            onChange={this.handleInputChange}
          />

          {restOfInputs}
        </div>

        <button className="submit">
          <span>Submit</span>
        </button>

        <CheckCircleIcon />

        {!isNewBeer &&
          canEdit && (
            <button type="button" className="delete" onClick={this.deleteBeer}>
              <span>Delete</span>
            </button>
          )}
      </form>
    )
  }

  render() {
    const { canEdit, data, categoryName } = this.props
    if (!categoryName) return null

    const { name } = data

    return (
      <>
        <button type="button" onClick={this.goHome}>
          <BackIcon />
        </button>
        <h2>{name || '{ No Name Yet }'}</h2>
        {canEdit && this.renderForm()}
        {!canEdit && (
          <dl>
            <dt>category</dt>
            <dd>{categoryName}</dd>

            {createRestOfDetails(data)}
          </dl>
        )}
      </>
    )
  }
}

//
// the store.beer dependency is a hack for now.  I'm not sure the best approach
//   to organizing the state and subscriptions
//
const ConnectedBeer = () => (
  <Provider>
    <Subscribe to={[store.currentBeer, store.edit, store.beer]}>
      {(currentBeerStore, editStore) => (
        <Beer
          canEdit={editStore.state.canEdit}
          categoryName={currentBeerStore.getCategoryName()}
          clearCurrentBeer={currentBeerStore.clear}
          data={currentBeerStore.getData()}
          editableData={currentBeerStore.state.editableData}
          isNewBeer={!!currentBeerStore.state.newBeerCategoryId}
          newBeerCategoryId={currentBeerStore.state.newBeerCategoryId}
          updateEditableValue={currentBeerStore.updateEditableValue}
        />
      )}
    </Subscribe>
  </Provider>
)

//
//------------------//
// Helper Functions //
//------------------//

function getUrl(newBeerCategoryId) {
  return `http://apichallenge.canpango.com/category/${newBeerCategoryId}/`
}

function gatherFormData() {
  return detailKeys.concat('name').reduce((newBeerData, key) => {
    newBeerData[key] = maybeFormatForServer(
      document.getElementById(getIdFromKey(key)).value,
      key
    )

    return newBeerData
  }, {})
}

function maybeFormatForServer(value, key) {
  if (!setOfKeysToFormatForTheServer.has(key)) return value

  try {
    return _.toSafeInteger(value)
  } catch (e) {
    return value
  }
}

function createRestOfDetails(data) {
  return passThrough(detailKeys, [map(toTermDefinitionPair), _.flatten])

  // scoped helper function
  function toTermDefinitionPair(key) {
    return [
      <dt key={`term-${key}`}>{_.lowerCase(key)}</dt>,
      <dd key={`def-${key}`}>{data[key]}</dd>,
    ]
  }
}

function getIdFromKey(key) {
  return `edit-beer_${key}`
}

function getDetailKeys() {
  return ['ibu', 'calories', 'abv', 'style', 'brewery_location']
}

//
//---------//
// Exports //
//---------//

export default ConnectedBeer
