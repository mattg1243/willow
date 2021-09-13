const loginBtn = document.getElementById('loginBtn');
const regBtn = document.getElementById('regBtn');
const fnameField = document.getElementById('fnameField');
const lnameField = document.getElementById('lnameField')
const emailField = document.getElementById('emailField');
const passwordField = document.getElementById('passwordField');


async function createUser(newUser) {
    try {
        await mongoClient.connect();

        const db = mongoClient.db('maindb');
        const users = db.collection('users');
        
        const result = await users.insertOne(newUser);
        console.log(`${newUser.fname} was added to the database as a new user`);

    } finally {
        await mongoClient.close();
    }
}

regBtn.addEventListener('click', () => {

    const fnameStr = fnameField.value;
    const lnameStr = lnameField.value;
    const emailStr = emailField.value;
    const passwordStr = passwordField.value;

    const newUser = {
        "fname": fnameStr,
        "lname": lnameStr,
        "email": emailStr,
        "password": passwordStr,
        "clients": []
    };

    createUser(newUser).catch(console.dir);

    //alert(`Thanks for signing up ${fnameStr}! Try logging in and adding some clients.`);

});
