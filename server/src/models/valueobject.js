
class ValueObject {

    constructor(values, schemaName, schema) {
        this.schemaName = schemaName;
        this.schema = schema;
        this.data = {};

        for (let key in schema) {
            this.data[key] = null;

            if (typeof values[key] != 'undefined') {
                this.data[key] = values[key];
            }
        }
    }

    toJSON() {
        let toConvert = {};
        for (let key in this.data) {
            if (this.data[key] instanceof ValueObject) {
                toConvert[key] = this.data[key].toJSON();
            } else {
                toConvert[key] = this.data[key];
            }
        }
        return JSON.stringify(toConvert);
    }
}

module.exports = ValueObject;

