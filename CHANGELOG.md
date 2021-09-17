# 3.0.1 [17-09-2021]

- Actually release the correct version
- 
# 3.0.0 [17-09-2021]

- Converted to typescript. Even though it's supposed to be 100% backwards compatible, we decided to make this a major release.
- Moved tests from ava to jest and nock.
- Added `rokka.render.signUrl` method.
- Added `rokka.render.addStackVariables` method.
- Added `rokka.sourceimages.setProtected` method (and support for setting it during creation)
- Added `rokka.organizations.setOption` method.

# 2.0.1 [04-11-2019]

- Small, non-code related fixes.
- Use rollup instead of babel for packaging files.

# 2.0.0 [25-10-2019]

- Replace request package with cross-fetch.
  rokka.js uses now cross-fetch instead of "request" for making the actual http calls. It's much smaller as the main reason.
  The object returned as response in the Promises therefore also changed. We tried to make it as backwards compatible as possible with providing the relevant properties as before, but we can't guarantee 100% BC
- Added deleted query support for `rokka.sourceimages.get` and `rokka.sourceimages.list`
- Added `rokka.memberships.get(organization,userId)`  
 