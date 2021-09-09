const { MongoClient } = require('mongodb');
const readLine = require('readline');
const inquirer = require('inquirer');
let un = 'mattg1243';
let pw = 'chewyvuitton';
let cluster = 'main-cluster';
let uri = `mongodb+srv://${un}:${pw}@${cluster}.5pmmm.mongodb.net/maindb?writeConcern=majority`;
const mongoClient = new MongoClient(uri);


function User(username, email, password, clients) {
    
    this.username = username,
    this.email = email,
    this.password = password,
    this.clients = clients

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

User.prototype.addUserToDB = async function() {
    try {
        await mongoClient.connect();

        const db = mongoClient.db('maindb');
        const users = db.collection('users');
        
        const result = await users.insertOne(this);
        console.log(`${this.username} was added to the database as a new user`);

    } finally {
        await mongoClient.close();
    }
}


function Client(lastname, firstname, retainer, sessions, clientBalance) {
    
    this.lastname = lastname,
    this.firstname = firstname,
    this.retainer = retainer,
    this.sessions = sessions
    this.balance = clientBalance;

}


function Event(date, type, duration, rate, charge, amount) {
    
    this.date = date,
    this.type = type,
    this.duration = duration,
    this.rate = rate
    this.charge = duration * rate;
    this.amount = amount;

}


let regQuestions = [
    {
        type: 'input',
        name: 'username',
        message: 'Enter a username for the new user : '
    },
    {
        type: 'input',
        name: 'email',
        message: 'Now enter an email for the user : '
    },
    {
        type: 'input',
        name: 'password',
        message: 'Set your password : ',
    }
]



clientFname = 'Eric';
clientLname = 'Smith';
clientBalance = 732;

testSession = new Event('09-06-2021', '1on1', 30, 150);
testSession2 = new Event('08-24-2021', 'group', 47, 150);


testClient1 = new Client(clientLname, clientFname, testSession, clientBalance);
testClient2 = new Client('Smith', 'Jane', 3200, testSession2);
testClient3 = new Client('Appleseed', 'Jonny', 300, testSession2);

clientsArr = [testClient1, testClient2];

// testUser = new User(username, email, password, clientsArr);

let ethan = new User('eg123', 'something', 'refund@gmail', clientsArr);

console.dir(testClient1);
console.log('\n+++++++++++++++++++++++++++++\n');
console.log(testClient1['clients']);

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

let addTest = new User('addtest', 'asdkjfh', 'asdkfjh', clientsArr);

ethan.addClient(testClient3);
addTest.addUserToDB();

// run().catch(console.dir);