import * as O from '@fp-ts/data/Option';
import * as Eq from '@fp-ts/data/Equal';
import * as B from '@fp-ts/data/Boolean';
import * as Eff from '@effect/io/Effect';
import { pipe } from '@fp-ts/data/Function';
import { safeSqrt } from './0001-option';

type AssertFailure = { reason: 'assert', left: unknown, right: unknown };
type ExceptionFailure = { reason: 'exception', error: unknown };

const createAssertFailure = (left: unknown, right: unknown): AssertFailure =>
  ({ reason: 'assert', left, right });

const createExceptionFailure = (error: unknown): ExceptionFailure =>
  ({ reason: 'exception', error });

type TestFailure = AssertFailure | ExceptionFailure;

type TestEffect = Eff.Effect<never, TestFailure, void>;

const assertEqual = <A, Args extends readonly unknown[]>(fn: (...args: Args) => A, args: Args, right: A): TestEffect => pipe(
  Eff.attempt(() => fn(...args)),
  Eff.mapError(createExceptionFailure),
  Eff.flatMap((left) => pipe(
    Eq.equals(left, right),
    B.match(
      () => Eff.fail(createAssertFailure(left, right)),
      () => Eff.succeed(undefined)
    )
  ))
)

export const test: TestEffect = pipe(
  assertEqual(safeSqrt, [1], O.of(1)),
  Eff.flatMap(() => assertEqual(safeSqrt, [4], O.of(2))),
  Eff.flatMap(() => assertEqual(safeSqrt, [-1], O.none))
);
