import * as Eff from '@effect/io/Effect';
import { Option } from '@fp-ts/data/Option';
import * as O from '@fp-ts/data/Option';
import { pipe } from '@fp-ts/data/Function';
import { printError, printOk } from './stdout';

export const run = (args: readonly string[]) => pipe(
  parseArgs(args),
  Eff.fromOption,
  Eff.catchAll((err) => pipe(
    printError(`Unexpected arguments: "${args.join(' ')}"`),
    Eff.flatMap(() => Eff.fail(err)),
  )),
  Eff.flatMap(() => printOk("Succeeded"))
);

type RunCommand = {
  command: 'run'
};

// TODO: refactor using @fp-ts/schema once available
const parseArgs = (args: readonly string[]): Option<RunCommand> => {
  if (args.length === 1 && args[0] === 'run') {
    return O.of({ command: 'run' })
  }

  return O.none;
}
