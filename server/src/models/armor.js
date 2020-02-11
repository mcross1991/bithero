
const ValueObject = require('./valueobject');

class Armor extends ValueObject {

    constructor(values) {
        super(values, 'armor', {
            'id': 'string',
            'name': 'string',
            'description': 'string',
            'defense': 'integer',
            'elemental': 'elemental_stats'
        });
    }
}

module.exports = Armor;

