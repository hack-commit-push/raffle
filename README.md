# hack-commit-push raffle application

## Environment

 - `SLACK_TOKEN` envvar: Slack token including at least `groups:read`, `users:read` and `users:read.email` permissions.
 - `PORT` (optional, default: `3000`) envvar: HTTP port for the server to listen to
 - `PRIZE_FILE` (optional, default: `./samples/prizes.json`) envvar: static JSON file for prize data
 - `ATTENDEE_CSV_FILE` envvar: static CSV file for alf.io attendee export

Note that the corresponding bot should be invited to private channels before the token can be used to retrieve those.
 
## Getting started

```shell script
 $ npm install
 $ node index.js
Listening at http://localhost:3000
```
And browse 😎!
