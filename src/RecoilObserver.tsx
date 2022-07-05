import { useEffect, useState } from 'react'
import { atom, RecoilState, useRecoilState, useRecoilValue } from 'recoil'

export type AtomListener<T> = (value: T) => void

// vscode syntax highlighting not working when this is inlined
type AtomListenerSetOrNull = Set<AtomListener<any> | null>

export function createContext() {
  const versionAtom = atom({
    key: '__recoil_observer_version',
    default: 0,
  })

  // this trigger will update recoil-observer up-to date
  let triggerUpdateRoot: (() => void) | undefined = undefined

  const atomObservers = new Map<RecoilState<any>, JSX.Element>()
  const atomListeners = new Map<RecoilState<any>, AtomListenerSetOrNull>()

  /**
   *  Root jsx element of recoil-observer
   */
  function RecoilObserver() {
    // subscribe version to update atom observers
    const [_, setVersion] = useRecoilState(versionAtom)

    useEffect(() => {
      triggerUpdateRoot = () => {
        setVersion((curr) => curr + 1)
      }

      return () => {
        triggerUpdateRoot = undefined
      }
    }, [])

    return <>{[...atomObservers.values()]}</>
  }

  /**
   *  JSX Element which listen change on given atom
   */
  function AtomObserver({ atom }: { atom: RecoilState<any> }) {
    const [mounted, setMounted] = useState(false)

    const value = useRecoilValue(atom)

    useEffect(() => {
      setMounted(true)

      return () => {
        setMounted(false)
      }
    }, [])

    useEffect(() => {
      if (mounted) {
        atomListeners.get(atom)?.forEach((fn) => {
          fn?.(value)
        })
      }
    }, [value])

    return <></>
  }

  /**
   *  subscribe `fn` for listening `atom`
   */
  function subscribe<T>(atom: RecoilState<T>, fn: AtomListener<T> | null) {
    const listenerSet = atomListeners.get(atom) || new Set()

    if (fn) {
      atomListeners.set(atom, listenerSet)
      listenerSet.add(fn)
    }

    const observer = atomObservers.get(atom) || <AtomObserver atom={atom} key={atom.key} />
    atomObservers.set(atom, observer)

    // update recoil-observer root
    triggerUpdateRoot?.()
  }

  /**
   *  unsubscribe `fn` from listeners for given `atom`
   *
   *  if there is no listner listening `atom`, the observer jsx element will be removed immediately
   */
  function unsubscribe<T>(atom: RecoilState<T>, fn: AtomListener<T>) {
    const listenerSet = atomListeners.get(atom)

    if (listenerSet) {
      listenerSet.delete(fn)

      if (listenerSet.size === 0) {
        atomObservers.delete(atom)
        triggerUpdateRoot?.()
      }
    }
  }

  /**
   *  return the number of subscribers of given `atom`
   */
  function size(atom: RecoilState<any>) {
    return atomListeners.get(atom)?.size || 0
  }

  return {
    subscribe,
    unsubscribe,
    size,
    RecoilObserver,
  }
}

export const { subscribe, unsubscribe, size, RecoilObserver } = createContext()
