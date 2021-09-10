//import * as mongodb from 'mongodb';
const mongo = require('node:module')
const un = 'mattg1243';
const pw = 'chewyvuitton';
const cluster = 'main-cluster';
const uri = `mongodb+srv://${un}:${pw}@${cluster}.5pmmm.mongodb.net/maindb?writeConcern=majority`;
const mongoClient = new mongodb.MongoClient(uri);


function User(fname, lname, email, password, clients = []) {
    
    this.fname = fname,
    this.lname = lname;
    this.email = email,
    this.password = password,
    this.clients = clients;

}

User.prototype.addUserToDB = async function() {
    try {
        await mongoClient.connect();

        const db = mongoClient.db('maindb');
        const users = db.collection('users');
        
        const result = await users.insertOne(this);
        console.log(`${this.username} was added to the database as a new user`);
        alert(`${this.username} was added to the database as a new user`);

    } finally {
        await mongoClient.close();
    }
}

async function createUser(User) {
    try {
        await mongoClient.connect();

        const db = mongoClient.db('maindb');
        const users = db.collection('users');
        
        const result = await users.insertOne(User);
        console.log(`${User.username} was added to the database as a new user`);
        alert(`${User.username} was added to the database as a new user`);

    } finally {
        await mongoClient.close();
    }
}

User.prototype.addClient = async function(client) {
    try {
       
        await mongoClient.connect();

        const db = mongoClient.db('maindb');
        const users = db.collection('users');
        const query = {'username': this.username};
        
        const result = await users.updateOne(query, { $push: {clients: client}})
        
        console.log(`${result.insertedCount} clients were inserted to the ${this.username}'s profile.`)

    } finally {
        
        await mongoClient.close();

    }
}

User.prototype.addEvent = async function(client, event) {
    
    try {

        await mongoClient.connect();

        const db = mongoClient.db('maindb');
        const users = db.collection('users');
        const userQuery = {'username': this.username};
        const clients = await users.findOne(userQuery).clients;
        const currentClient = await clients.findOne({'lastname': client.lastname, 'firstName': client.firstname});

        const result = await currentClient.update({ $push: {events: event}})
        console.log(`${result}`)
    } finally {

        await mongoClient.close();

    }
}

function Client(lastname, firstname, balance, sessions) {
    
    this.lastname = lastname,
    this.firstname = firstname,
    this.balance = balance,
    this.sessions = sessions

}


function Event(date, type, duration, rate, charge, amount) {
    
    this.date = date,
    this.type = type,
    this.duration = duration,
    this.rate = rate
    this.charge = duration * rate;
    this.amount = amount;

}


/*
clientFname = 'Eric';
clientLname = 'Smith';
clientBalance = 732;

testSession = new Event('09-06-2021', '1on1', 30, 150);
testSession2 = new Event('08-24-2021', 'group', 47, 150);


testClient1 = new Client(clientLname, clientFname, testSession, clientBalance);
testClient2 = new Client('Smith', 'Jane', 3200, testSession2);
testClient3 = new Client('Appleseed', 'Jonny', 300, testSession2);

testClient = new Client('Boy', 'Kid', 2000, testSession)

clientsArr = [testClient1, testClient2];

eventArr = [testSession, testSession2];

// testUser = new User(username, email, password, clientsArr);

let ethan = new User('eg123', 'something', 'refund@gmail', clientsArr);

console.dir(testClient1);
console.log('\n+++++++++++++++++++++++++++++\n');
console.log(testClient1['clients']);
*/
async function run() {
    try {
        await mongoClient.connect();

        const db = mongoClient.db('maindb');
        const users = db.collection('users');

        const result = await users.insertOne(testClient1);
        console.log(`${result.insertedCount} documents were inserted with _id ${result.insertedId}.`);

        const dad = await users.findOne({username: 'scottg2139'})
        console.log(dad['email']);
        //let dad = users.findOne({'username': 'scottg2139'});
        //console.log(dad);

    } finally {
        await mongoClient.close();
    }
}





// ethan.addClient(testClient3);
// addTest.addUserToDB();


// addTest.addUserToDB().catch(console.dir());
// addTest.addClient(testClient).catch(console.dir());
// addTest.addEvent(testClient, eventArr);

// run().catch(console.dir);

export {User, Client, Event, un, pw, uri, mongoClient}