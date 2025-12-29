# How to Create NPM Publish Token

## Steps:

1. **Go to**: https://www.npmjs.com/settings/zrald/tokens

2. **Click**: "Generate New Token" → Choose "**Granular Access Token**"

3. **Configure the token:**
   - **Token name**: `serpfire-publish`
   - **Expiration**: 90 days (or custom)
   - **Packages and scopes**: Select "**Read and write**" for **all packages** or specifically for `@zrald/serpfire`
   - **Organizations**: Leave default
   - **IP ranges**: Leave blank (or restrict if needed)

4. **Important**: Make sure to select **"Publish"** permission!

5. **Copy the token** - it will look like: `npm_xxxxxxxxxxxxxxxxxxxxxxxxxx`

6. **Use the token:**
   ```bash
   npm config set //registry.npmjs.org/:_authToken YOUR_NEW_TOKEN_HERE
   npm publish --access public
   ```

## Alternative: Publish without token

If the token keeps failing, you can authenticate directly:

```bash
npm logout
npm adduser
# Enter your username, password, and email
npm publish --access public
```

---

**Current package name**: `@zrald/serpfire` (scoped to your account)
**Ready to publish**: Yes, all tests passed
**Files excluded**: `.env` and API keys are safe
