import { cli } from "./cli";
import * as Eff from "@effect/io/Effect";
import * as Exit from "@effect/io/Exit";
import { pipe } from "@fp-ts/data/Function";
import * as RA from "@fp-ts/data/ReadonlyArray";
import * as O from "@fp-ts/data/Option";
import { consoleStdout, Stdout } from "./cli/stdout";

const args = pipe(RA.tail(process.argv), O.flatMap(RA.tail));

const statusCode = pipe(
  Eff.fromOption(args),
  Eff.flatMap(cli),
  Eff.provideService(Stdout)(consoleStdout),
  Eff.unsafeRunSyncExit,
  Exit.match(
    () => 1,
    () => 0
  )
);

process.exit(statusCode);
