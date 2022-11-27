import * as Eff from "@effect/io/Effect";
import { pipe } from "@fp-ts/data/Function";

import { cli } from "../../src/cli";
import { Stdout } from "../../src/cli/stdout";
import { getTestLogs, testLogsRef, TestLogsRef, testStdout } from "./stdout";

describe("cli", () => {
  [[], ["help"]].forEach((args, i) =>
    test(`prints help (${i})`, () => {
      const logs = pipe(
        cli(args),
        Eff.flatMap(() => getTestLogs),
        Eff.provideServiceEffect(Stdout)(testStdout),
        Eff.provideServiceEffect(TestLogsRef)(testLogsRef),
        Eff.unsafeRunSync
      );

      expect(logs).toStrictEqual(["Effectling - dev"]);
    })
  );

  test(`prints unexpected error`, () => {
    const logs = pipe(
      cli(["unknown", "args"]),
      Eff.catchAll(() => getTestLogs),
      Eff.provideServiceEffect(Stdout)(testStdout),
      Eff.provideServiceEffect(TestLogsRef)(testLogsRef),
      Eff.unsafeRunSync
    );

    expect(logs).toStrictEqual([
      '\x1b[31m[ERROR]\x1b[0m Unexpected arguments: "unknown args"',
    ]);
  });
});
