After a CS:GO Demo is finished recording, upload to a Discord Channel.

![img](https://i.imgur.com/FSgkaFY.png)

```bash
git clone https://github.com/chxseh/csgo-demo-uploader
cd csgo-demo-uploader
npm i
cp src/config.json.example src/config.json
# edit config
node .
```

See [SourceTV](https://developer.valvesoftware.com/wiki/SourceTV#Recording_Games) Docs for setting up a CS:GO Server to auto-record demos.
