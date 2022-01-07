import React, { useState } from "react";
import { Input, VStack, Stack, Button, Divider  } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { getClients } from "../actions";

export default function AddClientForm(props) {
    // states for input fields
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    const stateStr = window.sessionStorage.getItem('persist:root');
    const state = JSON.parse(stateStr);
    const token = JSON.parse(state.token);
    const user = JSON.parse(state.user);
    const dispatch = useDispatch();

    const addClient = async () => {
        
        const response = await axios.post('http://localhost:3000/user/newclient', {
            fname: fname,
            lname: lname,
            email: email,
            phonenumber: phone,
            user: user.id,
            token: token,
        }).then(response => {
            console.log(response); 
            props.setIsShown();
            dispatch(getClients(response.data));
            setInterval(() => {window.location.reload();}, 100)
        }).catch(err => 
            {console.error(err)
        })
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