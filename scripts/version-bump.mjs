import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

function run(cmd) {
	execSync(cmd, { stdio: "inherit" });
}

function readPackageVersion() {
	const pkg = JSON.parse(readFileSync("package.json", "utf8"));
	if (!pkg?.version || typeof pkg.version !== "string") {
		throw new Error("package.json version not found");
	}
	return pkg.version;
}

function isCleanWorktree() {
	const out = execSync("git status --porcelain", { encoding: "utf8" }).trim();
	return out.length === 0;
}

// Usage:
// - `node scripts/version-bump.mjs` -> sync manifest.json + versions.json to current package.json version
// - `node scripts/version-bump.mjs patch|minor|major` -> bump package.json(+lock) then sync + stage files
const bump = process.argv[2];
if (bump !== undefined && !["patch", "minor", "major"].includes(bump)) {
	throw new Error('Usage: node scripts/version-bump.mjs [patch|minor|major]');
}

if (bump) {
	if (!isCleanWorktree()) {
		throw new Error("Working tree is not clean. Commit/stash changes before bumping.");
	}
	run(`npm version ${bump} --no-git-tag-version`);
}

const targetVersion = readPackageVersion();

// read minAppVersion from manifest.json and bump version to target version
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
const versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));

if (bump) {
	run("git add package.json package-lock.json manifest.json versions.json");
} else {
	run("git add manifest.json versions.json");
}
