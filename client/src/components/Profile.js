import React, { useState } from "react";
import { 
    Input, 
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
import { loginAction, getClients } from '../actions';
import Header from './Header';
import axios from 'axios';

export default function Profile() {

    const user = useSelector(state => state.user);

    const [name, setName] = useState(`${user.nameForHeader}`);
    const [street, setStreet] = useState(`${user.street}`);
    const [city, setCity] = useState(`${user.city}`);
    const [zip, setZip] = useState(`${user.zip}`);
    const [state, setState] = useState(`${user.state}`);
    const [phone, setPhone] = useState(`${user.phone}`)
    const [paymentInfo, setPaymentInfo] = useState(`${user.paymentInfo}`)

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const updateInfo = () => {
        axios.post('/user/updateinfo', {
            user: user.id,
            nameForHeader: name,
            street: street,
            city: city,
            zip: zip,
            phone: phone,
            state: state,
            paymentInfo: paymentInfo,
        })
        .then(response => {console.log(response); dispatch(loginAction(response.data)); } )
        .catch(err => {console.error(err);})
    }

    return (
        <>
        <Header />
            <VStack style={{height: '100%', width: '60%'}} spacing={5}>
                <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem', paddingBottom: '2rem'}}>Profile</Heading>
                <FormLabel>Name for Header</FormLabel>
                <Input type="text" placeholder={user.nameForHeader} onChange={(e) => { setName(e.target.value) }}/>
                <FormLabel>Street Address</FormLabel>
                <Input type="text" placeholder={user.street} onChange={(e) => { setStreet(e.target.value) }}/>
                <FormLabel>City</FormLabel>
                <Input type="text" placeholder={user.city} onChange={(e) => { setCity(e.target.value) }}/>
                <HStack spacing={12} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} width="100%">
                    <VStack>
                        <FormLabel>State</FormLabel>
                        <Input type="text" placeholder={user.state} onChange={(e) => { setState(e.target.value) }}/>
                    </VStack>
                    <VStack>
                        <FormLabel>Zip Code</FormLabel>
                        <Input type="text" placeholder={user.zip} onChange={(e) => { setZip(e.target.value) }}/>
                    </VStack>
                </HStack>
                <FormLabel>Phone Number</FormLabel>
                <Input type="text" placeholder={user.phone} onChange={(e) => { setPhone(e.target.value) }}/>
                <Tooltip label="This will tell your clients how you'd like to receive payment. It will show on the bottom of statements, but is not required.">
                    <FormLabel>Payment Info <InfoIcon style={{color: 'grey'}}/></FormLabel>
                </Tooltip>
                <Input type="text" placeholder={user.paymentInfo ? user.paymentInfo: null} onChange={(e) => { setPaymentInfo(e.target.value) }}/>
                <HStack spacing={12} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '3rem'}} width="100%">
                    <Button style={{backgroundColor: isDark? "#63326E" : '#03b126', color: 'white'}} onClick={() => { updateInfo(); navigate('/clients'); }}>Save</Button>
                    <Button style={{backgroundColor: isDark? "#EC4E20" : '#58A4B0', color: 'white'}}>Cancel</Button>
                </HStack>
            </VStack>
        </>
    )
}