<h1 align="center">Recoil-observer</h1>

> Observe recoil atom outside of react

## Install

```sh
npm install recoil-observer
```

## Usage

```tsx
import { RecoilObserver } from 'recoil-observer'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    // ...
    <RecoilObserver />
    // ...
  </RecoilRoot>
)

//
import { useRecoilValue } from 'recoil'
import { subscribe, unsubscribe } from 'recoil-boserver'

function handler(v: any) {
  console.log('observing atom outside of react!')

  // using hook in handler will throw error(invalid hook usage)
  const atomValue = useRecoilValue(someAtom)
}

subscribe(someAtom, handler)
```

## LICENSE

MIT
