const {RaffleCandidate} = require('./raffle');

module.exports = class RaffleCandidateSlackRepository {

    static SLACKBOT_ID = 'USLACKBOT';

    constructor(webClient) {
        this._webClient = webClient;
    }

    async getUsers(filterFn) {
        const userListResponse = await this._webClient.users.list();
        if (!userListResponse.ok) {
            throw new Error('could not list users');
        }
        return userListResponse.members
            .filter(filterFn)
            .map((user) => new RaffleCandidate(user.id, user.real_name, user.profile.email, user.profile.image_192));
    }
}
