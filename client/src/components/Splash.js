import React from 'react';
import {
    VStack,
    HStack,
    Button
}
from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { withBreakpoints } from 'react-breakpoints';


function Splash(props) {

    const { breakpoints, currentBreakpoint} = props;
    const navigate = useNavigate();

    return (
        <>
            <VStack style={{marginTop: '5rem'}}>
                <h1 className="willowCursive" style={{fontSize: '6rem'}}>Willow</h1>
                <h3 style={{maxWidth: breakpoints[currentBreakpoint] < breakpoints.tablet ? '80%' : '50%', fontSize: '1.5rem'}}>A free and easy way for professionals to track their time, manage retainers and invoice clients.</h3>
                <HStack spacing={10} style={{margin: '2rem'}}>
                    <Button bg='brand.dark.purple' color='white' onClick={() => { navigate('/register') }}>Register</Button>
                    <Button bg='brand.green' color='white' onClick={() => { navigate('/') }}>Log In</Button>
                </HStack>
                <VStack style={{flexDirection: breakpoints[currentBreakpoint] < breakpoints.tablet ? 'column': 'row', width: breakpoints[currentBreakpoint] < breakpoints.tablet ? '100%' : '70%', justifyContent: 'space-between', textAlign: 'center'}} spacing={5}>
                    <VStack width={breakpoints[currentBreakpoint] < breakpoints.tablet ? '100%': "33%"} style={{height: '15rem', padding: '2rem', margin: breakpoints[currentBreakpoint] < breakpoints.tablet ? '4rem': '0'}}>
                        <img style={{width: '50%', height: 'auto'}} src={require("../assets/clock.png")} alt="bill"/>
                        <h3 style={{fontSize: '2rem'}}>Time Tracking</h3>
                        <p style={{width: '80%', height: 'auto'}}>Log events such as meetings, phone calls and emails. Track your billable time, bill rate and the total fees.</p>
                    </VStack>
                    <VStack width={breakpoints[currentBreakpoint] < breakpoints.tablet ? '100%': "33%"} style={{height: '15rem', padding: '2rem', margin: breakpoints[currentBreakpoint] < breakpoints.tablet ? '4rem': '0'}}>    
                        <img style={{width: '50%', height: 'auto'}} src={require("../assets/money.png")} alt="bill"/>
                        <h3 style={{fontSize: '2rem'}}>Retainer Management</h3>
                        <p style={{width: '80%'}}>Accept and manage retainers. Apply funds to a client account and bill against the balance.</p>
                    </VStack>
                    <VStack width={breakpoints[currentBreakpoint] < breakpoints.tablet ? '100%': "33%"} style={{height: '15rem', padding: '2rem', margin: breakpoints[currentBreakpoint] < breakpoints.tablet ? '4rem': '0'}}> 
                        <img style={{width: '50%', height: 'auto'}} src={require("../assets/bill.png")} alt="bill"/>
                        <h3 style={{fontSize: '2rem'}}>Statement Generator</h3>
                        <p style={{width: '80%', marginBottom: '4rem'}}>Prepare and send PDF statements to clients detailing activity by event or date range.</p>
                    </VStack>
                </VStack>
            </VStack>
        </>
    )
}

export default withBreakpoints(Splash);