import { sleepResolve } from '.'

/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @description Returns a promise that keeps calling a given function in set intervals
 * until it returns `true` for the first time. If `timeout` is provided
 * and the promise has not resolved yet, it will get rejected instead, when the time runs out.
 *
 * `.cancel()` can be called manually to reject the promise.
 *
 * @param interval milliseconds
 * @param timeout milliseconds
 */

export default function poll(condition: () => boolean, interval: number, timeout?: number) {
  interface Cancellable { cancel(): void }

  const promise = new Promise(async (resolve, reject) => {
    let cancelled = false

    setTimeout(() =>
      promise.cancel = () => {
        ref && clearTimeout(ref)
        cancelled = true
        reject('Poll: Cancelled by the user.')
      }
    )

    // We use setTimeout for the rejection, because simply counting down `timeLeft` could be not granular enough.
    const ref = timeout && setTimeout(reject, timeout, 'Poll: Condition was not met in time.')

    let timeLeft = timeout || Infinity

    while (!condition()) {
      if (timeLeft <= 0 || cancelled) return // Time is out, promise should reject by now. Let's bail out.
      timeLeft -= interval
      await sleepResolve(interval)
    }

    // Condition was met, clean up and resolve

    ref && clearTimeout(ref)
    return resolve()
  }) as Promise<void> & Cancellable

  return promise
}
