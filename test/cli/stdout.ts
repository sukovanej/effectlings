import * as Ref from '@effect/io/Ref';
import * as Eff from '@effect/io/Effect';
import { pipe } from '@fp-ts/data/Function';
import * as RA from '@fp-ts/data/ReadonlyArray';
import { Tag } from '@fp-ts/data/Context';

import { Stdout } from '../../src/cli/stdout';

interface TestLogsRef {
  logs: Ref.Ref<readonly string[]>;
}

export const TestLogsRef = Tag<TestLogsRef>();

export const testLogsRef = pipe(
  Ref.make([] as readonly string[]),
  Eff.map((logs): TestLogsRef => ({ logs }))
)

export const getTestLogs =
  Eff.serviceWithEffect(TestLogsRef)(({ logs }) => Ref.get(logs));

export const testStdout =
  Eff.serviceWith(TestLogsRef)(
    ({ logs }): Stdout =>
      ({ print: (message) => pipe(logs, Ref.update(RA.append(message))) })
  );
