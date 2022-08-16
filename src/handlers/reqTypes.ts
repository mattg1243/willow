// this module contains interfaces that correspond to the 
// structure of request bodys for different route handlers

interface BaseUserClient {
  fname: string,
  lname: string,
  email?: string, 
}

// client routes
export interface ISaveEventReqBody {
  // this is the same structure as the update event handler
  clientID: string,
  date: string | Date,
  type: string,
  detail: string,
  hours: string,
  minutes: string,
  rate: number,
  amount: number,
  newBalance: number,
  user: string
}

export interface IDeleteEventReqBody {
  clientID: string,
  eventID: string,
  user: string
}

export interface IMakeStatementReqBody {
  amount: number,
  notes: string
}

// user routes
export interface IRegisterUserReqBody extends BaseUserClient {
  username: string,
  password: string,
  nameForHeader?: string,
  phone: string,
  street: string, 
  city: string,
  state: string,
  zip: string,
  paymentInfo: string       // not paymentInfo struct, comes in as JSON string
}

export interface IUpdateUserReqBody extends IRegisterUserReqBody {
  license: string,
  user: string
}

export interface IAddNewClientReqBody extends BaseUserClient {
  ownerID: string,
  phonenumber: string,
  rate: number,
  user: string,
  balanceNotifyThreshold: string
}

export interface IDeleteClient {
  clientID: string,
  user: string
}

export interface IUpdateClientReqBody extends IAddNewClientReqBody, IDeleteClient {
  isArchived: boolean
}

export interface IResetPasswordReqBody {
  email: string
}

export interface ISetNewPasswordReqBody {
  username: string,
  password: string
}