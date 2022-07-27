import React, { useState } from "react";
import { 
    Input, 
    InputGroup,
    Divider,
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
import { runLogoutTimer } from "../utils";
import Header from './Header';
import PaymentInfoInput from "./PaymentInfoInput";
import BadInputAlert from './BadInputAlert';
import axios from 'axios';

export default function Profile(props) {

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);

    const [name, setName] = useState(`${user.nameForHeader}`);
    const [street, setStreet] = useState(`${user.street}`);
    const [city, setCity] = useState(`${user.city}`);
    const [zip, setZip] = useState(`${user.zip}`);
    const [email, setEmail] = useState(`${user.email}`);
    const [state, setState] = useState(`${user.state}`);
    const [phone, setPhone] = useState(`${user.phone}`);
    const [checkField, setCheckField] = useState(`${user.paymentInfo.check ? user.paymentInfo.check: "Not yet specified"}`)
    const [venmoField, setVenmoField] = useState(`${user.paymentInfo.venmo ? user.paymentInfo.venmo: "Not yet specified"}`)
    const [paypalField, setPaypalField] = useState(`${user.paymentInfo.paypal ? user.paymentInfo.paypal: "Not yet specified"}`)
    const [zelleField, setZelleField] = useState(`${user.paymentInfo.zelle ? user.paymentInfo.zelle: "Not yet specified"}`)
    const [badInput, setBadInput] = useState(false);
    const [errMsg, setErrMsg] = useState("Please only use alphanumeric characters");

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { breakpoints, currentBreakpoint } = props;
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
            paymentInfo: JSON.stringify({
                check: checkField,
                venmo: venmoField,
                paypal: paypalField,
                zelle: zelleField
            }),
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
            runLogoutTimer();
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
            <VStack style={{height: '100%', maxWidth: '650px', padding: '2rem'}} spacing={5}>
                <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem', paddingBottom: '2rem'}}>Profile</Heading>
                {badInput ? (
                   errMsg.map(err => (
                    <BadInputAlert errMsg={err.msg} />
                    ))) : (<></>)
                }
                <FormLabel>Name for Header</FormLabel>
                <InputGroup>
                    <Input type="text" value={name} onChange={(e) => { setName(e.target.value) }}/>
                </InputGroup>
                <FormLabel>Street Address</FormLabel>
                <InputGroup>
                    <Input type="text" value={street} onChange={(e) => { setStreet(e.target.value) }}/>
                </InputGroup> 
                <FormLabel>City</FormLabel>
                <InputGroup>
                    <Input type="text" value={city} onChange={(e) => { setCity(e.target.value) }}/>
                </InputGroup>
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
                <InputGroup>
                    <Input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }}/>
                </InputGroup>
                <FormLabel>Phone Number</FormLabel>
                <InputGroup>
                    <Input type="text" value={phone} onChange={(e) => { setPhone(e.target.value) }}/>
                </InputGroup>
                <Divider />
                <Tooltip 
                    label="This will tell your clients how you'd like to receive payment. 
                        It will show on the bottom of statements, but is not required (limited to 80 characters)."
                        >
                    <FormLabel>Payment Info <InfoIcon style={{color: 'grey'}}/></FormLabel>
                </Tooltip>
                {/* payment info fields */}
                <PaymentInfoInput fieldLabel="Check" stateName={checkField} stateSetter={setCheckField} />
                <PaymentInfoInput fieldLabel="Venmo" stateName={venmoField} stateSetter={setVenmoField} />
                <PaymentInfoInput fieldLabel="PayPal" stateName={paypalField} stateSetter={setPaypalField} />
                <PaymentInfoInput fieldLabel="Zelle  " stateName={zelleField} stateSetter={setZelleField} />
                {/* buttons */}
                <HStack spacing={12} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '3rem'}} width="100%">
                    <Button bg={isDark? "brand.dark.purple" : 'brand.green'} color='white' onClick={(e) => { updateInfo(e); }}>Save</Button>
                    <Button bg={isDark? "brand.dark.red" : 'brand.grey'} color='white' >Cancel</Button>
                </HStack>
            </VStack>
        </>
    )
}