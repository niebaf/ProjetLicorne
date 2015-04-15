/**
 * Created by Fabien on 13/04/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function validator_gender(val) {
    if (val == "f" || val == "m")
        return true;
    else
        return false;
}

var unicornSchema = new Schema({
    name: {type: String, required: true, index: {unique: true}},
    dob: {type: Date, required: true},
    weight: {type: Number, required: true, min: 0},
    gender: {type: String, enum: ["f", "m"], validate: validator_gender, required: true},
   // gender: {type: String, enum: ['f', 'm'], required: true},
    loves: {type: String},
    vampires: {type: Number, min: 0}
});

unicornSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({type: this.type}, cb);
}
var UnicornModel = mongoose.model('Unicorn', unicornSchema);
module.exports = UnicornModel;