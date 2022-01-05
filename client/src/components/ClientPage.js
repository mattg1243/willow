import React, { useEffect } from 'react';
import { Box, VStack, Heading, Text, Table, Thead, Tr, Th, Td, Divider } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';

export default function ClientPage() {
    
    const { id } = useParams();
    const client = useSelector(state => state.user.clients.find(client => client._id === id));
    const allEvents = useSelector(state => state.user.events);
    const events = allEvents.filter(event => event.clientID === id);

    useEffect(() => {
        console.log("All Events:\n", allEvents, "\nClients events:\n", events);
    })

    return (
        <>
            <Header />
            <VStack style={{height: '100%', width: '70%', paddingTop: '1rem'}}>
                <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem'}}>{client.fname + " " + client.lname}</Heading>
                <Text style={{fontFamily: '"Quicksand", sans-serif', fontSize: '1.5rem', padding: '1rem'}}>Balance: ${parseFloat(client.balance['$numberDecimal'].toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                <Box maxW='xl' maxH='lg'>
                    <Table variant='striped' size='lg' style={{marginBottom: '2rem'}}>
                        <Thead>
                        <Tr>
                            <Th>Type</Th>
                            <Th>Details</Th>
                            <Th>Time</Th>
                            <Th>Amount</Th>
                        </Tr>
                        </Thead>
                        {events.map(event => {
                            return (
                                <Tr>
                                    <Td>{event.type}</Td>
                                    <Td>{event.details ? event.details : '-'}</Td>
                                    <Td>{event.duration ? event.duration : '-'}</Td>
                                    <Td>${parseFloat(event.amount['$numberDecimal'].toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                </Tr>
                            )}
                        )}
                    </Table>
                </Box>
            </VStack>
           
        </>
    )
}