import React, { useState } from "react";
import { 
    Input, 
    VStack, 
    HStack, 
    Button, 
    FormLabel,
    Modal, 
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Switch
} from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction, getClients } from '../actions';
import { runLogoutTimer } from "../utils";
import BadInputAlert from "./BadInputAlert";
import axios from 'axios';

export default function EditClientsDialog(props) {

    const [fname, setFname] = useState(`${props.client.fname}`);
    const [lname, setLname] = useState(`${props.client.lname}`);
    const [email, setEmail] = useState(`${props.client.email}`);
    const [phone, setPhone] = useState(`${props.client.phonenumber}`);
    const [archived, setArchived] = useState(props.client.isArchived)
    const [balanceNotifyThreshold, setBalanceNotifyThreshold] = useState(`${props.client.balanceNotifyThreshold}`);
    const [rate, setRate] = useState(props.client.rate ? `${props.client.rate}` : null);
    const [deleteIsShown, setDeleteIsShown] = useState(false);
    const [badInput, setBadInput] = useState(false);
    const [errMsg, setErrMsg] = useState([]);

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector(state => state.token)

    const deleteClient = () => {
        axios.post('/user/deleteclient', {
            user: props.user,
            clientID: props.client._id,
        }, 
        {
            headers: { 'Authorization': `Bearer ${token}`}
        }).then(response => {
            console.log(response); 
            dispatch(loginAction(response.data));
            runLogoutTimer();
            props.setEditIsShown(false);
        })
        .catch(err => {
            if (err.response.status === 422) {
                setErrMsg(err.response.data);
                setBadInput(true);
            } 
            else {
                console.error(err);
            }
        })
    }

    const updateClient = () => {
        axios.post('/user/updateclient', {
            user: props.user,
            clientID: props.client._id,
            fname: fname,
            lname: lname,
            email: email,
            phonenumber: phone,
            rate: parseInt(rate),
            isArchived: archived,
            balanceNotifyThreshold
        }, 
        {
            headers: { 'Authorization': `Bearer ${token}`}
        })
        .then((response) => {
            dispatch(getClients(response.data));
            runLogoutTimer();
            props.setEditIsShown(false);
        })
        .catch(err => {
            if (err.response.status === 422) {
                setErrMsg(err.response.data);
                setBadInput(true);
            } 
            else {
                console.error(err);
            }
        })
    }

    return (
        <VStack>
            {badInput ? (
                errMsg.map(err => {
                    return <BadInputAlert errMsg={err.msg} />
                })
            ) : null}
            <FormLabel>First Name</FormLabel>
            <Input type="text" isDisabled={props.client.isArchived} onChange={(e) => { setFname(e.target.value); }} value={fname}/>
            <FormLabel>Last Name</FormLabel>
            <Input type="text" isDisabled={props.client.isArchived} onChange={(e) => { setLname(e.target.value); }} value={lname}/>
            <FormLabel>Email</FormLabel>
            <Input type="email" isDisabled={props.client.isArchived} onChange={(e) => { setEmail(e.target.value); }} value={email}/>
            <FormLabel>Phone</FormLabel>
            <Input type="tel" isDisabled={props.client.isArchived} onChange={(e) => { setPhone(e.target.value); }} value={phone}/>
            <FormLabel>Billing Rate</FormLabel>
            <Input type="number" isDisabled={props.client.isArchived} onChange={(e) => { setRate(e.target.value); }} value={rate}/>
            <FormLabel>Balance Warning</FormLabel>
            <Input type="number" isDisabled={props.client.isArchived} onChange={(e) => { setBalanceNotifyThreshold(e.target.value); }} value={balanceNotifyThreshold}/>
            <FormLabel>Closed</FormLabel>
            {/* need to match the colorScheme for this switch w Willow Green */}
            <Switch size="lg" defaultChecked={archived} onChange={() => { setArchived(archived ? false: true); }}/>
            <HStack style={{paddingTop: '2rem'}} spacing={10}>
                <Button bg={isDark? 'brand.dark.purple': 'brand.green'} style={{ color: 'white'}} onClick={() => { updateClient(); }}>Save</Button>
                <Button style={{backgroundColor: 'red', color: 'white'}} onClick={() => { setDeleteIsShown(true); }}>Delete</Button>
            </HStack>
            <Modal onClose={() => {setDeleteIsShown(false)}} isOpen={deleteIsShown}>
                <ModalOverlay />
                <ModalContent pb={5}>
                    <ModalHeader>Delete Event</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem'}}>
                            <h3 style={{fontSize: '1.25em'}}>Are you sure you want to delete this client and all their events?</h3>
                            <p style={{color: 'red', paddingTop: '1.5rem'}}>This cannot be undone</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => { deleteClient(); setDeleteIsShown(false); navigate('/clients'); }}>Delete</Button>
                        <Button variant='ghost' onClick={() => { setDeleteIsShown(false); }}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    )
}