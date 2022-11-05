class RaffleCandidate {
    constructor(id, name, email, avatar) {
        this._id = id;
        this._name = name;
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
        this._results = new Set();
        this._candidates = candidates
        this._prizes = prizes;
        this._threshold = Math.ceil(this._prizes.length / this._candidates.length);
    }

    run() {
        if (this._isCompleted()) {
            return null;
        }
        const candidates = this._filterCandidates();
        const winner = this._randomPick(candidates);
        const prize = this._currentPrize();
        const result = new RaffleResult(winner, prize);
        this._results.add(result);
        return result;
    }

    reset() {
        this._results = new Set();
    }

    status() {
        return new RaffleStatus(Array.from(this._results), this._isCompleted());
    }

    cancel(userId) {
        const result = this._findResultByUserId(userId);
        if (!result) {
            return;
        }
        this._results.delete(result);
    }

    _findResultByUserId(userId) {
        return Array.from(this._results).find((result) => result._winner._id === userId);
    }

    _isCompleted() {
        return this._results.size === this._prizes.length;
    }

    _filterCandidates() {
        return this._candidates.filter((user) => this._hasUserWonLessThan(user));
    }

    _randomPick(candidates) {
        if (candidates.length === 0) {
            throw new Error('No more available candidates');
        }
        return candidates[Math.floor(Math.random() * Math.floor(candidates.length))];
    }

    _hasUserWonLessThan(user) {
        let count = 0;
        this._results.forEach((result) => {
            if (result._winner === user && result._prize._description !== this._currentPrize()._description) {
                count++;
            }
        })
        return count < this._threshold;
    }

    _currentPrize() {
        return this._prizes[this._results.size];
    }
}

module.exports = {RaffleCandidate, RaffleWinner: RaffleResult, RafflePrize, Raffle};
