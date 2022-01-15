import React, { useEffect, useState } from 'react';
import { 
    Input, 
    VStack, 
    HStack, 
    Button, 
    Divider,  
    Select,
    FormLabel
} from '@chakra-ui/react';
import moment from 'moment';
import { useColorMode } from '@chakra-ui/color-mode';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginAction } from '../actions';

export default function AddEventForm(props) {
    // states for input fields
    const [date, setDate] = useState(props.event ? moment.utc(props.event.date).format("YYYY-MM-DD"): moment.utc(new Date()).format("YYYY-MM-DD"));
    const [type, setType] = useState(props.event ? props.event.type: '');
    const [details, setDetails] = useState(props.event ? props.event.detail : '');
    const [hours, setHours] = useState(props.event ? (props.event.duration + "").split(".")[0]: 0);
    const [minutes, setMinutes] = useState(
        // if form is being opened in update mode, check if the duration has a decimal value in very hacky fashion
        props.event ? props.event.duration % 1 != 0 ? 
        "0." + (props.event.duration + "").split(".")[1] : 
        "0.0" : 
        0);
    const [rate, setRate] = useState(props.event ? props.event.rate.toString() : 0);
    const [amount, setAmount] = useState(props.event ? props.event.amount['$numberDecimal'].toString() : 0);
    // save event if this component is being used to update and existing event
    const eventID = props.event ? props.event._id : null;

    const stateStr = window.sessionStorage.getItem('persist:root');
    const state = JSON.parse(stateStr);
    const token = JSON.parse(state.token);
    const user = JSON.parse(state.user);
    const dispatch = useDispatch();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    useEffect(() => {
        console.log('Hours: ' + typeof hours + '\nMinutes : ' + typeof minutes + '\nRate: ' + typeof rate + '\n');
    })

    const saveEvent = () => {
        axios.post(`/client/${props.id}/addevent`,
        {
            clientID: props.id,
            date: date,
            type: type,
            detail: details,
            hours: parseFloat(hours),
            minutes: parseFloat(minutes),
            rate: parseFloat(rate),
            amount: parseFloat(amount).toFixed(2), 
            newBalance: 0,
            user: user.id,
            token: token,
        }).then(response => {
            console.log(response); 
            dispatch(loginAction(response.data));
            props.setIsShown(false);
        }).catch(err => {
            console.error(err)
        })
    }

    const updateEvent = () => {
        axios.post(`/client/event/${eventID}`, 
        {
            date: date,
            type: type,
            detail: details,
            hours: parseFloat(hours),
            minutes: parseFloat(minutes),
            rate: parseFloat(rate),
            amount: parseFloat(amount).toFixed(2),
            newBalance: 0,
            user: user.id,
            token: token,
        }).then(response => {
            console.log(response); 
            dispatch(loginAction(response.data));
            props.setIsShown(false);
        }).catch(err => {
            console.error(err)
        })
    }

    return (
        <>
            <VStack justifyContent='center'>  
                <FormLabel>Date</FormLabel>
                <Input type='date' onChange={(e) => { setDate(e.target.value) }} value={date}/>
                <FormLabel>Event Type</FormLabel>
                <Select onChange={(e) => { setType(e.target.value) }} value={type}>
                    <option value=''>...</option>
                    <option value='Meeting'>Meeting</option>
                    <option value='Email'>Email</option>
                    <option value='Phone Call'>Phone Call</option>
                    <option value='Refund'>Refund</option>
                    <option value='Retainer'>Retainer</option>
                    <option value='Other'>Other</option>
                </Select>
                <FormLabel>Details</FormLabel>
                <Input placeholder="Details" onChange={(e) => { setDetails(e.target.value) }} value={details}/>
                <HStack spacing={10} style={{display: type === 'Retainer' || type === 'Refund' ? 'none': 'flex'}}>
                <VStack>
                    <FormLabel style={{display: type === 'Retainer' || type === 'Refund' ? 'none': 'flex'}}>Time</FormLabel>
                    <HStack spacing={10}>
                        <Select placeholder="Hours" onChange={(e) => { setHours(e.target.value) }} defaultValue={hours}>
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
                        <Select placeholder="Minutes" onChange={(e) => { setMinutes(e.target.value) }} defaultValue={isNaN(parseFloat(minutes)) ? '0.0' : minutes}>
                            <option value='0.0'>0</option>
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
                </VStack>
                </HStack>
                <FormLabel style={{display: type === 'Retainer' || type === 'Refund' ? 'none': 'flex'}}>Hourly Rate</FormLabel>
                <Input type="number" placeholder={rate} style={{display: type === 'Retainer' || type === 'Refund' ? 'none': 'flex'}} onChange={(e) =>{ setRate(e.target.value) }}/>
                <FormLabel style={{display: type === 'Retainer' || type === 'Refund' ? 'flex': 'none'}}>$ Amount</FormLabel>
                <Input type="number" placeholder={amount} style={{display: type === 'Retainer' || type === 'Refund' ? 'flex': 'none'}} onChange={(e) =>{ setAmount(e.target.value) }}/>
                <Divider style={{paddingTop: '2rem'}} />
                {props.event ? (
                    <Button 
                    variant="outline"
                    color="white" 
                    style={{backgroundColor: isDark? "#63326E" : '#03b126', marginTop: '1rem'}}
                    onClick={() => { updateEvent(); props.setIsShown(false)}}
                    >Update</Button>
                ):(
                    <Button 
                    variant="outline"
                    color="white" 
                    style={{backgroundColor: isDark? "#63326E" : '#03b126', marginTop: '1rem'}}
                    onClick={() => { saveEvent(); }}
                    >Save</Button>
                )}
            </VStack>
        </>
    )
}