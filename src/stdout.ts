import * as Eff from '@effect/io/Effect';

enum Color {
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Reset = "\x1b[0m"
}

export const printOk = (message: string) =>
  Eff.sync(() => console.log(`${Color.Green}[OK   ]${Color.Reset} ${message}`))

export const printError = (message: string) =>
  Eff.sync(() => console.log(`${Color.Red}[ERROR]${Color.Reset} ${message}`))
