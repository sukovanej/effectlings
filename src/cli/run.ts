import { pipe } from "@fp-ts/data/Function";
import { printOk } from "./stdout";

export const run = pipe(printOk("Succeeded"));
