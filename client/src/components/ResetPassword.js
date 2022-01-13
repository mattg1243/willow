import React, { useState } from 'react';
import {
    Input, 
    VStack, 
    Button,
    FormLabel,
 } from '@chakra-ui/react';
 import { useParams, useNavigate } from 'react-router-dom';
 import axios from 'axios';

 export default function ResetPassword() {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsDontMatch, setPasswordsDontMatch] = useState(true);

    const { token, username } = useParams();
    const navigate = useNavigate();

    const changePassword = () => {
        console.log("token: " + token);
        console.log("username: " + username);
        console.log("password: " + password);
        axios.post("/user/changepassword", {
            password: password,
            username: username,
            token: token,
        }).then((response) => {
            console.log(response);
            navigate('/login');
        }).catch(err => console.error(err));
    };

    return (
        <>
            <header className="navbar" style={{backgroundColor: "#03b126", display: "flex", flexDirection: "column"}}>
                <h3 className="willowCursive" style={{color: 'white', fontSize: '3rem', padding: '.5rem'}}>Willow</h3>
            </header>
            <VStack style={{width: '60%', paddingTop: '10rem'}} spacing={5}>
                <FormLabel>New Password</FormLabel>
                <Input type="password" onChange={(e) => { setPassword(e.target.value); }} />
                <FormLabel>Confirm Password</FormLabel>
                <Input type="password" onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (password === e.target.value) {
                        setPasswordsDontMatch(false);
                    } else { setPasswordsDontMatch(true); }
                    }}/>
                <p style={{display: passwordsDontMatch ? 'flex': 'none', color: 'red'}}>Passwords dont match</p>
                <Button style={{backgroundColor: "#03b126", color: 'white'}} isDisabled={passwordsDontMatch ? true: false} onClick={() => { changePassword(); }}>Change Password</Button>
            </VStack>
        </>
    )
 }