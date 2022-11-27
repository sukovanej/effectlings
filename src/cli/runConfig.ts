import * as Eff from "@effect/io/Effect";
import { Tag } from "@fp-ts/data/Context";
import { pipe } from "@fp-ts/data/Function";
import { cwd } from "../fs";

export interface RunConfig {
  cwd: string;
  solutionPath: string;
}

export const RunConfig = Tag<RunConfig>();

export const runConfig = pipe(
  cwd,
  Eff.map((cwd): RunConfig => ({ cwd, solutionPath: "solution" }))
);

export const getConfigCwd = Eff.serviceWith(RunConfig)(({ cwd }) => cwd);

export const getConfigSolutionPath = Eff.serviceWith(RunConfig)(
  ({ solutionPath }) => solutionPath
);
