//---------//
// Imports //
//---------//

import React from 'react'

import eventManager from '../../event-manager'
import { tag as TagIcon } from '../../icons'

//
//------//
// Main //
//------//

const AddFilter = () => (
  <form onSubmit={handleSubmit} noValidate>
    <label htmlFor="add-category-input">Add Category</label>
    <div className="option-textbox add-category">
      <input id="add-category-input" maxLength={20} placeholder="{ name }" />
      <button>
        <TagIcon />
      </button>
    </div>
  </form>
)

//
//------------------//
// Helper Functions //
//------------------//

function handleSubmit(event) {
  event.preventDefault()
  event.stopPropagation()

  const addCategoryEl = document.getElementById('add-category-input')
  const { value: name } = addCategoryEl
  addCategoryEl.value = ''
  return eventManager.publish('addCategory', [name])
}

//
//---------//
// Exports //
//---------//

export default AddFilter
