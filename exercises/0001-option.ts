/** Option 1 - implement safe `sqrt` function.
 *
 * @description
 * The square root on real numbers can be computed only for non-negative numbers.
 * The `Math.sqrt` function returns `NaN` in case the input is negative. Let's
 * implement a version of sqrt that returns `Option<number>` instead.
 */

import { Option } from '@fp-ts/data/Option';
import * as O from '@fp-ts/data/Option';

export function safeSqrt(input: number): Option<number> {
  return O.none;
}
