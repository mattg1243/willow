import React, { useState } from 'react';
import moment from 'moment';
import { VStack, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, IconButton, ModalFooter } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { withBreakpoints } from 'react-breakpoints'
import { loginAction } from '../actions';
import { useDispatch } from 'react-redux';
import { useColorMode } from '@chakra-ui/color-mode';
import { DeleteIcon } from '@chakra-ui/icons';
import Header from './Header';
import AddEventForm from './AddEventForm';
import axios from 'axios';

function ClientPage(props) {
    
    const [addIsShown, setAddIsShown] = useState(false);
    const [deleteIsShown, setDeleteIsShown] = useState(false);
    const [toDelete, setToDelete] = useState('');

    const { id } = useParams();
    const { breakpoints, currentBreakpoint } = props
    
    const stateStr = window.sessionStorage.getItem('persist:root');
    const state = JSON.parse(stateStr);
    const token = JSON.parse(state.token);
    const user = JSON.parse(state.user);
    const clients = JSON.parse(state.clients);
    const client = clients.find(client => client._id === id);
    const allEvents = JSON.parse(state.events);
    const events = allEvents.filter(event => event.clientID === id);

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const dispatch = useDispatch();

    const deleteEvent = async (eventID) => {
        const response = await axios.post(`/client/deleteevent`,
        {
            clientID: id,
            eventID: eventID, 
            user: user.id,
            token: token,
        }).then((response) => {
            console.log(response);
            dispatch(loginAction(response.data));
            setTimeout(() => {window.location.reload();}, 10);
        }).catch(err => console.error(err));
    }

    return (
        <>
            <Header />
            <VStack style={{height: '100%', width: '100%', paddingTop: '1rem', flexWrap: 'wrap'}}>
                <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem'}}>{client.fname + " " + client.lname}</Heading>
                <Text style={{fontFamily: '"Quicksand", sans-serif', fontSize: '1.5rem', padding: '1rem'}}>Balance: ${parseFloat(client.balance['$numberDecimal'].toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                    <Table variant='striped' size='lg' style={{marginBottom: '2rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding:'2rem'}} >
                        <Thead>
                        <Tr align='justify'>
                            <Th>Date</Th>
                            <Th>Type</Th>
                            {breakpoints[currentBreakpoint] > breakpoints.desktop ? (<><Th>Details</Th>
                            <Th>Time</Th></>): null}
                            
                            <Th>Amount</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                            {events.map(event => {
                                return (
                                    <Tr key={event._id} style={{textAlign: 'justify'}}>
                                        <Td>{moment.utc(event.date).format("MM/DD/YY")}</Td>
                                        <Td>{event.type}</Td>
                                        {breakpoints[currentBreakpoint] > breakpoints.desktop ? (
                                        <>
                                        <Td>{event.detail ? event.detail : '-'}</Td>
                                        <Td>{event.duration ? event.duration : '-'}</Td>
                                        </>): null}
                                        <Td>${parseFloat(event.amount['$numberDecimal'].toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                        {breakpoints[currentBreakpoint] > breakpoints.desktop ? (
                                        <Td>
                                            <IconButton 
                                                icon={<DeleteIcon />} 
                                                size="sm" 
                                                onClick={() => { setDeleteIsShown(true); setToDelete(event._id) }}
                                            />
                                        </Td>): null}
                                        
                                    </Tr>
                                )}
                            )}
                        </Tbody>
                    </Table>
                    <Modal motionPreset="slideInBottom" onClose={() => {setAddIsShown(false)}} isOpen={addIsShown}>
                        <ModalOverlay />
                        <ModalContent pb={5}>
                            <ModalHeader>New Client</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                    <AddEventForm id={ id } setIsShown={ setAddIsShown }/>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    <Modal onClose={() => {setDeleteIsShown(false)}} isOpen={deleteIsShown}>
                        <ModalOverlay />
                        <ModalContent pb={5}>
                            <ModalHeader>Delete Event</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem'}}>
                                    <h3 style={{fontSize: '1.25em'}}>Are you sure you want to delete this event?</h3>
                                    <p style={{color: 'red'}}>This cannot be undone</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme='red' mr={3} onClick={() => { deleteEvent(toDelete); setDeleteIsShown(false) }}>Delete</Button>
                                <Button variant='ghost' onClick={() => { setDeleteIsShown(false); }}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                <Button 
                    variant="outline"
                    color="white" 
                    style={{backgroundColor: isDark? "#63326E" : '#03b126', marginBottom: '2rem'}}
                    onClick={() => {setAddIsShown(true)}}
                >Add Event</Button>
            </VStack>
        </>
    )
}

export default withBreakpoints(ClientPage);