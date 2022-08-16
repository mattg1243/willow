import React, { useState } from "react";
import { Input, VStack, Button, Divider, FormLabel, Tooltip } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons'
import { useColorMode } from '@chakra-ui/color-mode';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { getClients } from "../actions";
import BadInputAlert from "./BadInputAlert";
import { runLogoutTimer } from "../utils";

export default function AddClientForm(props) {
    // states for input fields
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [rate, setRate] = useState(0);
    const [balanceNotifyThreshold, setBalanceNotifyThreshold] = useState('');
    const [badInput, setBadInput] = useState(false);
    const [errMsg, setErrMsg] = useState([]);

    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    const stateStr = window.sessionStorage.getItem('persist:root');
    const state = JSON.parse(stateStr);
    const token = JSON.parse(state.token);
    const user = JSON.parse(state.user);
    const dispatch = useDispatch();

    const addClient = () => {
        
        axios.post('/user/newclient', {
            fname: fname,
            lname: lname,
            email: email,
            phonenumber: phone,
            rate: rate,
            user: user.id,
            balanceNotifyThreshold
        }, 
        {
            headers: { 'Authorization': `Bearer ${token}`}
        }).then(response => {
            console.log(response); 
            props.setIsShown();
            dispatch(getClients(response.data));
            runLogoutTimer();
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
                <Tooltip 
                    label="Here you can set a balance amount that will result in the client being flagged as low balance.
                    If a value is not specified here, it will default to $0."
                        >
                    <FormLabel>Balance Warning<InfoIcon style={{color: 'grey', marginLeft: '5px'}}/></FormLabel>
                </Tooltip>
                <Input onChange={(e) => { setBalanceNotifyThreshold(e.target.value) }} />
                <Divider />
                <Button bg={isDark? "brand.dark.purple" : 'brand.green'} style={{color: 'white', marginTop: '1rem'}} onClick={() => { addClient(); }}>Save</Button>
            </VStack>
            
        </>
        
    )
}