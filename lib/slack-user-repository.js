const {RaffleCandidate} = require('./raffle');

module.exports = class SlackUserRepository {

    constructor(webClient) {
        this._webClient = webClient;
        this._cachedUsers = null;
    }

    async findAllMemberIds(channelId) {
        return await this._webClient.conversations.members({channel: channelId})
            .then(response => response.members)
    }

    async findAllByIds(ids) {
        return (await this._findMembers())
            .filter(user => ids.includes(user.id))
            .map((user) => new RaffleCandidate(user.id, user.real_name, user.profile.email, user.profile.image_192));
    }

    async _findMembers() {
        if (!this._cachedUsers) {
            this._cachedUsers = (await this._webClient.users.list()).members;
        }
        return this._cachedUsers;
    }
}
