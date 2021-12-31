import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { HStack, Button, Box, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios"
import ClientTable from "./ClientTable"
import AddClientForm from "./AddClientForm";
import Header from "./Header";
import { useColorMode } from '@chakra-ui/color-mode'

export default function Dashboard(props) {

    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    
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
                    <Button 
                    color="white" 
                    style={{backgroundColor: isDark? "#63326E" : '#03b126', marginBottom: '2rem'}} 
                    onClick={() => { setIsShown(true) }} >
                        Add
                    </Button>
                </HStack>
                <Modal motionPreset="slideInBottom" onClose={() => {setIsShown(false)}} isOpen={isShown}>
                    <ModalOverlay />
                    <ModalContent pb={5}>
                        <ModalHeader>New Client</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                                <AddClientForm setIsShown={setIsShown}/>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    )
}