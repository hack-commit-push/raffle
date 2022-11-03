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

    // TODO: make channel name configurable
    async _findOrgIds() {
        return this._slackChannelRepository.findOne('paris2022-org', true)
            .then(channel => channel.id)
            .then(channelId => this._slackUserRepository.findAllMemberIds(channelId))
    }

    // TODO: make channel name configurable
    async _findAllRaffleCandidateIds() {
        return this._slackChannelRepository.findOne('paris2022-raffle', false)
            .then(channel => channel.id)
            .then(channelId => this._slackUserRepository.findAllMemberIds(channelId))
    }
}
