import React, { useState } from "react";
import { 
    Input, 
    VStack, 
    HStack, 
    Button, 
    Divider, 
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
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../actions';
import axios from 'axios';

export default function EditClientsDialog(props) {

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [deleteIsShown, setDeleteIsShown] = useState(false);

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const deleteClient = async () => {
        const response = await axios.post('/user/deleteclient', {
            token: props.token,
            user: props.user,
            clientID: props.client._id,
        })
        .then(response => {console.log(response); dispatch(loginAction(response.data));} )
        .catch(err => {console.error(err);})
    }

    return (
        <VStack>
            <FormLabel>First Name</FormLabel>
            <Input type="text" onChange={(e) => { setFname(e.target.value); }} placeholder={props.client.fname}/>
            <FormLabel>Last Name</FormLabel>
            <Input type="text" onChange={(e) => { setLname(e.target.value); }} placeholder={props.client.lname}/>
            <FormLabel>Email</FormLabel>
            <Input type="email" onChange={(e) => { setEmail(e.target.value); }} placeholder={props.client.email}/>
            <FormLabel>Phone</FormLabel>
            <Input type="tel" onChange={(e) => { setPhone(e.target.value); }} placeholder={props.client.phonenumber}/>
            <HStack style={{paddingTop: '2rem'}} spacing={10}>
                <Button style={{backgroundColor: isDark? "#63326E" : '#03b126', color: 'white'}}>Save</Button>
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