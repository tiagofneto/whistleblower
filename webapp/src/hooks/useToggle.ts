import { useCallback, useReducer } from 'react'

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @description This state manager toggles between `true` and `false` automatically,
 * but it can also force a value when provided.
 *
 * @example // 1. Initialize the state
 *
 * const [state, toggle, turn, turnOn, turnOff] = useToggle()  // initial state set to Off - `false`
 * const [state, toggle] = useToggle(false)   // initial state set to Off - `false`
 * const [state, toggle] = useToggle(true)    // initial state set to On  - `true`
 *
 * @example // 2. Use the actions
 *
 * const [state, toggle, turn, turnOn, turnOff] = useToggle()  // initial state set to Off - `false`
 *
 * toggle() // switches state to On  - `true`
 * toggle() // switches state to Off - `false`
 *
 * turnOn()  // alias for turn(true)
 * turnOff() // alias for turn(false)
 *
 * turn(true) // turns On - `true`
 * turn(true) // keeps On
 *
 * turn(false) // turns Off - `false`
 */

export default function useToggle(initialState = false): [
  state: boolean,
  toggle: () => void,
  turn: (turnTo: boolean) => void,
  turnOn: () => void,
  turnOff: () => void,
] {
  const [state, change]: [boolean, (turnTo?: boolean) => void] = useReducer((state_: boolean, turnTo?: boolean) => turnTo ?? !state_, initialState)

  const toggle = useCallback(() => change(), [])
  const turn = useCallback((turnTo: boolean) => change(turnTo), [])
  const turnOn = useCallback(() => change(true), [])
  const turnOff = useCallback(() => change(false), [])

  /** All functions are **referentially stable**. */
  return [state, toggle, turn, turnOn, turnOff]
}
