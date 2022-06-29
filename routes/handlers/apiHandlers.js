const Event = require('../../models/event-schema');
const Client = require('../../models/client-schema');

const getEventsList = async (req, res) => {
  // save clientID
  const clientID = req.query.clientID;
  // query database for events and send back as json
  try {
    const eventsList = await Event.find({ clientID: clientID });
    return res.status(200).json(eventsList);
  } 
  
  catch (err) {
    return res.status(503).json("Error: " + err);
  }
}

const getClientsList = async (req, res) => {
  // save userID
  const userID = req.query.userID;
  // query database for events and send back as json
  try {
    const clientsList = await Client.find({ ownerID: userID });
    res.status(200).json(clientsList);
  } 
  
  catch (err) {
    return res.status(503).json("Error: " + err);
  }
}

const getEvent = (req, res) => {
  
}

const getClient = (req, res) => {

}

module.exports = {
  getEventsList,
  getClientsList,
  getEvent,
  getClient
}