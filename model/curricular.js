const mongoose = require("mongoose");

const curricularSchema = mongoose.Schema({
  timeTable: [
    {
        class1: {
            type:String,
            enum: ['math','english','science','none'],
            default:"none"
        },
        class2: {
            type:String,
            enum: ['math','english','science','node'],
            default:"none"
        },
        class3: {
            type:String,
            enum: ['math','english','science','none'],
            default:"none"
        }
    }
  ],
  notice: {
    type: String,
    required: true,
    default: "no message",
  },
});

const Curricular = mongoose.model("Curricular", curricularSchema);

module.exports = Curricular;
