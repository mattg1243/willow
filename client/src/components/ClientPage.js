import React, { useState } from 'react';
import moment from 'moment';
import { VStack, HStack, Badge, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, Tooltip, IconButton, ModalFooter } from '@chakra-ui/react';
import { useParams, useSearchParams } from 'react-router-dom';
import { withBreakpoints } from 'react-breakpoints';
import { loginAction } from '../actions';
import { runLogoutTimer } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { useColorMode } from '@chakra-ui/color-mode';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import Header from './Header';
import AddEventForm from './AddEventForm';
import EditClientForm from './EditClientForm';
import QuickStatement from './QuickStatement';
import axios from 'axios';

function ClientPage(props) {
    
    const [addIsShown, setAddIsShown] = useState(false);
    const [deleteIsShown, setDeleteIsShown] = useState(false);
    const [toDelete, setToDelete] = useState('');
    const [editIsShown, setEditIsShown] = useState(false);
    const [editEventIsShown, setEditEventIsShown] = useState(false);
    const [toEdit, setToEdit] = useState('');
    const [statementDrawerOpen, setStatementDrawerOpen] = useState(false);

    const { id } = useParams();
    const { breakpoints, currentBreakpoint } = props;
    
    const token = useSelector(state => state.token);
    const user = useSelector(state => state.user);
    const clients = useSelector(state => state.clients);
    const client = clients.find(client => client._id === id);
    const allEvents = useSelector(state => state.events);
    const events = allEvents.filter(event => event.clientID === id);

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const dispatch = useDispatch();

    const deleteEvent = (eventID) => {
        axios.post(`/client/deleteevent`,
        {
            clientID: id,
            eventID: eventID, 
            user: user.id,
        },
        {
            headers: { 'Authorization': `Bearer ${token}`}
        }).then((response) => {
            console.log(response);
            dispatch(loginAction(response.data));
            runLogoutTimer();
            setTimeout(() => {window.location.reload();}, 10);
        }).catch(err => console.error(err));
    }

    return (
        <>
            <Header />
            <VStack style={{height: '100%', width: '100%', paddingTop: '1rem'}}>
                <HStack spacing={10} style={{paddingRight: '2rem', paddingLeft: '2rem'}}>
                    <VStack style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                        <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem'}}>{client.fname + " " + client.lname}</Heading>
                        <Text style={{fontFamily: '"Quicksand", sans-serif', fontSize: '1.5rem', paddingBottom: '1rem'}}>
                            Balance: ${client.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            {parseFloat(client.balance) > parseFloat(client.balanceNotifyThreshold) ? null: <><Badge colorScheme='red' style={{ marginBottom: '.25rem', marginLeft: '1rem' }}>LOW</Badge></> }
                        </Text>
                    </VStack>
                        <VStack style={{flexDirection: breakpoints[currentBreakpoint] > breakpoints.tablet ? 'row': 'column', alignItems: 'end', justifyContent: 'end'}}>
                            <Button 
                                variant="outline"
                                color="white" 
                                bg={isDark ? 'brand.dark.purple': 'brand.green'} 
                                style={{margin: '1rem', padding: '20px'}}
                                isDisabled={client.isArchived}
                                onClick={() => {setAddIsShown(true)}}
                                >New Event</Button>
                            <Button 
                                variant="outline"
                                color="white"
                                bg={isDark ? 'brand.dark.purple': 'brand.green'}  
                                style={{margin: '1rem', padding: '20px'}}
                                onClick={() => {setStatementDrawerOpen(true)}}
                            >Statement</Button>
                        </VStack>
                </HStack>
                    <Table variant='striped' size='lg' style={{marginBottom: '2rem', width: breakpoints[currentBreakpoint] < breakpoints.tablet ? '100%': '70%', padding:'1.5rem', tableLayout: 'fixed'}} >
                        <Thead width='100%'>
                        <Tr style={{width: '100%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'justify'}}>
                            <Th style={{textAlign: 'start'}}>Date</Th>
                            <Th style={{textAlign: 'center'}}>Type</Th>
                            {breakpoints[currentBreakpoint] < breakpoints.desktop ? null: (<><Th style={{textAlign: 'center'}}>Details</Th>
                            <Th style={{textAlign: 'center'}}>Time</Th></>)}
                            <Th style={{textAlign: 'center'}}>{breakpoints[currentBreakpoint] < breakpoints.desktop ? '$': 'Amount'}</Th>
                            {breakpoints[currentBreakpoint] < breakpoints.mobileLandscape ? null : (
                            <Th style={{textAlign: 'end'}}>Edit</Th>
                            )}
                        </Tr>
                        </Thead>
                        <Tbody width="100%">
                            {events.map(event => {
                                return (
                                    <Tr key={event._id} >
                                        <Td style={{textAlign: 'start'}}>{moment.utc(event.date).format("MM/DD/YY")}</Td>
                                        <Td style={{textAlign: 'center'}}>{event.type}</Td>
                                        {breakpoints[currentBreakpoint] > breakpoints.tablet ? (
                                        <>
                                        <Td style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: 'center'}}>
                                            <Tooltip label={event.detail}>
                                                {event.detail ? event.detail : '-'}
                                            </Tooltip>
                                        </Td>
                                        <Td style={{textAlign: 'center'}}>{event.duration ? event.duration : '-'}</Td>
                                        </>): null}
                                        <Td style={{textAlign: breakpoints[currentBreakpoint] > breakpoints.tablet ? 'center': 'end'}}>
                                            ${event.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </Td>
                                        {breakpoints[currentBreakpoint] > breakpoints.mobile ? (
                                        <Td style={{textAlign: 'end'}}>
                                            <IconButton 
                                                icon={<EditIcon />} 
                                                size="sm" 
                                                isDisabled={client.isArchived}
                                                onClick={() => { setToEdit(event); setEditEventIsShown(true); }}
                                                style={{margin: '1rem'}}
                                            />
                                            <IconButton 
                                                icon={<DeleteIcon />} 
                                                size="sm"
                                                isDisabled={client.isArchived} 
                                                onClick={() => { setDeleteIsShown(true); setToDelete(event._id) }}
                                            />
                                        </Td>): null}
                                    </Tr>
                                )}
                            )}
                        </Tbody>
                    </Table>
                    <Button variant="outline" style={{padding: '1rem'}} onClick={ () => {setEditIsShown(true);}}>Edit Client</Button>
                    <Modal motionPreset="slideInBottom" onClose={() => {setAddIsShown(false)}} isOpen={addIsShown}>
                        <ModalOverlay />
                        <ModalContent pb={5}>
                            <ModalHeader>New Event</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                    <AddEventForm id={ id } rate={client.rate ? client.rate: "Not specified"} setIsShown={ setAddIsShown }/>
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
                    <Modal onClose={() => {setEditIsShown(false)}} isOpen={editIsShown}>
                        <ModalOverlay />
                        <ModalContent pb={5}>
                            <ModalHeader>Edit Client Info</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem'}}>
                                <EditClientForm client={client} token={token} user={user.id} setEditIsShown={setEditIsShown}/>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    <Modal motionPreset="slideInBottom" onClose={() => {setEditEventIsShown(false)}} isOpen={editEventIsShown}>
                        <ModalOverlay />
                        <ModalContent pb={5}>
                            <ModalHeader>Edit Event</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                    <AddEventForm id={ id } event={toEdit} rate={client.rate ? client.rate: "Not specified"} edit={true} setIsShown={setEditEventIsShown} />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                <QuickStatement statementDrawerOpen={statementDrawerOpen} setStatementDrawerOpen={setStatementDrawerOpen} client={client}/>
            </VStack>
        </>
    )
}

export default withBreakpoints(ClientPage);