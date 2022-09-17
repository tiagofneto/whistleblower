/**
 * @author Qwerty <qwerty@qwerty.xyz>
 *
 * @description Returns a function, that, as long as it continues to be invoked, will not
 * trigger the callback. The callback will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the callback on the
 * leading edge, instead of the trailing.
 *
 * `.cancel()` can be called manually to cancel the scheduled trailing invocation.
 *
 * @param wait milliseconds
 */

export default function debounce<Callback extends AnyFunction>(cb: Callback, wait: number, immediate?: boolean) {
  let timeout: NodeJS.Timeout | null

  function debounced(this: any, ...args: Parameters<Callback>): void {
    const context = this // eslint-disable-line @typescript-eslint/no-this-alias
    const later = () => {
      timeout = null
      if (!immediate) cb.apply(context, args)
    }
    const callNow = immediate && !timeout
    timeout && clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) cb.apply(context, args)
  }

  debounced.cancel = () => {
    timeout && clearTimeout(timeout)
  }

  return debounced
}
