import { React, useState } from 'react';
import { VStack, HStack, Stack, Input, InputGroup, Button, Tooltip, Box, Divider } from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { axios } from 'axios';
import loginUser from './Login';

export default function Register() {
    // states for text fields
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nameForHeader, setNameForHeader] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

    const registerUser = () => {
        const configObject ={
            method: "POST",
            url: "http://localhost:3000/register/newuser",
            data: { fname: fname, lname: lname, email: email, username: username,
                    password: password, nameForHeader: nameForHeader, phone: phone,
                    street: street, city: city, state: state, zip: zip, },
        }
        axios(configObject).then((response) => { console.log(response); window.loginUser(username, password); });
    }

    return (
        <>
            <VStack style={{padding: '3rem', justifyContent: 'center'}}>
                <Box maxW='xl' maxH='lg'>
                    <Stack direction={'column'} spacing={5}>
                        <h3>User Info</h3>
                        <InputGroup>
                            <Input className="textInput" placeholder="Email" type="email" size='lg' focusBorderColor="#03b126" />
                            <Input className="textInput" placeholder="Password" type="password" size='lg' focusBorderColor="#03b126" />
                        </InputGroup>
                        <InputGroup>
                            <Input className="textInput" placeholder="First Name" type="email" size='lg' focusBorderColor="#03b126" />
                            <Input className="textInput" placeholder="Last Name" type="email" size='lg' focusBorderColor="#03b126" />
                        </InputGroup>
                        <Divider orientation="horizontal"/>
                        <HStack style={{justifyContent: 'center'}}>
                            <h3>Info for Statement Header</h3>
                                <Tooltip label="This information will be included in the header of all statements.
                                If you would like your name to appear with a title or as anything else than provided in the previous form,
                                enter it here.">
                                    <QuestionIcon/>
                                </Tooltip> 
                        </HStack>
                        <Input className="textInput" placeholder="Name to appear on statements" type="email" size='lg' focusBorderColor="#03b126" />
                        <Input className="textInput" placeholder="Phone Number" type="text" size='lg' focusBorderColor="#03b126" />
                        <InputGroup>
                            <Input className="textInput" placeholder="Street" type="text" size='lg' focusBorderColor="#03b126" />
                            <Input className="textInput" placeholder="City" type="text" size='lg' focusBorderColor="#03b126" />
                        </InputGroup>
                        <InputGroup>
                            <Input className="textInput" placeholder="State" type="text" size='lg' focusBorderColor="#03b126" />
                            <Input className="textInput" placeholder="Zip" type="number" size='lg' focusBorderColor="#03b126" />
                        </InputGroup>
                        <Button background="#03b126" color="#fff" onClick={() => { registerUser(); }}>Sign Up</Button>
                    </Stack>
                </Box>
            </VStack>
        </>
    )
}