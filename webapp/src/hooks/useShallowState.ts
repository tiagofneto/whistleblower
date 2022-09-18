import { MutableRefObject, useMemo, useReducer, useRef } from 'react'

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @example
 *
 * const [state, setState, { clearState, clearProperty, resetState, resetProperty }, refState] = useState(initialState)
 */

export default function useShallowState<S = AnyObject>(
  initialState: Partial<S> = {} as S
): [
    state: S,
    setState: typeof setState,
    utilityFunctions: {
      /** Sets all properties to `undefined`. */
      clearState: () => void
      /** Clears property value by setting it to `undefined`. */
      clearProperty: (property: keyof S) => void
      /** Sets all properties to the `initialState`. */
      resetState: () => void
      /** Sets property value to its `initialState`. */
      resetProperty: (property: keyof S) => void
    },
    /** Escape hatch to make life easier ¯\_(ツ)_/¯ */
    refState: { current: S },
  ] {

  const [state, setState] = useReducer(
    (prevState, action = {}) => ({ ...prevState, ...(typeof action === 'function' ? action(prevState) : action) }),
    initialState,
  ) as [S, (action?: Partial<S> | ((state: S) => Partial<S>)) => void]

  const refState = useRef<S>(state)
  refState.current = state

  const utilityFunctions = useMemo(() => ({
    clearState() { // @ts-ignore
      setState(prevState => Object.fromEntries(Object.keys(prevState).map(key => [key, undefined])) as { [key in keyof S]?: undefined })
    },
    clearProperty(property: keyof S) { setState({ [property]: undefined } as Partial<S>) },
    resetState() { // @ts-ignore
      setState(prevState => Object.fromEntries(Object.keys(prevState).map(key => [key, initialState[key as keyof S]])) as typeof initialState)
    },
    resetProperty(property: keyof S) { setState({ [property]: initialState[property] } as Partial<S>) },
  }), [])

  /** All `setState`, `utilityFunctions` and its properties are **referentially stable**. */
  return [state, setState, utilityFunctions, refState]
}
