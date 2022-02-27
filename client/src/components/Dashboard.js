import React from "react";
import { useState, useEffect } from "react";
import { HStack, VStack, Button, Box, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, Heading } from '@chakra-ui/react';
import { withBreakpoints } from 'react-breakpoints';
import ClientTable from "./ClientTable"
import AddClientForm from "./AddClientForm";
import Header from "./Header";
import { useColorMode } from '@chakra-ui/color-mode';

function Dashboard(props) {

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    
    const [isShown, setIsShown] = useState(false);
    const { breakpoints, currentBreakpoint } = props;
    
    return (
        <>
            <Header />
            <VStack style={{height: '100%', width: breakpoints[currentBreakpoint] < breakpoints.tablet ? '100%': '70%', paddingTop: '1rem'}}>
            <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem', marginBottom: '2rem'}}>Clients</Heading>
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
                        <ModalBody style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.5rem'}}>
                                <AddClientForm setIsShown={setIsShown}/>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </VStack>
        </>
    )
}

export default withBreakpoints(Dashboard);