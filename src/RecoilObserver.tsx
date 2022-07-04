import { useEffect } from 'react'
import { atom, RecoilState, useRecoilState, useRecoilValue } from 'recoil'

export type AtomListener<T> = (value: T) => void

// vscode syntax highlighting not working when this is inlined
type AtomListenerSetOrNull = Set<AtomListener<any> | null>

const versionAtom = atom({
  key: '__recoil_observer_version',
  default: 0,
})

// this trigger will update recoil-observer up-to date
let trigger: (() => void) | undefined = undefined

const atomObservers = new Map<RecoilState<any>, JSX.Element>;
const atomListeners = new Map<RecoilState<any>, AtomListenerSetOrNull>;

let garbages: RecoilState<any>[] = []

function clearGarbages() {
  garbages.forEach((atom) => {
    if (atomListeners.get(atom)?.size === 0) {
      atomObservers.delete(atom)
    }
  })
  garbages = []
}

/**
 *  Root jsx element of recoil-observer
 */
export function RecoilObserver() {
  // subscribe version to update atom observers
  const [_, setVersion] = useRecoilState(versionAtom)

  useEffect(() => {
    if (garbages.length > 0) {
      clearGarbages()
    }

    trigger = () => {
      setVersion((curr) => curr + 1)
    }

    return () => {
      trigger = undefined
    }
  }, [])

  const observers = Array.from(atomObservers.values())

  return <>{observers}</>
}

/**
 *  JSX Element which listen change on given atom
 */
function AtomObserver({atom}: {atom: RecoilState<any>}) {
  const value = useRecoilValue(atom)

  atomListeners.get(atom)?.forEach((fn) => {
    fn?.(value)
  })

  return <></>
}

/**
 *  regsiter `fn` for listening `atom`
 */
export function register<T>(atom: RecoilState<T>, fn: AtomListener<T> | null) {
  const listenerSet = atomListeners.get(atom) || new Set()

  if (fn) {
    atomListeners.set(atom, listenerSet)
    listenerSet.add(fn)
  }
  
  const observer = atomObservers.get(atom) || <AtomObserver atom={atom} key={atom.key}/>
  atomObservers.set(atom, observer)

  // update recoil-observer root
  trigger?.()
}

/**
 *  unregister `fn` from listeners for given `atom`
 * 
 *  if there is no listner listening `atom`, the observer jsx element will be removed immediately
 */
export function unregister<T>(atom: RecoilState<T>, fn: AtomListener<T>) {
  const listenerSet = atomListeners.get(atom)

  if (listenerSet) {
    listenerSet.delete(fn)

    if (listenerSet.size === 0) {
        atomObservers.delete(atom)
        // we can't call `trigger`
        garbages.push(atom)
    }
  }
}

/**
 *  return the number of listeners listening given atom
 */
export function size(atom: RecoilState<any>) {
  return atomListeners.get(atom)?.size || 0
}