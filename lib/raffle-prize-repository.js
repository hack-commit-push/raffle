const {RafflePrize} = require('./raffle');

module.exports = class RafflePrizeInMemoryRepository {
    async getPrizes() {
        return [
            new RafflePrize('1 ebook from https://pragprog.com/'),
            new RafflePrize('1 ebook from https://pragprog.com/'),
            new RafflePrize('1 ebook from https://pragprog.com/'),
            new RafflePrize('1 USD 20 voucher from https://nostarch.com/'),
            new RafflePrize('1 USD 20 voucher from https://nostarch.com/'),
        ];
    }
}
