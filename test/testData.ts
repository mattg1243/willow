export const testUser = {
  _id: "62e96de85ea97c5b5f31584c",
  fname: "tester",
  lname: "mctesterson",
  email: "tester@tester.com",
  username: "tester1234",
  password: "passthetest",
  passwordConfirm: "passthetest",
  nameForHeader: "Sir Testalot",
  phone: 1234565555,
  street: "123 wizard ln",
  city: "new york",
  state: "NY",
  zip: 94553,
};

export const testEvent = {
  _id: "62e981edb2891af83b748dc0",
  clientID: "62e97b0c37496a5a14c545fa",
  date: "2022-08-02",
  type: "Meeting",
  detail: "",
  hours: 2,
  minutes: 0,
  rate: 200,
  amount: 0,
  newBalance: 0,
};

export const testClient = {
  _id: "62e97b0c37496a5a14c545fa",
  fname: "client",
  lname: "klein",
  email: "clientklein@gmail.com",
  phonenumber: 5555555555,
  rate: 200,
  // needs userID and token fields
};