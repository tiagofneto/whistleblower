export { default as debounce } from './debounce'
export { default as poll } from './poll'

export function contextFallbackFunction(...any: any[]): any { console.error('You cannot use this context without Provider!') }

export const sleepResolve = <T = void>(msec: number, retVal?: T) => new Promise<T>((resolve) => setTimeout(resolve, msec, retVal))
export const sleepReject = <T = void>(msec: number, retVal?: T) => new Promise<T>((_, reject) => setTimeout(reject, msec, retVal))

// Type guards

/** Ensures **type safety** while not hindering **type inference**. Don't forget to use `as const` and `readonly` or `Readonly<T>`, although `Readonly` will not work with deep objects.
 * @example
 *
 * const keywords = is<readonly string[]>()(['a', 'b'] as const)
 * const keywordz = is<readonly string[]>()(['a',  2 ] as const) // ERROR
 * type T1 = typeof keywords // inferred as ['a', 'b'] and not string[]
 *
 */
export const is = <TargetType>() => <T extends TargetType>(arg: T): T => arg

/** Narrows type in an if block.
 * @example
 * declare const something: A | B
 *
 * if (narrow<A>(something, v => !!v.propertyOnAOnly)) {
 *    // `something` is of type A
 * } else {
 *    // `something` is of type B
 * }
 */
export const narrow = <T extends any>(value: any, condition: (v: T) => boolean): value is T => condition(value)

export const isNullish = (v: any): v is null | undefined => v === undefined || v === null
