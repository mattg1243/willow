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
    ModalCloseButton
} from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction, getClients } from '../actions';
import axios from 'axios';

export default function EditClientsDialog(props) {

    const [fname, setFname] = useState(`${props.client.fname}`);
    const [lname, setLname] = useState(`${props.client.lname}`);
    const [email, setEmail] = useState(`${props.client.email}`);
    const [phone, setPhone] = useState(`${props.client.phonenumber}`);
    const [deleteIsShown, setDeleteIsShown] = useState(false);

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const deleteClient = () => {
        axios.post('/user/deleteclient', {
            token: props.token,
            user: props.user,
            clientID: props.client._id,
        })
        .then(response => {console.log(response); dispatch(loginAction(response.data));} )
        .catch(err => {console.error(err);})
    }

    const updateClient = () => {
        axios.post('/user/updateclient', {
            token: props.token,
            user: props.user,
            clientID: props.client._id,
            fname: fname,
            lname: lname,
            email: email,
            phone: phone,
        })
        .then(response => {console.log("Res data: \n: " + response); dispatch(getClients(response.data));} )
        .catch(err => {console.error(err);})
    }

    return (
        <VStack>
            <FormLabel>First Name</FormLabel>
            <Input type="text" onChange={(e) => { setFname(e.target.value); }} value={props.client.fname}/>
            <FormLabel>Last Name</FormLabel>
            <Input type="text" onChange={(e) => { setLname(e.target.value); }} value={props.client.lname}/>
            <FormLabel>Email</FormLabel>
            <Input type="email" onChange={(e) => { setEmail(e.target.value); }} value={props.client.email}/>
            <FormLabel>Phone</FormLabel>
            <Input type="tel" onChange={(e) => { setPhone(e.target.value); }} value={props.client.phonenumber}/>
            <HStack style={{paddingTop: '2rem'}} spacing={10}>
                <Button style={{backgroundColor: isDark? "#63326E" : '#03b126', color: 'white'}} onClick={() => { updateClient(); props.setEditIsShown(false); }}>Save</Button>
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