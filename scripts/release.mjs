import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

function run(cmd) {
	execSync(cmd, { stdio: "inherit" });
}

function getVersion() {
	const pkg = JSON.parse(readFileSync("package.json", "utf8"));
	if (!pkg?.version || typeof pkg.version !== "string") {
		throw new Error("package.json version not found");
	}
	return pkg.version;
}

function isCleanWorktree() {
	try {
		const out = execSync("git status --porcelain", { encoding: "utf8" }).trim();
		return out.length === 0;
	} catch {
		return false;
	}
}

function tagExists(tag) {
	try {
		execSync(`git rev-parse -q --verify "refs/tags/${tag}"`, { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
}

const bump = process.argv[2] ?? "patch";
if (!["patch", "minor", "major"].includes(bump)) {
	throw new Error('Usage: node scripts/release.mjs <patch|minor|major>');
}

if (!isCleanWorktree()) {
	throw new Error("Working tree is not clean. Commit/stash changes before releasing.");
}

// Bump package.json (+ lock), sync manifest.json + versions.json, and stage files.
run(`node scripts/version-bump.mjs ${bump}`);

const version = getVersion();
const tag = version; // Obsidian requires tag to match manifest.json version (no leading "v")

if (tagExists(tag)) {
	throw new Error(`Tag "${tag}" already exists`);
}

run(`git commit -m "chore: release v${version}"`);

run(`git tag -a "${tag}" -m "${tag}"`);

run("git push --follow-tags");
