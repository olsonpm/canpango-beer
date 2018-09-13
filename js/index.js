import React from 'react'
import ReactDOM from 'react-dom'
import View from './view'

import '../scss/index.scss'

const App = () => (
  <>
    <header>
      <div className="content-container">
        <h1>Canpango Beer</h1>
      </div>
    </header>

    <main>
      <View />
    </main>

    <footer />
  </>
)

ReactDOM.render(<App />, document.getElementById('app'))
