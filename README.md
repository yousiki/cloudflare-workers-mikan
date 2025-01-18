# Mirror site of [Mikan](https://mikanani.me) using [Workers](https://workers.cloudflare.com/)

This is a mirror site for [Mikan Project](https://mikanani.me) using [Cloudflare Workers](https://workers.cloudflare.com/), which is a serverless platform that allows you to run JavaScript code on Cloudflare's edge network.

## Features

- [x] Mirror the entire site
- [x] Support login and register
- [x] Support for custom domain

## Usage

You can directly access the mirror site I deployed: [https://mikan.siki.moe](https://mikan.siki.moe), or you can deploy your own mirror site by following the steps below.

### Deploy

1. Fork this repository
2. Edit the `wrangler.toml` file and replace `routes` with your own domain
3. Create a new Cloudflare API token with the permission to edit workers, and add it to GitHub Secrets with the name `CLOUDFLARE_API_TOKEN`. Add `CLOUDFLARE_ACCOUNT_ID` to GitHub Secrets as well
4. Enable GitHub Actions in your repository
5. Trigger the workflow manually or push a commit to the repository

## License

[MIT](LICENSE)
