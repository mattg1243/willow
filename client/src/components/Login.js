import React, { useEffect } from  "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Input, 
    Container, 
    VStack, 
    HStack, 
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormLabel,
    Alert,
    AlertIcon,
    AlertTitle,
    CloseButton,
    Spinner
 } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import axios from "axios";
import { loginAction } from "../actions";
import { runLogoutTimer } from '../utils';

export default function Login() {
    // states for text input
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [resetModalShown, setResetModalShown] = useState(false);
    const [emailReset, setEmailReset] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginUser = () => {
        // display loading spinner
        setLoading(true);
        // send login request to the server
            axios.post("/login", {
                username: username,
                password: password,
            })
            .then(response => dispatch(loginAction(response.data)))
            .then(() => runLogoutTimer())
            .then(() => navigate('/clients'))
            .catch(err => {
                if (err.response.status === 401) {
                    setMessage("Invalid login credentials");
                } else {
                    setMessage("Unknown error occured with code " + err.response.status);
                }
                setLoading(false);
            })
        } 

    window.loginUser = loginUser;

    const resetPassword = () => {
        axios.post("/user/resetpassword", {
            email: emailReset
        }).then((response) => {
            console.log(response);
            window.alert("Please check your email to reset your password")
        })
    }

    const handleKeypress = e => {
      if (e.key === 'Enter') {
        loginUser();
      }
    };

    // check if user is being redirected here due to expired token
    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        if (params.get("expired")) {
            setMessage("You have been logged out due to an expired session");
        }
    })

    return (
        <Container style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <VStack className="loginCont" >
                <h3 className="willowCursive" style={{fontSize: '7rem'}}>Willow</h3>
                <VStack style={{width: '20rem'}}>
                    <Input className="textInput" placeholder="Username" autoCapitalize="none" type="text" variant='flushed' focusBorderColor="brand.green" onChange={(e) => {setUsername(e.target.value)}}/>
                    <Input className="textInput" placeholder="Password" type="password" variant='flushed' focusBorderColor="brand.green" onChange={(e) => {setPassword(e.target.value)}} onKeyPress={(e) => handleKeypress(e)}/>
                    <Alert status='error' style={{display: message ? 'flex': 'none'}}>
                        <AlertIcon />
                        <AlertTitle mr={2}>{message}</AlertTitle>
                        <CloseButton position='absolute' right='8px' top='8px' onClick={() => { window.location.search = ''; setMessage(""); }}/>
                    </Alert>
                </VStack>
                {loading ? (
                    <Spinner color='brand.green' style={{margin: '1.9rem', padding: '1rem'}}/>
                ) : (
                    <>
                        <HStack style={{paddingTop: '1rem'}}>
                        <Button background="brand.dark.purple" color="#fff" onClick={() => { navigate('/register') }}>Register</Button>
                        <Button background="brand.green" color="#fff" onClick={(e) => { e.preventDefault(); loginUser(); }}>Login</Button>
                        </HStack>
                        <p onClick={() => {setResetModalShown(true)}} style={{textDecoration: 'underline', cursor: 'pointer', color: '#63326E'}}>Reset Password</p>
                    </>
                )}
                <Modal isOpen={resetModalShown} onClose={() => {setResetModalShown(false)}}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Reset Password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormLabel>Please enter your email:</FormLabel>
                        <Input type="email" onChange={(e) => { setEmailReset(e.target.value); }}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg='brand.dark.purple' style={{color: 'white'}} mr={3} onClick={() => { resetPassword(); }}>
                        Reset
                        </Button>
                        <Button onClick={() => {setResetModalShown(false)}}>Cancel</Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </VStack>
        </Container>
    )
}