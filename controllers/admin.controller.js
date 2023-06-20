
const ServerError = require("../utils/ErrorInterface");
const APIFeatures = require('../utils/apiFeatures');
const sendToken = require('../utils/jwtToken');
const Admin = require('../models/admin');
const Station = require("../models/station");

//auth
const signup = async (req, res, next) => {
  try {
    // get admin data from request
    const { password, email } = req.body;
    // check if admin's data exist
    if (!email || !password)
      return next(ServerError.badRequest(400, 'enter all fields'));
    // create new admin
    const admin = new Admin({
      email,
      password
    });
    // save admin in database
    await admin.save();
    sendToken(admin, 201, res);
  } catch (e) {
    console.log(e)
    e.statusCode = 400
    next(e)
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    console.log(email, password)
    if (!email || !password)
      return next(ServerError.badRequest(400, 'Email and password are required'));
    const admin = await Admin.Login(email, password);
    // send response to admin;
    sendToken(admin, 200, res);
  } catch (e) {
    e.statusCode = 401;
    next(e);
  }
};
const logout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => {
      return el != req.cookies.access_token;
    });
    await req.user.save();
    res.status(200).clearCookie('access_token', {
      httpOnly: true,
      // secure: true,
      path: '/',
      // domain: '.domain.com',
      sameSite: 'none',
    }).json({
      ok: true,
      code: 200,
      message: 'succeeded',
    })
  } catch (e) {
    next(e)
  }
};
const auth = async (req, res, next) => {
  try {
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
    })
  } catch (e) {
    next(e)
  }
}
//stats
const getStats = async (req, res, next) => {
  try {
    const stations = await Station.countDocuments();
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: {
        stations,
      }
    })
  } catch (e) {
    next(e)
  }
}

// station
const addStation = async (req, res, next) => {
  try {
    const station = new Station({
      ...req.body
    })
    await station.save();
    res.status(200).json({
      ok: true,
      code: 200,
      message: 'succeeded',
      body: station
    })
  } catch (e) {
    next(e);
  }
};
const getAllStations = async (req, res, next) => {
  try {
    const stationsQuery = new APIFeatures(Station.find(), req?.query).filter().sort().limitFields().paginate();
    const lengthQuery = Station.countDocuments();

    const [stations, totalLength] = await Promise.all([stationsQuery.query, lengthQuery]);
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: stations,
      totalLength
    })
  } catch (e) {
    next(e);
  }
};
const updateStation = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return next(ServerError.badRequest(400, 'Id is required'))
    const station = await Station.findByIdAndUpdate(id,
      { ...req.body },
      { new: true, runValidators: true }
      );
    if (!station) {
      return next(ServerError.badRequest(404, 'station not found'))
    }
    
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
      body: station
    })
  } catch (e) {
    next(e);
  }
};
const deleteStation = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return next(ServerError.badRequest(400, 'Id is required'))
    const station = await Station.findByIdAndDelete(id);
    if (!station) {
      return next(ServerError.badRequest(404, 'station not found'))
    }
    res.status(200).json({
      ok: true,
      status: 200,
      message: 'succeeded',
    })
  } catch (e) {
    next(e);
  }
};


module.exports = {
  signup,
  login,
  auth,
  logout,
  getStats,
  addStation,
  getAllStations,
  updateStation,
  deleteStation,
};