# Local security repair for deepmerge 4.3.1

This private, MIT-licensed fork preserves the upstream CommonJS implementation
and type declarations from `deepmerge@4.3.1`. The original license is in LICENSE.
The root development dependency and `$deepmerge` npm override install it for the
transitive Rollup/Nitro dependency. The root entry ensures local-directory links
resolve consistently during a clean `npm ci` install.

Changes address [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4):

- Reject `__proto__`, `constructor` and `prototype` in both input-copy loops.
- Define result properties as own data properties instead of invoking setters.
- Reject source keys when checking a target proxy's properties throws.

The default merging, cloning, array options, symbols and `.all()` API are kept.
Regression tests cover the reported exploit shapes and ordinary build options.
No upstream patched version exists as of 2026-10-28. Remove this override and
directory once an upstream patched release can replace it; do not replace it
with an older release merely to satisfy the advisory's version range.
