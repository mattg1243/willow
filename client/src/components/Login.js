import React from "react";
import { useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom'
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

const loginUser = async (username, password) => {
    const configObject = {
        method: "POST",
        url: "http://localhost:8080/login",
        data: { username: username, password: password },
    };
    const response = await axios(configObject).catch(err => {console.error(err);})
    console.log(response.data)
    if (response.data) {
        dispatch(loginAction(response.data));
        navigate('/dashboard');
    } else {
        return <h1>err</h1>
    }
}

return (
    <Container className="loginCont">
        <VStack style={{height: '50%', marginTop: '20%', padding: '1rem'}}>
            <h3 className="willowCursive">Willow</h3>
            <Input placeholder="Email" type="email" variant='flushed' focusBorderColor="#03b126" onChange={(e) => {setUsername(e.target.value)}}/>
            <Input placeholder="Password" type="password" variant='flushed' focusBorderColor="#03b126" onChange={(e) => {setPassword(e.target.value)}}/>
            <HStack>
                <Button background="#03b126" color="#fff" onClick={() => {loginUser(username, password)}}>Login</Button>
                <Button background="#63326E" color="#fff">Register</Button>
            </HStack>
        </VStack>
    </Container>
)

}