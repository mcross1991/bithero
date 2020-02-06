
class Shop extends ValueObject {

    constructor(values) {
        super(values, 'shop', {
            'id': 'string',
            'name': 'string',
            'description': 'string',
            'items': 'item[]'
        });
    }
}

class Enemy extends ValueObject {

    constructor(values) {
        super(values, 'enemy', {
            'id': 'string',
            'name': 'string',
            'description': 'string',
            'vitals': 'vital_stats',
            'stats': 'basic_stats',
            'elemental': 'elemental_stats'
        });
    }
}

class Player extends ValueObject {

    constructor(values) {
        super(values, 'player', {
            'id': 'string',
            'name': 'string',
            'description': 'string',
            'vitals': 'vital_stats',
            'stats': 'basic_stats',
            'elemental': 'elemental_stats'
        });
    }
}

//module.exports = { Area: Area };

