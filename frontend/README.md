# Frontend

A frontend for the `do.md` file format.

- Show me what I **must** do **today**
  - Tasks with `by:today`
  - Tasks without `by:` and with `after:today`
  - Let me go back and forward on what "today" means
- Show me everything I want to do
  - Actionable today
  - Undated
- Show me the whole list, including all closed, future, etc
  - Ignore all filters

More info coming soon - Apr 2020

## pkgx

This was built a long time ago, and uses out of date node versions, etc.

- Running `dev` will setup the `pkgx` environment
  - It might be setup automatically on entering the directory
- To run `serve` requires a different environment, easiest option is `dev off`
  - Then `pkgx +nodejs.org npx serve build` should work
