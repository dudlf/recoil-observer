import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

import { useRecoilState } from 'recoil'
import { countAtom } from './recoil/count'

function App() {
  import('./recoil/listen-count')
  const [count, setCount] = useRecoilState(countAtom)

  const hooks = [() => useState(0), () => useState(0)]

  hooks.forEach((hook) => hook())

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Open dev tools -&gt; console and watch the logs.
          <br />
          When count is being 10, observer will be removed
        </p>
        <button type='button' onClick={() => setCount((count) => count + 1)}>
          count is: {count}
        </button>
        <p>
          <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
            Learn React
          </a>
          {' | '}
          <a className='App-link' href='https://vitejs.dev/guide/features.html' target='_blank' rel='noopener noreferrer'>
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
