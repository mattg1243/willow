import React from "react";
import { useState } from "react";
import { HStack, VStack, Modal, ModalContent, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, Heading } from '@chakra-ui/react';
import { withBreakpoints } from 'react-breakpoints';
import ClientTable from "./ClientTable"
import AddClientForm from "./AddClientForm";
import Header from "./Header";

function Dashboard(props) {
    
    const [isShown, setIsShown] = useState(false);
    const { breakpoints, currentBreakpoint } = props;
    
    return (
        <>
            <Header />
            <VStack style={{height: '100%', width: breakpoints[currentBreakpoint] < breakpoints.tablet ? '100%': '70%', paddingTop: '1rem'}}>
                <ClientTable addClientShown={setIsShown} breakpoints={breakpoints} currentBreakpoint={currentBreakpoint}/>
                <HStack style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
               
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