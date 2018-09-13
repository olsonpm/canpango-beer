//------//
// Init //
//------//

const idRe = /\/([0-9]+)\/$/

//
//------//
// Main //
//------//

const getIdFromUrl = ({ url }) => url.match(idRe)[1]

const toBeerState = (idToData, aBeer) => {
  const id = getIdFromUrl(aBeer),
    categoryId = getIdFromUrl({ url: aBeer.category })

  Object.assign(aBeer, {
    id,
    categoryId,
  })

  idToData[id] = aBeer
  return idToData
}

//
//---------//
// Exports //
//---------//

export { getIdFromUrl, toBeerState }
