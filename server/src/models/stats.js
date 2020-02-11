
const ValueObject = require('./valueobject');

class BasicStats extends ValueObject {

    constructor(values) {
        super(values, 'basic_stats', {
            'level': 'integer',
            'experience': 'integer',
            'strength': 'integer',
            'defense': 'integer',
            'intelligence': 'integer',
            'stamina': 'integer'
        });
    }
}

class VitalStats extends ValueObject {

    constructor(values) {
        super(values, 'vital_stats', {
            'health': 'integer',
            'magic': 'integer',
            'energy': 'integer'
        });
    }
}

class ElementalStats extends ValueObject {

    constructor(values) {
        super(values, 'elemental_stats', {
            'ice': 'integer',
            'fire': 'integer',
            'electricity': 'integer'
        });
    }
}

module.exports = {
    'BasicStats': BasicStats,
    'VitalStats': VitalStats,
    'ElementalStats': ElementalStats,
};

