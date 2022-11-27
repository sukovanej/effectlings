import * as Eff from '@effect/io/Effect';
import { Option } from '@fp-ts/data/Option';
import * as O from '@fp-ts/data/Option';
import { pipe } from '@fp-ts/data/Function';
import { printError } from './stdout';
import { makeMatch } from 'ts-adt/MakeADT'
import { run } from './run';
import { help } from './help';

const matchCommand = makeMatch('command');

export const cli = (args: readonly string[]) => pipe(
  Eff.fromOption(parseArgs(args)),
  Eff.tapError(() => printError(`Unexpected arguments: "${args.join(' ')}"`)),
  Eff.flatMap(matchCommand({ 'run': () => run, 'help': () => help }))
);

type RunCommand = {
  command: 'run'
};

type HelpCommand = {
  command: 'help'
};

type CliCommand = RunCommand | HelpCommand;

// TODO: refactor using @fp-ts/schema once available
const parseArgs = (args: readonly string[]): Option<CliCommand> => {
  if (args.length === 1 && args[0] === 'run') {
    return O.of({ command: 'run' })
  } else if (args.length == 0 || args.length === 1 && args[0] === 'help') {
    return O.of({ command: 'help' })
  }

  return O.none;
}
