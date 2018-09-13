//
// README
//   - Yes stateful singletons are bad, but this app is simple enough to not
//     worry about such things!
//

//---------//
// Imports //
//---------//

import {
  apply,
  getArrayOfValues_map as getArrayOfValues,
  map_array as map,
  passThrough,
  resolveAll,
} from './utils'

//
//------//
// Init //
//------//

//
// allSubscriptions is a two dimensional map.  The first key is the event id
//   e.g. 'someEvent'.  The second key is a symbol used by the
//   unsubscribe callback.  The value is the event callback.
//
const allSubscriptions = new Map()

//
//------//
// Main //
//------//

//
// TODO: figure out a more semantic name than 'subscribeTo' which also implies
//   returning an unsubscribe callback. hmmmm.
//
const eventManager = {
  subscribeTo,
  publish,
}

//
//------------------//
// Helper Functions //
//------------------//

function subscribeTo(eventId, callback) {
  let eventSubscriptions = allSubscriptions.get(eventId)

  if (!eventSubscriptions) {
    eventSubscriptions = new Map()
    allSubscriptions.set(eventId, eventSubscriptions)
  }

  const unsubscribeId = Symbol()
  eventSubscriptions.set(unsubscribeId, callback)

  return createUnsubscribeCallback(
    allSubscriptions,
    eventSubscriptions,
    eventId,
    unsubscribeId
  )
}

function publish(eventId, arrayOfArguments = []) {
  const eventSubscriptions = allSubscriptions.get(eventId)
  if (!eventSubscriptions) return Promise.resolve([])

  return passThrough(eventSubscriptions, [
    getArrayOfValues,
    map(apply(arrayOfArguments)),
    resolveAll,
  ])
}

function createUnsubscribeCallback(...args) {
  const [allSubscriptions, eventSubscriptions, eventId, unsubscribeId] = args

  return () => {
    eventSubscriptions.delete(unsubscribeId)
    if (eventSubscriptions.size === 0) {
      allSubscriptions.delete(eventId)
    }
  }
}

//
//---------//
// Exports //
//---------//

export default eventManager
