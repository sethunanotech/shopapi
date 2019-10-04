const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    trim: true
  },
  make: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  isrecommended: {
    type: Boolean,
    required: true
  },
  detail: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model("Product", productSchema);
