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

- Running the project requires node ^12
  - `pkgx +nodejs.org@12.22.12 +classic.yarnpkg.com yarn start`
  - `pkgx +nodejs.org@12.22.12 +classic.yarnpkg.com yarn build`
- Running things like serve requires more up to date versions
  - Then `pkgx +nodejs.org npx serve build` should work
