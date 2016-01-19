**How to use**:
- clone the repository on your own server
- in 'routes/coins.js': put your team token (https://api.slack.com/tokens to get one)

Then, setup a Slash Command for your team.

*Recommended settings*:
- Command: /slackcoin
- URL: http://YOUR.URL/api/coins
- Method: POST
- Customize Name: SlackCoin Bot
- Customize Icon: :money_with_wings: emoji

**Available commands**:
- /slackcoin init [amount]
- /slackcoin give [username] [amount] [reason]
- /slackcoin history
- /slackcoin status
- /slackcoin teamstatus
