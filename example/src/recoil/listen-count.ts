import * as recoilObserver from '../../../';
import { countAtom } from "./count";

function H(v: number) {
  console.log('observing countatom outside of react : ', v)
  if (v === 10) {
    recoilObserver.unsubscribe(countAtom, H)
    console.log('recoil-observer removed')
    alert('recoil-observer removed')
  }
}

recoilObserver.subscribe(countAtom, H)