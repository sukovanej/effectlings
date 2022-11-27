import * as Eff from "@effect/io/Effect";
import { pipe } from "@fp-ts/data/Function";
import * as path from "path";

import { run } from "../../src/cli/run";
import { RunConfig } from "../../src/cli/runConfig";
import { Stdout } from "../../src/cli/stdout";
import { exists } from "../../src/fs";
import { testRunConfig } from "./runConfig";
import { dummyStdout } from "./stdout";

describe("run", () => {
  test("creates new solution folder", () => {
    const newFolderCreated = pipe(
      run,
      Eff.flatMap(() => Eff.serviceWith(RunConfig)(({ cwd }) => cwd)),
      Eff.flatMap((cwd) => exists(path.join(cwd, "solution"))),
      Eff.provideService(Stdout)(dummyStdout),
      Eff.provideServiceEffect(RunConfig)(testRunConfig),
      Eff.unsafeRunSync
    );

    expect(newFolderCreated).toBe(true);
  });
});
