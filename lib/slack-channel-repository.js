module.exports = class SlackChannelRepository {

    constructor(webClient) {
        this._webClient = webClient;
        this._cachedChannels = null;
    }

    async findOne(channelName, isPrivate = false) {
        if (!this._cachedChannels || this._cachedChannels.private !== isPrivate) {
            this._cachedChannels = {
                private: isPrivate,
                result: (await this._listChannels(isPrivate)).channels
            };
        }
        return this._cachedChannels.result.find(channel => channel.name === channelName)
    }

    _listChannels(isPrivate) {
        return this._webClient.conversations.list({types: this._channelType(isPrivate)});
    }

    _channelType(isPrivate) {
        if (isPrivate) {
            return 'private_channel'
        }
        return 'public_channel';
    }
}
