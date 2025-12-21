import { Dispatch, SetStateAction, useState, useRef } from "react";

interface StateMediator<S = unknown> {
  (newState: S): S;
  (newState: S, dispatch: Dispatch<SetStateAction<S>>): void;
}

export default function useMediatedState<S = unknown>(
  mediator: StateMediator<S>,
  initialState?: S,
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(initialState as S);
  const mediatorRef = useRef(mediator);

  const handler = (param: SetStateAction<S>) => {
    console.log("im herer1", param);
    let val: S;
    if (typeof param === "function") {
      val = (param as Function)(state);
    } else {
      val = param;
    }

    if (mediatorRef.current.length === 1) {
      setState(mediatorRef.current(val));
    } else {
      mediatorRef.current(val, setState);
    }
  };

  return [state, handler];
}
