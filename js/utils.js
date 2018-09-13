//---------//
// Imports //
//---------//

import _ from 'lodash'
import smoothscroll from 'smoothscroll'

//
//------//
// Init //
//------//

const duration = 300

//
//------//
// Main //
//------//

const apply = arrayOfArguments => aFunction => aFunction(...arrayOfArguments)

// ** this function mutates instance
const bindAllFunctions = instance => {
  const proto = Reflect.getPrototypeOf(instance)

  Reflect.ownKeys(proto)
    .filter(key => {
      return key !== 'constructor' && typeof instance[key] === 'function'
    })
    .forEach(key => {
      const val = instance[key]
      instance[key] = val.bind(instance)
    })

  return instance
}

const getArrayOfValues_map = aMap => [...aMap.values()]

const getArrayOfValues_object = anObject => {
  const result = []
  for (const key of Object.keys(anObject)) {
    result.push(anObject[key])
  }
  return result
}

const getValueAt = key => anObject => anObject[key]

const isEmpty_array = anArray => anArray.length === 0

const isEmpty_object = anObject => {
  return anObject === undefined || anObject === null
    ? true
    : Object.keys(anObject).length === 0
}

const isLaden_object = anObject => !!Object.keys(anObject).length

const justReturn = something => () => something

const keepWhen_array = filterFunction => anArray =>
  anArray.filter(filterFunction)

const keepWhen_object = filterFunction => anObject => {
  const result = {}
  for (const key of Object.keys(anObject)) {
    const value = anObject[key]
    if (filterFunction(value, key, anObject)) result[key] = value
  }
  return result
}

const map_array = mapperFunction => anArray => anArray.map(mapperFunction)

const map_object = mapperFunction => anObject => {
  const result = {}
  for (const key of Object.keys(anObject)) {
    result[key] = mapperFunction(anObject[key], key, anObject)
  }
  return result
}

const noop = () => undefined

const omitAll_object = arrayOfKeys => anObject => {
  const result = {},
    setOfKeysToOmit = new Set(arrayOfKeys)

  for (const key of Object.keys(anObject)) {
    if (!setOfKeysToOmit.has(key)) result[key] = anObject[key]
  }

  return result
}

const passThrough = (anArgument, arrayOfFunctions) =>
  arrayOfFunctions.reduce((result, aFunction) => aFunction(result), anArgument)

const reduce_array = (reducerFunction, initialValue) => anArray =>
  anArray.reduce(reducerFunction, initialValue)

const reduce_object = (reducerFunction, initialValue) => anObject => {
  let result = initialValue
  for (const key of Object.keys(anObject)) {
    result = reducerFunction(result, anObject[key], key, anObject)
  }
  return result
}

const resolveAll = arrayOfPromises => Promise.all(arrayOfPromises)

const smoothScrollTo = pxY =>
  new Promise((resolve, reject) => {
    try {
      smoothscroll(pxY, duration, resolve)
    } catch (e) {
      reject(e)
    }
  })

const sortBy = iteratee => collection => _.sortBy(collection, iteratee)

const startsWith = mightStartWith => fullString =>
  fullString.slice(0, mightStartWith.length) === mightStartWith

const waitMs = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

//
//---------//
// Exports //
//---------//

export {
  apply,
  bindAllFunctions,
  getArrayOfValues_map,
  getArrayOfValues_object,
  getValueAt,
  isEmpty_array,
  isEmpty_object,
  isLaden_object,
  justReturn,
  keepWhen_array,
  keepWhen_object,
  map_array,
  map_object,
  noop,
  omitAll_object,
  passThrough,
  reduce_array,
  reduce_object,
  resolveAll,
  smoothScrollTo,
  sortBy,
  startsWith,
  waitMs,
}
