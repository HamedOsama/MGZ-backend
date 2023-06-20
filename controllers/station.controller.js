const Station = require("../models/station");

exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find({});
    res.status(200).json({ code: 200, message: 'success', data: stations });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Internal server error!',
      data: null,
    });
  }
};