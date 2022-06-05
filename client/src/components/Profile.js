import React, { useState } from "react";
import { 
    Input, 
    InputGroup,
    InputRightElement,
    VStack, 
    HStack, 
    Button, 
    FormLabel,
    Heading,
    Tooltip,
} from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { InfoIcon } from '@chakra-ui/icons'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../actions';
import Header from './Header';
import BadInputAlert from './BadInputAlert';
import axios from 'axios';

export default function Profile() {

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);

    const [name, setName] = useState(`${user.nameForHeader}`);
    const [street, setStreet] = useState(`${user.street}`);
    const [city, setCity] = useState(`${user.city}`);
    const [zip, setZip] = useState(`${user.zip}`);
    const [email, setEmail] = useState(`${user.email}`);
    const [state, setState] = useState(`${user.state}`);
    const [phone, setPhone] = useState(`${user.phone}`);
    const [paymentInfo, setPaymentInfo] = useState(`${user.paymentInfo ? user.paymentInfo: ""}`);
    const [badInput, setBadInput] = useState(false);
    const [errMsg, setErrMsg] = useState("Please only use alphanumeric characters");

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const updateInfo = (e) => {
        e.preventDefault();
        axios.post('/user/updateinfo', {
            user: user.id,
            nameForHeader: name,
            street: street,
            city: city,
            zip: zip,
            email: email,
            phone: phone,
            state: state,
            paymentInfo: paymentInfo,
        }, 
        {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            // valid input, go back to the dashboard
            dispatch(loginAction(response.data));
            navigate('/clients'); 
        })
        .catch(err => {
            console.error(err);
            // check for invalid characters
            if (err.response.status === 422) {
                setErrMsg(err.response.data);
                setBadInput(true);
            }
        })
    }

    return (
        <>
        <Header />
            <VStack style={{height: '100%', width: '60%'}} spacing={5}>
                <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem', paddingBottom: '2rem'}}>Profile</Heading>
                {badInput ? (
                   errMsg.map(err => (
                    <BadInputAlert errMsg={err.msg} />
                    ))) : (<></>)
                }
                <FormLabel>Name for Header</FormLabel>
                <Input type="text" value={name} onChange={(e) => { setName(e.target.value) }}/>
                <FormLabel>Street Address</FormLabel>
                <Input type="text" value={street} onChange={(e) => { setStreet(e.target.value) }}/>
                <FormLabel>City</FormLabel>
                <Input type="text" value={city} onChange={(e) => { setCity(e.target.value) }}/>
                <HStack spacing={12} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} width="100%">
                    <VStack>
                        <FormLabel>State</FormLabel>
                        <Input type="text" value={state} onChange={(e) => { setState(e.target.value) }}/>
                    </VStack>
                    <VStack>
                        <FormLabel>Zip Code</FormLabel>
                        <Input type="text" value={zip} onChange={(e) => { setZip(e.target.value) }}/>
                    </VStack>
                </HStack>
                <FormLabel>Email</FormLabel>
                <Input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }}/>
                <FormLabel>Phone Number</FormLabel>
                <Input type="text" value={phone} onChange={(e) => { setPhone(e.target.value) }}/>
                <Tooltip 
                    label="This will tell your clients how you'd like to receive payment. 
                        It will show on the bottom of statements, but is not required (limited to 80 characters)."
                        >
                    <FormLabel>Payment Info <InfoIcon style={{color: 'grey'}}/></FormLabel>
                </Tooltip>
                <InputGroup>
                    <Input type="text" value={paymentInfo} onChange={(e) => { setPaymentInfo(e.target.value) }} maxLength='80'/>
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={() => { setPaymentInfo('');  }}>
                        Clear
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <HStack spacing={12} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '3rem'}} width="100%">
                    <Button style={{backgroundColor: isDark? "#63326E" : '#03b126', color: 'white'}} onClick={(e) => { updateInfo(e); }}>Save</Button>
                    <Button style={{backgroundColor: isDark? "#EC4E20" : '#58A4B0', color: 'white'}}>Cancel</Button>
                </HStack>
            </VStack>
        </>
    )
}