import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Input, Container, VStack, HStack, Button } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import axios from "axios"
import { loginAction } from "../actions"

export default function Login() {
    // states for text input
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginUser = async () => {
        axios.post("/login", {
            username: username,
            password: password,
        }).then((response) => {
            if (response.data) {
                dispatch(loginAction(response.data))
                navigate('/clients');
            } else {
                return <h1>err</h1>
            }
        }).catch(err => {console.log(err.response)})
    }
    window.loginUser = loginUser;

    return (
        <Container style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <VStack className="loginCont" >
                <h3 className="willowCursive" style={{fontSize: '7rem'}}>Willow</h3>
                <VStack style={{width: '20rem'}}>
                    <Input className="textInput" placeholder="Username" type="text" variant='flushed' focusBorderColor="#03b126" onChange={(e) => {setUsername(e.target.value)}}/>
                    <Input className="textInput" placeholder="Password" type="password" variant='flushed' focusBorderColor="#03b126" onChange={(e) => {setPassword(e.target.value)}}/>
                </VStack>
                <HStack>
                    <Button background="#03b126" color="#fff" onClick={() => {loginUser()}}>Login</Button>
                    <Button background="#63326E" color="#fff" onClick={() => { navigate('/register') }}>Register</Button>
                </HStack>
            </VStack>
        </Container>
    )
}