const {RafflePrize} = require('./raffle');
const fs = require('fs');

module.exports = class RafflePrizeFileRepository {

    constructor(prizeFile) {
        const rawPrizes = fs.readFileSync(prizeFile);
        this._prizes = JSON.parse(rawPrizes.toString()).map((rawPrize) => new RafflePrize(rawPrize.description)).sort(() => 0.5 - Math.random());
    }

    async getPrizes() {
        return this._prizes;
    }
}
