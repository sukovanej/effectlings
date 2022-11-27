import { run } from "./cli";
import * as Eff from '@effect/io/Effect';
import * as Exit from '@effect/io/Exit';
import { pipe } from "@fp-ts/data/Function";

const [_, __, ...args] = process.argv;

pipe(
  run(args),
  Eff.unsafeRunSyncExit,
  Exit.match(() => 1, () => 0),
  process.exit
);
