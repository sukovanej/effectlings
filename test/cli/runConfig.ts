import * as Eff from "@effect/io/Effect";
import { pipe } from "@fp-ts/data/Function";
import { runConfig, RunConfig } from "../../src/cli/runConfig";

import { mkTempDir } from "../../src/fs";

export const testRunConfig = pipe(
  mkTempDir,
  Eff.flatMap((cwd) =>
    pipe(
      runConfig,
      Eff.map(({ solutionPath }) => ({ cwd, solutionPath } satisfies RunConfig))
    )
  )
);

export const dummyRunConfig: RunConfig = {
  solutionPath: "solution",
  cwd: "non-existing-dummy-cwd",
};
