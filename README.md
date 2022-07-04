<h1 align="center">Recoil-observer</h1>

> Observe reocil atom outside of react

## Install

```sh
npm install recoil-observer
```

## Usage

```tsx
import { RecoilObserver } from '../../'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    // ...
    <RecoilObserver />
    // ...
  </RecoilRoot>
)

//

import { register, unregister } from '../../../'
import { countAtom } from './count'

function handler(v: any) {
  console.log('observing atom outside of react is success!. now exit')
  recoilObserver.unregister(countAtom, handler)
}

recoilObserver.register(countAtom, handler)
```
