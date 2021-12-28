import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { Input, Container, VStack, HStack, Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios"
import ClientTable from "./ClientTable"

export default function Base() {
    
    const clients = useSelector((state) => {return state.clients});
    
    useEffect(() => {
        console.log(clients);
    })
    return (
        <>
        <Container>
            <h1>Clients</h1>
            {clients.map(client => (<h3>{client.fname}</h3>))}
        </Container>
        
        </>
    )
}