import React, { useState } from "react";
import { Input, VStack, Button, Divider, FormLabel } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { getClients } from "../actions";
import BadInputAlert from "./BadInputAlert";

export default function AddClientForm(props) {
    // states for input fields
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [rate, setRate] = useState(0);
    const [badInput, setBadInput] = useState(false);
    const [errMsg, setErrMsg] = useState([]);

    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    const stateStr = window.sessionStorage.getItem('persist:root');
    const state = JSON.parse(stateStr);
    const token = JSON.parse(state.token);
    const user = JSON.parse(state.user);
    const dispatch = useDispatch();

    const addClient = async () => {
        
        await axios.post('/user/newclient', {
            fname: fname,
            lname: lname,
            email: email,
            phonenumber: phone,
            rate: rate,
            user: user.id,
            token: token,
        }).then(response => {
            console.log(response); 
            props.setIsShown();
            dispatch(getClients(response.data));
            setInterval(() => {window.location.reload();}, 2000)
        }).catch(err => {
                if (err.response.status === 422) {
                    console.log(err.response)
                    setErrMsg(err.response.data)
                    setBadInput(true);
                }
            }
        )
    }

    return (
        <>
            <VStack >
                {badInput ? (
                    errMsg.map(err => {
                        return <BadInputAlert errMsg={err.msg} />
                    })
                ) : null}
                <FormLabel>First Name</FormLabel>
                <Input onChange={(e) => { setFname(e.target.value) }} />
                <FormLabel>Last Name</FormLabel>
                <Input onChange={(e) => { setLname(e.target.value) }} />
                <FormLabel>Email</FormLabel>
                <Input onChange={(e) => { setEmail(e.target.value) }} />
                <FormLabel>Phone Number</FormLabel>
                <Input onChange={(e) => { setPhone(e.target.value) }} />
                <FormLabel>Billing Rate</FormLabel>
                <Input onChange={(e) => { setRate(e.target.value) }} />
                <Divider />
                <Button style={{backgroundColor: isDark? "#63326E" : '#03b126', color: 'white', marginTop: '1rem'}} onClick={() => { addClient(); }}>Save</Button>
            </VStack>
            
        </>
        
    )
}