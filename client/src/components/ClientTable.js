import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, InputGroup, Container, VStack, HStack, Button, Box } from '@chakra-ui/react';
import { useSelector } from "react-redux";
import { Table, Thead, Tr, Th, Td, Tbody } from '@chakra-ui/react';

export default function ClientTable() {
    
    const stateStr = window.sessionStorage.getItem('persist:root');
    const state = JSON.parse(stateStr);
    const clients = JSON.parse(state.clients);
    const navigate = useNavigate();

    useEffect(() => {console.log(stateStr)});

    return (
            <Table size='lg' style={{marginBottom: '2rem'}} variant='striped'>
                <Thead>
                    <Tr>
                        <Th>Client</Th>
                        <Th>Balance</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {clients.map(client => {return (
                        <Tr key={client._id} onClick={() => { navigate(`/client/${client._id}`) }}>
                            <Td>{client.fname + " " + client.lname}</Td>
                            <Td isNumeric>${parseFloat(client.balance['$numberDecimal'].toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Td>
                        </Tr>
                        )}
                    )}
                </Tbody>
            </Table>
        
    )
}