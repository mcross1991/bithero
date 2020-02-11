
const ValueObject = require('./valueobject');

class Item extends ValueObject {

    constructor(values) {
        super(values, 'item', {
            'id': 'string',
            'name': 'string',
            'description': 'string',
            'price': 'integer',
            'stat_effects': 'basic_stats',
            'vital_effects': 'vital_stats',
            'elemental_effects': 'elemental_stats'
        });
    }
}

module.exports = Item;

