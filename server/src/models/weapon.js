
const { ElementalStats } = require('./stats');
const Requirements = require('./requirements');
const ValueObject = require('./valueobject');

class Weapon extends ValueObject {

    constructor(values) {
        super(values, 'weapon', {
            'id': 'string',
            'name': 'string',
            'description': 'string',
            'price': 'integer',
            'damage': 'integer',
            'elemental': 'object',
            'requirements': 'object',
        });

        this.data['elemental'] = new ElementalStats(this.data['elemental']);
        this.data['requirements'] = new Requirements(this.data['requirements']);
    }
}

module.exports = Weapon;

