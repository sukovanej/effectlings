import * as Eff from "@effect/io/Effect";
import { pipe } from "@fp-ts/data/Function";
import * as path from "path";

import { run } from "../../src/cli/run";
import {
  getConfigCwd,
  getConfigSolutionPath,
  RunConfig,
} from "../../src/cli/runConfig";
import { Stdout } from "../../src/cli/stdout";
import { exists, rmdir } from "../../src/fs";
import { testRunConfig } from "./runConfig";
import { dummyStdout } from "./stdout";

const cleanUpTestDirectories = pipe(
  Eff.Do(),
  Eff.bind("cwd", () => getConfigCwd),
  Eff.bind("solutionDir", ({ cwd }) =>
    pipe(
      getConfigSolutionPath,
      Eff.map((solutionPath) => path.join(cwd, solutionPath))
    )
  ),
  Eff.tap(({ solutionDir }) => rmdir(solutionDir)),
  Eff.tap(({ cwd }) => rmdir(cwd))
);

describe("run", () => {
  test("creates new solution folder", () => {
    const newFolderCreated = pipe(
      run,
      Eff.flatMap(() => getConfigCwd),
      Eff.flatMap((cwd) => exists(path.join(cwd, "solution"))),
      Eff.onExit(() => cleanUpTestDirectories),
      Eff.provideService(Stdout)(dummyStdout),
      Eff.provideServiceEffect(RunConfig)(testRunConfig),
      Eff.unsafeRunSync
    );

    expect(newFolderCreated).toBe(true);
  });
});
