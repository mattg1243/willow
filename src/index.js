import { User, createUser } from './user.js';

const loginBtn = document.getElementById('loginBtn');
const regBtn = document.getElementById('regBtn');
const fnameField = document.getElementById('fnameField');
const lnameField = document.getElementById('lnameField')
const emailField = document.getElementById('emailField');
const passwordField = document.getElementById('passwordField');


regBtn.addEventListener('click', () => {

    const fnameStr = fnameField.textContent;
    const lnameStr = lnameField.textContent;
    const emailStr = emailField.textContent;
    const passwordStr = passwordField.textContent;

    const newUser = new User.User(fnameStr, lnameStr, emailStr, passwordStr);

    createUser(newUser);

    //alert(`Thanks for signing up ${fnameStr}! Try logging in and adding some clients.`);

});
