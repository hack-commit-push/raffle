module.exports = class RaffleCandidateService {

    constructor(slackChannelRepository, slackUserRepository) {
        this._slackChannelRepository = slackChannelRepository;
        this._slackUserRepository = slackUserRepository;
    }

    async findInitialCandidates() {
        const orgIds = await this._findOrgIds();
        const allCandidateIds = await this._findAllRaffleCandidateIds();
        const eligibleParticipantIds = allCandidateIds.filter(candidateId => !orgIds.includes(candidateId));
        return this._slackUserRepository.findAllByIds(eligibleParticipantIds)
    }

    async _findOrgIds() {
        return this._slackChannelRepository.findOne('paris2021-org', true)
            .then(channel => channel.id)
            .then(channelId => this._slackUserRepository.findAllMemberIds(channelId))
    }

    async _findAllRaffleCandidateIds() {
        return this._slackChannelRepository.findOne('paris2021-raffle', false)
            .then(channel => channel.id)
            .then(channelId => this._slackUserRepository.findAllMemberIds(channelId))
    }
}
