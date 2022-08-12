import Event from '../../models/event-schema';
import Client from '../../models/client-schema';


export default class ApiHandlers {
  /**
   * Http handlers for all /api routes
   */
  static getEventsList = async (req, res) => {
    // save clientID
    const clientID = req.query.clientID;
    // query database for events and send back as json
    try {
      const eventsList = await Event.find({ clientID: clientID });
      return res.status(200).json(eventsList);
    } 
    
    catch (err) {
      console.error(err);
      return res.status(503).json("Error: " + err);
    }
  }
  
  static getClientsList = async (req, res) => {
    // save userID
    const userID = req.query.userID;
    // query database for events and send back as json
    try {
      const clientsList = await Client.find({ ownerID: userID });
      res.status(200).json(clientsList);
    } 
    
    catch (err) {
      console.error(err);
      return res.status(503).json("Error: " + err);
    }
  }
  
  static getEvent = async (req, res) => {
    // save eventID
    const eventID = req.query.id;
    // query database
    try {
      const event = await Event.findOne({ _id: eventID });
      res.status(200).json(event);
    }
  
    catch (err) {
      console.error(err);
      return res.status(503).json("Error: " + err);
    }
  }
  
  static getClient = async (req, res) => {
    // save clientID
    const clientID = req.query.id;
    // query databse
    try {
      const client = await Client.findOne({ _id: clientID });
      res.status(200).json(client);
    }
  
    catch (err) {
      console.error(err);
      return res.status(503).json("Error: " + err);
    }
  }
}
