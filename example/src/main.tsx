import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import App from './App'
import './index.css'
import {RecoilObserver} from '../../'
import RecoilNexus from 'recoil-nexus'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilNexus />
      <RecoilObserver />
      <App />
    </RecoilRoot>
  </React.StrictMode>
)
