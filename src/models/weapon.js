
const Weapon = require('./weapon');

class Weapon extends ValueObject {

    constructor(values) {
        super(values, 'weapon', {
            'id': 'string',
            'name': 'string',
            'description': 'string',
            'damage': 'integer',
            'elemental': 'elemental_stats'
        });
    }
}

module.exports = Weapon;

