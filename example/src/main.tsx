import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import App from './App'
import './index.css'
import {RecoilObserver} from '../../'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilObserver />
      <App />
    </RecoilRoot>
  </React.StrictMode>
)

setTimeout(() => {
  import('./recoil/listen-count')
}, 2000)
