import * as Eff from '@effect/io/Effect';
import { Tag } from '@fp-ts/data/Context';
import { pipe } from '@fp-ts/data/Function';

export interface Stdout {
  print: (message: string) => Eff.Effect<never, never, void>;
}

export const Stdout = Tag<Stdout>();

export const consoleStdout: Stdout = {
  print: (message) => Eff.sync(() => console.log(message))
};

enum Color {
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Reset = "\x1b[0m"
}

export const print = (message: string) => pipe(
  Eff.service(Stdout),
  Eff.flatMap(({ print }) => print(message))
);

export const printOk = (message: string) =>
  print(`${Color.Green}[OK   ]${Color.Reset} ${message}`);

export const printError = (message: string) =>
  print(`${Color.Red}[ERROR]${Color.Reset} ${message}`);
