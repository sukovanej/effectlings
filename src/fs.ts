import * as fs from "fs";
import * as path from "path";
import * as os from "os";

import * as Eff from "@effect/io/Effect";

// nodejs interop

export const exists = (path: fs.PathLike) =>
  Eff.sync(() => fs.existsSync(path));

export const cwd = Eff.sync(() => process.cwd());

export const mkdir = (path: fs.PathLike) => Eff.sync(() => fs.mkdirSync(path));

export const mkTempDir = Eff.sync(() =>
  fs.mkdtempSync(path.join(os.tmpdir(), "effectlings"))
);
