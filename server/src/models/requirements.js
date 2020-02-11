
const ValueObject = require('./valueobject');
const { BasicStats } = require('./stats');

class Requirements extends ValueObject {

    constructor(values) {
        super(values, 'requirements', {
            'stats': 'object'
        });

        this.data['stats'] = new BasicStats(this.data['stats']);
    }
}

module.exports = Requirements;

