# Local deepmerge dependency

Private MIT-licensed implementation used by the Rollup/Nitro build dependencies,
with safeguards against prototype poisoning.

The root `deepmerge` development dependency points to this directory. The
`$deepmerge` npm override makes transitive consumers use the same implementation.
Keep this directory in the checkout for `npm ci` and builds.

The implementation and type declarations are based on upstream `deepmerge`.
See [LICENSE](LICENSE) for the upstream copyright notice and license terms.

Run the dependency regression tests from the project root:

```bash
npm test
```
