
const ValueObject = require('./valueobject');
const { ElementalStats, BasicStats, VitalStats } = require('./stats');

class Player extends ValueObject {

    constructor(values) {
        super(values, 'player', {
            'id': 'string',
            'name': 'string',
            'vitals': 'vital_stats',
            'stats': 'basic_stats',
            'elemental': 'elemental_stats',
            'items': 'array'
        });

        this.data['vitals'] = new VitalStats(this.data['vitals']);
        this.data['stats'] = new BasicStats(this.data['stats']);
        this.data['elemental'] = new ElementalStats(this.data['elemental']);
    }
}

Player.newPlayer = function(id, name) {
    return new Player({
        'id': id,
        'name': name,
        'vitals': {
            health: 100,
            magic: 100,
            energy: 100
        },
        'stats': {
            level: 1,
            experience: 0,
            strength: 5,
            defense: 5,
            intelligence: 5,
            stamina: 5
        },
        'elemental': {
            ice: 0,
            fire: 0,
            electricity: 0
        },
        'items': []
    });
}

module.exports = Player;

