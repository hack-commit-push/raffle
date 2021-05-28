const {WebClient} = require('@slack/web-api');
const {Raffle} = require('./lib/raffle');
const RafflePrizeRepository = require('./lib/raffle-prize-repository');
const express = require('express');
const path = require('path');
const fs = require('fs');
const SlackChannelRepository = require("./lib/slack-channel-repository");
const SlackUserRepository = require("./lib/slack-user-repository");
const RaffleCandidateService = require("./lib/raffle-candidate-service");

const readEnvOrFail = (key) => {
    const result = process.env[key];
    if (!result) {
        throw new Error(`Missing envvar ${key}`);
    }
    return result;
}

const checkEnvVarPath = (path, envVar) => {
    if (!fs.statSync(path).isFile()) {
        throw new Error(`${path} does not point to a regular file. Please review your ${envVar} envvar configuration`);
    }
}

const token = readEnvOrFail('SLACK_TOKEN');
const attendeeCsvPath = readEnvOrFail('ATTENDEE_CSV_FILE');
checkEnvVarPath(attendeeCsvPath, 'ATTENDEE_CSV_FILE');
const port = process.env.PORT || 3000;
const prizeFilePath = process.env.PRIZE_FILE || `${__dirname}/samples/prizes.json`;
checkEnvVarPath(prizeFilePath, 'PRIZE_FILE');
const app = express();
app.use(express.json());

const slackClient = new WebClient(token);
const prizeRepository = new RafflePrizeRepository(prizeFilePath);
const raffleCandidateService = new RaffleCandidateService(new SlackChannelRepository(slackClient), new SlackUserRepository(slackClient));

(async () => {
    const prizes = await prizeRepository.getPrizes();
    const initialCandidates = await raffleCandidateService.findInitialCandidates();
    const raffle = new Raffle(initialCandidates, prizes);

    app.get('/', (req, res) => {
        res.sendFile(path.join(`${__dirname}/static/raffle.html`));
    });

    app.get('/status', (req, res) => {
        res.status(200).send(raffle.status());
    });

    app.post('/cancel-winner', (req, res) => {
        raffle.cancel(req.body.userId);
        res.status(204).send();
    });

    app.post('/reset', (req, res) => {
        raffle.reset();
        res.status(204).send();
    });

    app.post('/', (req, res) => {
        const raffleResult = raffle.run();
        if (!raffleResult) {
            res.status(204).send();
            return;
        }
        res.status(200).send(raffleResult);
    });

    app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
})();
