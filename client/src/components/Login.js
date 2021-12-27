import React from "react";
import { useState } from "react";
import { Input, InputGroup, Container, VStack, HStack, Button, Box } from '@chakra-ui/react';


export default function Login() {
// states for text input
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

return (
    <Container className="loginCont">
        <VStack style={{height: '50%', marginTop: '20%', padding: '1rem'}}>
            <h3 className="willowCursive">Willow</h3>
            <Input placeholder="Email" type="email" variant='flushed' focusBorderColor="#03b126" onChange={(e) => {setEmail(e.target.value)}}/>
            <Input placeholder="Password" type="password" variant='flushed' focusBorderColor="#03b126" onChange={(e) => {setPassword(e.target.value)}}/>
            <HStack>
                <Button background="#03b126" color="#fff">Login</Button>
                <Button background="#63326E" color="#fff">Register</Button>
            </HStack>
        </VStack>
    </Container>
)

}