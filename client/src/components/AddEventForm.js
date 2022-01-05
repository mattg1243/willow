import React, { useState } from 'react';
import { 
    Input, 
    VStack, 
    HStack, 
    Button, 
    Divider,  
    Select
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useColorMode } from '@chakra-ui/color-mode';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
/*
const event = new Event({ 
        clientID: req.body.clientID, 
        date: req.body.date, 
        type: req.body.type, 
        detail: req.body.detail, 
        duration: time, 
        rate: req.body.rate, 
        amount: parseFloat(amount).toFixed(2), newBalance: 0 
    });
*/
export default function AddEventForm(props) {
    // states for input fields
    const [date, setDate] = useState(new Date());
    const [type, setType] = useState('');
    const [details, setDetails] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [rate, setRate] = useState(0);
    const [amount, setAmount] = useState(0);

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <>
            <VStack justifyContent='center'>  
                <DatePicker/>
                <Select placeholder="Event Type" onChange={(e) => { setType(e.target.value) }}>
                    <option value='Meeting'>Meeting</option>
                    <option value='Email'>Email</option>
                    <option value='Phone Call'>Phone Call</option>
                    <option value='Refund'>Refund</option>
                    <option value='Retainer'>Meeting</option>
                    <option value='Other'>Other</option>
                </Select>
                <Input placeholder="Details" onChange={(e) => { setDetails(e.target.value) }}/>
                <p>Time</p>
                <HStack spacing={10}>
                    <Select placeholder="Hours" onChange={(e) => { setHours(e.target.value) }}>
                        <option value='0'>0</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                        <option value='7'>7</option>
                        <option value='8'>8</option>
                        <option value='9'>9</option>
                    </Select>
                    <Select placeholder="Minutes" onChange={(e) => { setMinutes(e.target.value) }}>
                        <option value='0'>0</option>
                        <option value='0.1'>1-6 mins</option>
                        <option value='0.2'>7-12 mins</option>
                        <option value='0.3'>13-18 mins</option>
                        <option value='0.4'>19-24 mins</option>
                        <option value='0.5'>25-30 mins</option>
                        <option value='0.6'>31-36 mins</option>
                        <option value='0.7'>37-42 mins</option>
                        <option value='0.8'>43-48 mins</option>
                        <option value='0.9'>49-54 mins</option>
                    </Select>
                </HStack>
                <Input type="number" placeholder="Rate" onChange={(e) =>{ setRate(e.target.value) }}/>
                <Input type="number" placeholder="Amount" onChange={(e) =>{ setAmount(e.target.value) }}/>
                <Divider />
                <Button 
                    variant="outline"
                    color="white" 
                    style={{backgroundColor: isDark? "#63326E" : '#03b126', marginTop: '1rem'}}
                >Save</Button>
            </VStack>
        </>
    )
}