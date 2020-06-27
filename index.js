const {WebClient} = require('@slack/web-api');

const token = process.env.SLACK_TOKEN;
if (!token) {
    throw new Error('Missing envvar SLACK_TOKEN');
}

const slackbotId = 'USLACKBOT';
const web = new WebClient(token);

class RaffleUser {
    constructor(id, email, avatar) {
        this._id = id;
        this._email = email;
        this._avatar = avatar;
    }

    get id() {
        return this._id;
    }

    get email() {
        return this._email;
    }

    get avatar() {
        return this._avatar;
    }
}

class Prize {
    constructor(description) {
        this._description = description;
    }

    get description() {
        return this._description;
    }
}

class RaffleWinner {
    constructor(user, prize) {
        this._user = user;
        this._prize = prize;
    }


    get user() {
        return this._user;
    }

    get prize() {
        return this._prize;
    }
}

class Raffle {
    constructor(users, prizes) {
        this._winners = new Set();
        this._users = users
        this._prizes = prizes;
    }

    run() {
        if (this._winners.size === this._prizes.length) {
            throw new Error('No more prize to win, sorry!')
        }
        const candidates = this._filterCandidates();
        const winner = this._randomPick(candidates);
        this._winners.add(winner);
        return new RaffleWinner(winner, this._prizes[this._winners.size - 1]);
    }

    _filterCandidates() {
        return this._users.filter((user) => !this._winners.has(user));
    }

    _randomPick(candidates) {
        if (candidates.length === 0) {
            throw new Error('No more available candidates');
        }
        return candidates[Math.floor(Math.random() * Math.floor(candidates.length))];
    }
}

(async () => {
    const userListResponse = await web.users.list();
    if (!userListResponse.ok) {
        return Promise.reject('could not list users');
    }
    const prizes = [
        new Prize('1 ebook from https://pragprog.com/'),
        new Prize('1 ebook from https://pragprog.com/'),
        new Prize('1 ebook from https://pragprog.com/'),
        new Prize('1 USD 20 voucher from https://nostarch.com/'),
        new Prize('1 USD 20 voucher from https://nostarch.com/'),
    ]
    const initialCandidates = userListResponse.members
        .filter((user) => !user.is_admin && !user.is_bot && user.id !== slackbotId)
        .map((user) => new RaffleUser(user.id, user.profile.email, user.profile.image_192));
    const raffle = new Raffle(initialCandidates, prizes);

    for (let i = 0; i < prizes.length; i++) {
        const raffleWinner = raffle.run();
        console.log(`Congratulations to ${raffleWinner.user.email} who just won ${raffleWinner.prize.description}`);
    }
})();
