import React, { useState } from "react";
import { Input, VStack, Stack, Button, Divider  } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function AddClientForm(props) {
    // states for input fields
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    const token = useSelector(state => state.user.token);
    const user = useSelector(state => state.user.user.id);

    const addClient = () => {
        
        axios.post('http://localhost:3000/user/newclient', {
            fname: fname,
            lname: lname,
            email: email,
            phonenumber: phone,
            user: user
        },
        {headers: {
            'content-type': 'text/json',
            'Authorization': 'Bearer ' + token}}).then(response => {
            console.log(response); props.setIsShown()
        }).catch(err => {console.error(err)})
    }

    return (
        <>
            <VStack >
                <Divider />
                    <Stack spacing={7} >
                        <Input placeholder="First Name" onChange={(e) => { setFname(e.target.value) }} />
                        <Input placeholder="Last Name" onChange={(e) => { setLname(e.target.value) }} />
                        <Input placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
                        <Input placeholder="Phone Number" onChange={(e) => { setPhone(e.target.value) }} />
                    </Stack>
                <Divider />
                <Button style={{backgroundColor: isDark? "#63326E" : '#03b126', color: 'white'}} onClick={() => { addClient(); }}>Save</Button>
            </VStack>
            
        </>
        
    )
}