import React, { useEffect } from "react";
import { useState } from "react";
import { Input, InputGroup, Container, VStack, HStack, Button, Box } from '@chakra-ui/react';
import { useSelector } from "react-redux";
import { Table, Thead, Tr, Th } from '@chakra-ui/react';

export default function ClientTable() {
    const clients = useSelector(state => state.user.clients);
    useEffect(() => {
        console.log(clients);
    })
    return (
        <>
            <Table size='lg' style={{marginBottom: '2rem'}}>
                <Thead>
                    <Tr>
                        <Th>Client</Th>
                        <Th>Balance</Th>
                    </Tr>
                    {clients.map(client => {return (
                        <Tr>
                            <Th>{client.fname + " " + client.lname}</Th>
                            <Th isNumeric>${parseFloat(client.balance['$numberDecimal'].toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Th>
                        </Tr>
                    )})}
                </Thead>
            </Table>
        </>
        
    )
}