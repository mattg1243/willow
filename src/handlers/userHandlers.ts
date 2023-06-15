import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { randomBytes } from 'crypto';
import User from '../models/user-model';
import Client from '../models/client-schema';
import Event from '../models/event-schema';
import DatabaseHelpers from '../utils/databaseHelpers';
import {
  IRegisterUserReqBody,
  IUpdateUserReqBody,
  IUpdateClientReqBody,
  IAddNewClientReqBody,
  IDeleteEventReqBody,
  IResetPasswordReqBody,
  ISetNewPasswordReqBody,
} from './reqTypes';
import transporter from './mailerConfig';
import { ObjectId } from 'mongodb';

export default class UserHandlers {
  static registerUser = async (
    req: Request<ParamsDictionary, {}, IRegisterUserReqBody>,
    res: Response
  ): Promise<Response> => {
    const { fname, lname, email, username, password, nameForHeader, phone, street, city, state, zip, paymentInfo } =
      req.body;
    console.log(req.body);
    try {
      await User.register(
        new User({
          username,
          fname,
          lname,
          email,
          nameForHeader,
          phone,
          street,
          city,
          state,
          zip,
          paymentInfo: paymentInfo,
        }),
        password
      );

      const response = await DatabaseHelpers.getAllData({ username: req.body.username });
      return res.status(200).json(response);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  };

  static updateUserInfo = async (
    req: Request<ParamsDictionary, {}, IUpdateUserReqBody>,
    res: Response
  ): Promise<Response> => {
    try {
      await User.findOneAndUpdate(
        { _id: req.body.user },
        {
          nameForHeader: req.body.nameForHeader,
          phone: req.body.phone,
          email: req.body.email,
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          paymentInfo: JSON.parse(req.body.paymentInfo),
          license: req.body.license,
        },
        { upsert: true }
      );
      const response = await DatabaseHelpers.getAllData({ _id: req.body.user });
      return res.status(200).json(response);
    } catch (err) {
      return res.status(503).json({ error: err });
    }
  };

  static deleteUser = (req: Request, res: Response) => {
    User.findOneAndDelete({ _id: req.params.id }, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      // delete all clients if there are any
      Client.deleteMany({ ownerID: req.params.id }, (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        Event.deleteMany({ ownerID: req.params.id }, (err) => {
          if (err) {
            return res.status(500).send(err);
          }

          res.status(200).json('User and associated data deleted successfully');
        });
      });
    });
  };

  static addNewClient = async (
    req: Request<ParamsDictionary, {}, IAddNewClientReqBody>,
    res: Response
  ): Promise<Response> => {
    const newClient = new Client({
      ownerID: req.body.user,
      fname: req.body.fname,
      lname: req.body.lname,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      balance: 0,
      rate: req.body.rate,
      balanceNotifyThreshold: parseFloat(req.body.balanceNotifyThreshold),
    });

    try {
      // save the new client to the database
      const savedClient = await newClient.save();
      await User.findOneAndUpdate({ _id: req.body.user }, { $push: { clients: savedClient['_id'] } })
        .populate('clients')
        .exec();
      // return the updated clients list to the user
      const clients = await DatabaseHelpers.getClients(req.body.user);
      res.status(200).json(clients);
    } catch (err) {
      return res.status(503).json({ error: err });
    }
  };

  static deleteClient = async (
    req: Request<ParamsDictionary, {}, IDeleteEventReqBody>,
    res: Response
  ): Promise<Response> => {
    try {
      await Client.findOneAndDelete({ _id: req.body.clientID });
      const response = await DatabaseHelpers.getAllData({ _id: req.body.user });
      return res.status(200).json(response);
    } catch (err) {
      return res.status(503).json({ error: err });
    }
  };

  static updateClientInfo = async (
    req: Request<ParamsDictionary, {}, IUpdateClientReqBody>,
    res: Response
  ): Promise<Response> => {
    try {
      await Client.findOneAndUpdate(
        { _id: req.body.clientID },
        {
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          phonenumber: req.body.phonenumber,
          rate: req.body.rate,
          isArchived: req.body.isArchived,
          balanceNotifyThreshold: parseFloat(req.body.balanceNotifyThreshold),
        }
      );
      const respsonse = await DatabaseHelpers.getClients(req.body.user);
      res.status(200).json(respsonse);
    } catch (err) {
      return res.status(503).json({ error: err });
    }
  };

  static resetPassword = (req: Request<ParamsDictionary, {}, IResetPasswordReqBody>, res: Response) => {
    randomBytes(32, (err, buf) => {
      if (err) {
        throw err;
      }

      const token = buf.toString('hex');
      const expireToken = Date.now() + 3600000;
      console.log('Token : ' + token);

      try {
        User.findOneAndUpdate(
          { email: req.body.email },
          { resetToken: token, expireToken: expireToken },
          (err, user) => {
            if (err) {
              throw err;
            }

            transporter.sendMail(
              {
                from: 'Willow Support <no-reply@willow.com>',
                to: req.body.email,
                subject: 'Reset your password',
                // need to change this for production
                text: `Go here to reset your password: ${process.env.BASE_URL}/resetpassword/${token}/${user.username}`,
                /*
                        html: `
                        <table>
                        <h5>Click <a href="http://localhost:3002/resetpassword/${token}/${user.username}">here</a> to reset your password<h5>
                        </table>
                        `,
                        */
              },
              (err, res) => {
                if (err) {
                  throw err;
                }

                console.log(res);
              }
            );

            return res.json(user);
          }
        );
      } catch (err) {
        throw err;
      }
    });
  };
  // should be async
  static changePassword = (req: Request<ParamsDictionary, {}, ISetNewPasswordReqBody>, res: Response): Response => {
    try {
      User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
          throw err;
        }
        console.log('Req body: ' + req.body.password);
        if (req.header('Authorization').split(' ')[1] == user.resetToken && Date.now() <= user.expireToken) {
          user.setPassword(req.body.password, (err, user) => {
            if (err) {
              throw err;
            }
            user.save();
            console.log(user);
            return res.json(user);
          });
        } else {
          return res.status(401).send('Not authorized; reset token doesnt match.');
        }
      });
    } catch (err) {
      return res.status(503).json({ error: err });
    }
  };
}
