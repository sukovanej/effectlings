import { cli } from "./cli";
import * as Eff from "@effect/io/Effect";
import * as Exit from "@effect/io/Exit";
import { pipe } from "@fp-ts/data/Function";
import * as RA from "@fp-ts/data/ReadonlyArray";
import * as O from "@fp-ts/data/Option";

import { consoleStdout, printError, Stdout } from "./cli/stdout";
import { runConfig, RunConfig } from "./cli/runConfig";

const args = pipe(RA.tail(process.argv), O.flatMap(RA.tail));

const statusCode = pipe(
  Eff.fromOption(args),
  Eff.tapError(() =>
    printError("Unable to parse arguments, please fill in a bug issue.")
  ),
  Eff.flatMap(cli),
  Eff.provideService(Stdout)(consoleStdout),
  Eff.provideServiceEffect(RunConfig)(runConfig),
  Eff.unsafeRunSyncExit,
  Exit.match(
    () => 1,
    () => 0
  )
);

process.exit(statusCode);
