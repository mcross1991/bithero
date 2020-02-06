
const fs = require('fs');
const path = require('path');

const Area = require('./models/area');
const Weapon = require('./models/weapon');
const Spell = require('./models/spell');
const Item = require('./models/item');

class ResourceBundle {

    constructor(data) {
        this.data = data;
    }

    getResource(category, id) {
        if (typeof this.data[category][id] == 'undefined') {
            throw new Error(`Resource in category ${category} with id ${id} does not exist`);
        }
        return this.data[category][id];
    }
}

class ResourceLoader {

    constructor(configDirectory) {
        this.configDirectory = configDirectory;
    }

    loadAllResources() {
        let data = {
            'area': this.loadResourceBatch('area', Area),
            'weapon': this.loadResourceBath('weapon', Weapon),
            'spell': this.loadResourceBatch('spell', Spell),
            'item': this.loadResourceBatch('item', Item), 
        };

        return new ResourceBundle(data);
    }

    loadResourceBatch(key, classType) {
        let data = JSON.parse(fs.readFileSync(path.join(this.configDirectory, `${key}.json`)));
        if (!data || !data[key]) {
            throw new Error(`Data does not contain information for ${key}`);
        }

        let batch = {};

        for (let category in data[key]) {
            batch[category] = {};

            let nestedData = data[key][category];
            for (let index=0; index < nestedData.length; index++) {
                let id = nestedData[index].id;
                batch[category][id] = new classType(nestedData[index]);
            }
        }

        return batch;
    }
}

module.exports = ResourceLoader;

