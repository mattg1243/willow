import React, { useState } from 'react';
import moment from 'moment';
import { VStack, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, IconButton } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { loginAction } from '../actions';
import { useDispatch } from 'react-redux';
import { useColorMode } from '@chakra-ui/color-mode';
import { DeleteIcon } from '@chakra-ui/icons';
import Header from './Header';
import AddEventForm from './AddEventForm';
import axios from 'axios';

export default function ClientPage() {
    
    const [isShown, setIsShown] = useState(false);

    const { id } = useParams();
    const client = useSelector(state => state.user.clients.find(client => client._id === id));
    const events = useSelector(state => state.user.events.filter(event => event.clientID === id));
    const token = useSelector(state => state.user.token);
    const user = useSelector(state => state.user.user);

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();

    const deleteEvent = async (eventID) => {
        const response = await axios.post(`http://localhost:3000/client/deleteevent`,
        {
            clientID: id,
            eventID: eventID, 
            user: user.id,
            token: token,
        }).then((response) => {
            console.log(response);
            dispatch(loginAction(response.data));
        }).catch(err => console.error(err));
    }

    return (
        <>
            <Header />
            <VStack style={{height: '100%', width: '70%', paddingTop: '1rem'}}>
                <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem'}}>{client.fname + " " + client.lname}</Heading>
                <Text style={{fontFamily: '"Quicksand", sans-serif', fontSize: '1.5rem', padding: '1rem'}}>Balance: ${parseFloat(client.balance['$numberDecimal'].toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    <Table variant='striped' size='lg' style={{marginBottom: '2rem'}}>
                        <Thead>
                        <Tr>
                            <Th>Date</Th>
                            <Th>Type</Th>
                            <Th>Details</Th>
                            <Th>Time</Th>
                            <Th>Amount</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                            {events.map(event => {
                                return (
                                    <Tr key={event._id}>
                                        <Td>{moment.utc(event.date).format("MM/DD/YY")}</Td>
                                        <Td>{event.type}</Td>
                                        <Td>{event.detail ? event.detail : '-'}</Td>
                                        <Td>{event.duration ? event.duration : '-'}</Td>
                                        <Td>${parseFloat(event.amount['$numberDecimal'].toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                        <Td>
                                            <IconButton 
                                                icon={<DeleteIcon />} 
                                                size="sm" 
                                                onClick={() => { deleteEvent(event._id) }}
                                            />
                                        </Td>
                                    </Tr>
                                )}
                            )}
                        </Tbody>
                    </Table>
                    <Modal motionPreset="slideInBottom" onClose={() => {setIsShown(false)}} isOpen={isShown}>
                        <ModalOverlay />
                        <ModalContent pb={5}>
                            <ModalHeader>New Client</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                    <AddEventForm id={ id } setIsShown={ setIsShown }/>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                <Button 
                    variant="outline"
                    color="white" 
                    style={{backgroundColor: isDark? "#63326E" : '#03b126', marginBottom: '2rem'}}
                    onClick={() => {setIsShown(true)}}
                >Add Event</Button>
            </VStack>
        </>
    )
}