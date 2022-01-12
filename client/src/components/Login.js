import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
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
 } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import axios from "axios"
import { loginAction } from "../actions"

export default function Login() {
    // states for text input
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [resetModalShown, setResetModalShown] = useState(false);
    const [emailReset, setEmailReset] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkStorage = () => {
        if(window.sessionStorage.getItem('persist:root') != null) {
            navigate('/clients')
        }
    }

    const loginUser = async () => {
        axios.post("/login", {
            username: username,
            password: password,
        })
        .then((response) => {
            if (response.data) {
                dispatch(loginAction(response.data))
                setTimeout(checkStorage, 1000)
            } else {
                return <h1>err</h1>
            }
        })
        .catch(err => {console.log(err.response)})
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

    return (
        <Container style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <VStack className="loginCont" >
                <h3 className="willowCursive" style={{fontSize: '7rem'}}>Willow</h3>
                <VStack style={{width: '20rem'}}>
                    <Input className="textInput" placeholder="Username" type="text" variant='flushed' focusBorderColor="#03b126" onChange={(e) => {setUsername(e.target.value)}}/>
                    <Input className="textInput" placeholder="Password" type="password" variant='flushed' focusBorderColor="#03b126" onChange={(e) => {setPassword(e.target.value)}}/>
                </VStack>
                <HStack style={{paddingTop: '1rem'}}>
                    <Button background="#03b126" color="#fff" onClick={() => {loginUser()}}>Login</Button>
                    <Button background="#63326E" color="#fff" onClick={() => { navigate('/register') }}>Register</Button>
                </HStack>
                <p onClick={() => {setResetModalShown(true)}} style={{textDecoration: 'underline', cursor: 'pointer', color: '#63326E'}}>Reset Password</p>
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
                        <Button style={{backgroundColor: "#63326E", color: 'white'}} mr={3} onClick={() => { resetPassword(); }}>
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