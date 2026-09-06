# UI Design Lab
Independent visual systems, reusable React components, and connected workbench examples.

The public homepage stays neutral. Each system owns its visual language, tokens, components, state contracts and interior. Compare the same scene without losing form values; customize a scoped theme; install the local ESM package in an independent React 19 project.

Systems: Quiet Workspace, Midnight Ledger, Clearline Console, and Signal Studio. New systems are experimental after local acceptance; see each manifest for current status and API limits.

Examples: task and usage management, research and content, operations reporting. These are interactive UI examples with explicit local mock adapters. They do not provide production authentication, task execution, storage, billing or email.

The current local candidate is 1.0.0-beta.1. Start with QUICKSTART.md. Run npm pack, then scripts/create-starter.mjs to create a separate workbench with its component tarball included under vendor/. A received Beta Starter can be extracted on another machine and started with npm install and npm run dev. npm run release:prepare creates local delivery artifacts and SHA-256 checksums. No public npm package or production demo URL is claimed here.

The current code and examples are MIT licensed. Reference screenshots have separate rights and are excluded from the package. See NOTICE.md. Future paid original templates and services will use separately stated terms; existing MIT rights remain unchanged.

Validation: suite schema and isolation, token bindings, Node behavior tests, TypeScript, package and site builds, and browser interaction checks. See docs/ACCEPTANCE.md for the actual coverage and limits. Contributions are welcome; follow CONTRIBUTING.md.
