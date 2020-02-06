
const ValueObject = require('./valueobject');

class Spell extends ValueObject {

    constructor(values) {
        super(values, 'spell', {
            'id': 'string',
            'name': 'string',
            'description': 'string',
            'damage': 'integer',
            'element': 'string'
        });
    }
}

module.exports = Spell;

