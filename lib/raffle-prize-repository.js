const {RafflePrize} = require('./raffle');
const fs = require('fs');

module.exports = class RafflePrizeFileRepository {

    constructor(prizeFile) {
        const rawPrizes = fs.readFileSync(prizeFile);
        this._prizes = JSON.parse(rawPrizes).map((rawPrize) => new RafflePrize(rawPrize.description));
    }

    async getPrizes() {
        return this._prizes;
    }
}
