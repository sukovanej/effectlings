import * as Eff from "@effect/io/Effect";
import { pipe } from "@fp-ts/data/Function";
import * as path from "path";
import { exists, mkdir } from "../fs";
import { getConfigCwd, getConfigSolutionPath } from "./runConfig";
import { printInfo, printOk } from "./stdout";

export const run = pipe(
  Eff.Do(),
  Eff.bind("solutionPath", () =>
    pipe(
      Eff.tuple(getConfigCwd, getConfigSolutionPath),
      Eff.map(([cwd, solutionPath]) => path.join(cwd, solutionPath))
    )
  ),
  Eff.bind("solutionFolderExists", ({ solutionPath }) => exists(solutionPath)),
  Eff.flatMap(({ solutionPath, solutionFolderExists }) =>
    pipe(
      Eff.succeed(solutionFolderExists),
      Eff.ifEffect(
        printInfo(`Solution folder found`),
        createSolutionDirectory(solutionPath)
      )
    )
  )
);

const createSolutionDirectory = (solutionPath: string) =>
  pipe(
    printInfo(`Creating "${solutionPath}"`),
    Eff.flatMap(() => mkdir(solutionPath)),
    Eff.flatMap(() => printOk(`Solution directory '${solutionPath}' created`))
  );
