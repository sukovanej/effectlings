import { cli } from "./cli";
import * as Eff from '@effect/io/Effect';
import * as Exit from '@effect/io/Exit';
import { pipe } from "@fp-ts/data/Function";
import { consoleStdout, Stdout } from "./cli/stdout";

const [_, __, ...args] = process.argv;

pipe(
  cli(args),
  Eff.provideService(Stdout)(consoleStdout),
  Eff.unsafeRunSyncExit,
  Exit.match(() => 1, () => 0),
  process.exit
);
