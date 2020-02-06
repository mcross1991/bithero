
class ValueObject {

    constructor(values, schemaName, schema) {
        this.schemaName = schemaName;
        this.schema = schema;
        this.data = {};

        for (let key in schema) {
            this.data[key] = values[key] || null;
        }
    }

    toJSON() {
        return JSON.stringify(this.data);
    }
}

module.exports = ValueObject;

