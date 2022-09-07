<div align="center">
<h1>CS:GO Demo Uploader<br>
<a href="https://chse.dev/donate"><img alt="Donate" src="https://img.shields.io/badge/Donate_To_This_Project-brightgreen"></a>
<a href="https://github.com/ChxseH/csgo-demo-uploader/actions/workflows/linter.yml"><img alt="GitHub Actions Status" src="https://github.com/ChxseH/csgo-demo-uploader/actions/workflows/linter.yml/badge.svg"></a>
<a href="https://github.com/chxseh/csgo-demo-uploader/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/chxseh/csgo-demo-uploader"></a>
<a href="https://github.com/chxseh/csgo-demo-uploader/issues"><img alt="Issues" src="https://img.shields.io/github/issues/chxseh/csgo-demo-uploader"></a>
<a href="https://github.com/chxseh/csgo-demo-uploader/pulls"><img alt="Pull Requests" src="https://img.shields.io/github/issues-pr/chxseh/csgo-demo-uploader"></a>
<a href="https://github.com/chxseh/csgo-demo-uploader/network"><img alt="Forks" src="https://img.shields.io/github/forks/chxseh/csgo-demo-uploader"></a>
<a href="https://github.com/chxseh/csgo-demo-uploader/blob/main/LICENSE.md"><img alt="License" src="https://img.shields.io/github/license/chxseh/csgo-demo-uploader"></a>
</h1></div>

Automatically Upload CSGO Demo(s) to a Discord Channel.


![img](https://i.imgur.com/9xDT2AY.png)

## Installation  

### Requirements  
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) >= v16.14.0
- [pm2](https://www.npmjs.com/package/pm2) (`npm i -g pm2`) *(Optional)*

### Setup  
1. Create a new [Discord Application](https://discord.com/developers/applications).
2. Make it a Bot account.
3. Run the following commands:
```bash
git clone https://github.com/chxseh/csgo-demo-uploader
cd csgo-demo-uploader
npm i
cp src/config.json.example src/config.json
# Windows: copy src/config.json.example src/config.json
# Edit src/config.json with your Token, Demo Path, and Upload Channel ID.
node .
```

To enable auto recording on your server, add these lines in your server.cfg:
```
tv_enable 1
tv_autorecord 1
tv_maxclients 0
```
