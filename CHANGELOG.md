# 3.11.0 - [31-10-2022]

- Remove 3rd parameter in`rokka.sourceimages.downloadAsBuffer`, it's not used.
- Add stackoptions option to getUrl 5th parameter

# 3.10.0 - [24-09-2022]

- Add support for downloading a list of images as Zip via `rokka.sourceimages.listDownload`

# 3.9.1 - [19-09-2022]

- Fix getting new Token, when apiKey is set via `rokka.user.getNewToken`

# 3.9.0 - [08-09-2022]

- Added support for getting a list of images in an album via `rokka.render.imagesByAlbum`

# 3.8.0 - [16-08-2022]
- Added support for locked sourceimages.
  See [the Source images Guide](https://rokka.io/documentation/references/source-images.html#lock-a-source-image-to-prevent-deletion) for details.

# 3.7.0 - [30-05-2022]

- Added support for API Tokens.
  See [the Authentication Guide](https://rokka.io/documentation/guides/authentication.html#using-rokka-with-a-jwt-token) for details
- Added possibility to add a comment to new memberships

# 3.6.0 [01-01-2022]

- Export more typescript interfaces 

# 3.5.1 [28-12-2021]

- Fix request interface

# 3.5.0 [28-12-2021]

- Added `rokka.sourceimages.downloadAsBuffer` to get a Buffer more easily
- Added `rokka.render(path, method, payload)` to do any request against the rokka API
- Fixed return type of body for non JSON responses. It's now always a Stream.

# 3.4.0 [10-12-2021]

- Added `rokka.sourceimages.addDynamicMetaData` and `rokka.sourceimages.deleteDynamicMetaData`  method.

# 3.3.0 [07-12-2021]

- Added User Api Keys methods. 
  See https://rokka.io/documentation/references/users-and-memberships.html#rotate-your-api-key for details.

# 3.2.0 [23-11-2021]

- Added agent transport option (for example for adding proxy options. See the README for an example)

# 3.1.0 [20-10-2021]

- Added `rokka.sourceimages.putName` method to change the name of an image.

# 3.0.1 [17-09-2021]

- Actually release the correct version

# 3.0.0 [17-09-2021]

- Converted to typescript. Even though it's supposed to be 100% backwards compatible, we decided to make this a major release.
- Moved tests from ava to jest and nock.
- Added `rokka.render.signUrl` method.
- Added `rokka.render.addStackVariables` method.
- Added `rokka.render.getUrlComponents` method.
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
 