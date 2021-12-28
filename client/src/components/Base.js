import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { HStack, Button, Box, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios"
import ClientTable from "./ClientTable"
import Header from "./Header";

export default function Base(props) {
    
    const [isShown, setIsShown] = useState(false);

    const clients = useSelector((state) => {return state.user.clients});
    
    useEffect(() => {
        console.log(clients);
    })
    return (
        <>
            <Header />
            <Box maxW='xl' maxH='lg'>
                <ClientTable />
                <HStack style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Button color='white' backgroundColor='#03b126' onClick={() => { setIsShown(true) }}>ADD</Button>
                </HStack>
                <Modal motionPreset="slideInBottom" onClose={() => {setIsShown(false)}} isOpen={isShown}>
                    <ModalOverlay />
                    <ModalContent pb={5}>
                        <ModalHeader>New Client</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                    </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    )
}