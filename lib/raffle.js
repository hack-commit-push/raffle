
class RaffleCandidate {
    constructor(id, name, email, avatar) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._avatar = avatar;
    }
}

class RafflePrize {
    constructor(description) {
        this._description = description;
    }
}

class RaffleResult {
    constructor(winner, prize) {
        this._winner = winner;
        this._prize = prize;
    }
}

class RaffleStatus {
    constructor(results, done) {
        this._results = results;
        this._done = done;
    }
}

class Raffle {
    constructor(candidates, prizes) {
        this._winners = new Set();
        this._candidates = candidates
        this._prizes = prizes;
    }

    run() {
        if (this._isCompleted()) {
            return null;
        }
        const candidates = this._filterCandidates();
        const winner = this._randomPick(candidates);
        this._winners.add(winner);
        return new RaffleResult(winner, this._prizes[this._winners.size - 1]);
    }

    reset() {
        this._winners = new Set();
    }

    status() {
        const results = Array.from(this._winners).map((winner, i) => new RaffleResult(winner, this._prizes[i]));
        return new RaffleStatus(results, this._isCompleted());
    }

    _isCompleted() {
        return this._winners.size === this._prizes.length;
    }

    _filterCandidates() {
        return this._candidates.filter((user) => !this._winners.has(user));
    }

    _randomPick(candidates) {
        if (candidates.length === 0) {
            throw new Error('No more available candidates');
        }
        return candidates[Math.floor(Math.random() * Math.floor(candidates.length))];
    }
}

module.exports = {RaffleCandidate, RaffleWinner: RaffleResult, RafflePrize, Raffle};
