const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  lineName: {
    type: String,
    required: true,
  },
  start: {
    name: {
      type: String,
      required: true,
      default: 'الشركة',
    },
    latitude: {
      type: Number,
      required: true,
      default: 30.05739932130038,
    },
    longitude: {
      type: Number,
      required: true,
      default: 31.19373297592501,
    },
  },
  way: [{
    type: String,
    required: true,
  }],
  end: {
    type: String,
    required: true,
    default: 'مصنع جريش للزجاج العاشر من رمضان',
  },
  color: {
    type: String,
    required: true,
    default: '#1b263b',
  },
}, { timestamps: true });

const Station =  mongoose.model('Station', stationSchema);

module.exports = Station;