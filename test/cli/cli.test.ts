import * as Ref from '@effect/io/Ref';
import * as Eff from '@effect/io/Effect';
import * as RA from '@fp-ts/data/ReadonlyArray';
import { pipe } from '@fp-ts/data/Function';
import { cli } from '../../src/cli';
import { Stdout } from '../../src/cli/stdout';
import { Tag } from '@fp-ts/data/Context';

interface TestLogsRef {
  logs: Ref.Ref<readonly string[]>;
}

const TestLogsRef = Tag<TestLogsRef>();

const testLogsRef = pipe(
  Ref.make([] as readonly string[]),
  Eff.map((logs): TestLogsRef => ({ logs }))
)

const getTestLogs = pipe(
  Eff.service(TestLogsRef),
  Eff.flatMap(({ logs }) => Ref.get(logs))
)

const testStdout = pipe(
  Eff.service(TestLogsRef),
  Eff.map(
    ({ logs }): Stdout =>
      ({ print: (message) => pipe(logs, Ref.update(RA.append(message))) })
  )
);

describe('cli', () => {
  [[], ['help']].forEach((args, i) =>
    test(`prints help (${i})`, () => {
      const logs = pipe(
        cli(args),
        Eff.flatMap(() => getTestLogs),
        Eff.provideServiceEffect(Stdout)(testStdout),
        Eff.provideServiceEffect(TestLogsRef)(testLogsRef),
        Eff.unsafeRunSync
      );

      expect(logs).toStrictEqual(['Effectling - dev']);
    })
  );

  test(`prints unexpected error`, () => {
    const logs = pipe(
      cli(['unknown', 'args']),
      Eff.catchAll(() => getTestLogs),
      Eff.provideServiceEffect(Stdout)(testStdout),
      Eff.provideServiceEffect(TestLogsRef)(testLogsRef),
      Eff.unsafeRunSync
    );

    expect(logs).toStrictEqual(['\x1b[31m[ERROR]\x1b[0m Unexpected arguments: "unknown args"']);
  })
})
