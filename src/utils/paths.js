import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

function findCliRoot() {
    let dir = path.dirname(fileURLToPath(import.meta.url));
    while (dir !== path.dirname(dir)) {
        if (existsSync(path.join(dir, "templates")) && existsSync(path.join(dir, "package.json"))) {
            return dir;
        }
        dir = path.dirname(dir);
    }
    throw new Error("Could not find CLI root directory");
}

export const CLI_ROOT = findCliRoot();
