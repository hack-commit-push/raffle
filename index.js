const {WebClient} = require('@slack/web-api');
const {Raffle} = require('./lib/raffle');
const RaffleCandidateRepository = require('./lib/raffle-candidate-repository');
const RafflePrizeRepository = require('./lib/raffle-prize-repository');
const express = require('express');
const path = require('path');

const token = process.env.SLACK_TOKEN;
if (!token) {
    throw new Error('Missing envvar SLACK_TOKEN');
}
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const candidateRepository = new RaffleCandidateRepository(new WebClient(token));
const prizeRepository = new RafflePrizeRepository();

(async () => {
    const prizes = await prizeRepository.getPrizes();
    const initialCandidates = await candidateRepository.getUsers((user) =>
        !user.is_admin &&
        !user.is_bot &&
        user.id !== RaffleCandidateRepository.SLACKBOT_ID);
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
