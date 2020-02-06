
const ValueObject = require('./valueobject');

class Area extends ValueObject {

    constructor(values) {
        super(values, 'area', {
            'id': 'string',
            'name': 'string',
            'description': 'string',
            'paths': 'array',
            'resources': 'array',
            'enemies': 'array'
        });
    }
}

module.exports = Area;

