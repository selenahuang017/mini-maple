# mini-maple
Mini maple discord bot to implement some calls to maplelegends

I want to be able to implement 
- $maple usr
- $levels usr

Following this guide for bot setup: https://discordjs.guide/#before-you-begin

Some APIs I want to implement from this forum post: https://forum.maplelegends.com/index.php?threads/player-info-api.24681/
- https://maplelegends.com/api/character?name={USER}
- https://maplelegends.com/api/getlevels?name={USER}
- https://maplelegends.com/api/getavatar?name={USER}
example: 
- https://bitbucket.org/geospiza/geospiza.me/src/main/functions/maplelegends-avatar-pacifier/main.py


How to run: 
- node deploy-commands.js (if creating a new command)
- node index.js (to run host)