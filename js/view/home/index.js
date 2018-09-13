//---------//
// Imports //
//---------//

import React from 'react'
import Switch from 'react-switch'
import { Provider, Subscribe } from 'unstated'

import DaBeers from './da-beers'
import store from '../../store'
import BeerFilter from './beer-filter'
import AddCategory from './add-category'

import '../../../scss/views/home/index.scss'
import { yellow } from '../../../scss/exported/colors.scss'
import { smallBoxShadow } from '../../../scss/exported/misc.scss'

//
//------//
// Main //
//------//

const Home = ({ canEdit, makeEditable }) => {
  return (
    <>
      <h3>Controls</h3>
      <ul className="options">
        <li>
          <label htmlFor="can-edit">Edit data ?</label>
          <Switch
            id="can-edit"
            className="react-switch"
            onChange={makeEditable}
            checked={canEdit}
            boxShadow={smallBoxShadow}
            activeBoxShadow={smallBoxShadow}
            onColor={yellow}
            height={20}
            handleDiameter={28}
            checkedIcon={false}
            uncheckedIcon={false}
          />
        </li>

        <li>
          <BeerFilter />
        </li>

        <li>
          <AddCategory />
        </li>
      </ul>

      <h3>And of course, the beer</h3>
      <DaBeers />
    </>
  )
}

const ConnectedHome = () => (
  <Provider>
    <Subscribe to={[store.edit]}>
      {editStore => (
        <Home
          canEdit={editStore.state.canEdit}
          makeEditable={editStore.makeEditable}
        />
      )}
    </Subscribe>
  </Provider>
)

//
//---------//
// Exports //
//---------//

export default ConnectedHome
