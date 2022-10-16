import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
    Button,
    Badge,
    Table, 
    Thead,
    Tr, 
    Th, 
    Td, 
    Tbody,
    HStack,
    VStack,
    Grid,
    GridItem,
    Heading,
    SimpleGrid,
    Spacer,
} from '@chakra-ui/react';
import { useColorMode } from "@chakra-ui/react";
import ClientSortMenu from "./ClientSortMenu";

export default function ClientTable(props) {

    const clientsFromStore = useSelector(state => state.clients)
    // function to sort out which clients to take from state
    const clientFilter = (client) => {
        if (props.archiveMode && client.isArchived) {
            return true;
        }
        else if (!props.archiveMode && !client.isArchived) {
            return true;
        }
        return false;
    }
    // filter the clients
    const filteredClients = clientsFromStore.filter(clientFilter);
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    // store the breakpoints from props
    const breakpoints = props.breakpoints;
    const currBreakpoint = props.currentBreakpoint
    const isDesktop = breakpoints[currBreakpoint] > breakpoints.tablet;
    // copy of array so setState call causes rerender
    const clientsSorted = [...filteredClients];
    // sorting functions
    const sortAtoZ = (name1, name2) => {
        if (name1 < name2) return -1;
        if (name1 > name2) return 1;
        // names must be equal
        return 0;
      }
    
      const sortZtoA = (name1, name2) => {
          if (name1 > name2) return -1;
          if (name1 < name2) return 1;
          // names must be equal
          return 0;
      }
  
      const sortCustom = (name1, name2) => {
          // not yet implemented
      }
  
      const sortClients = (clientsArr, sortMethod) => {
          // check for sortMethod before iterating through array
          let sortFunc;
          if (sortMethod === 0) sortFunc = sortAtoZ;
          if (sortMethod === 1) sortFunc = sortZtoA;
          if (sortMethod === 2) sortFunc = sortCustom;
          clientsArr.sort((a, b) => {
            // ignore case
            const name1 = a.fname.toUpperCase();
            const name2 = b.fname.toUpperCase(); 
            // sort it!
            return sortFunc(name1, name2);
          })
          return clientsArr;
        }
    // states
    const [sorting, setSorting] = useState(0);
    // mock state for clients so as to prevent
    const clients = sortClients(clientsSorted, sorting);

    return (
        <>
        {/* top stack, "Client", Add button, Sort menu */}
        <HStack style={{paddingRight: '2rem', paddingLeft: '2rem', width: '100%'}}>
        {isDesktop ? null : <ClientSortMenu setSorting={setSorting} currBreakpoint={currBreakpoint} breakpoints={breakpoints}/>}
            <SimpleGrid columns={3} spacing={5} width='100%' justifyContent='space-between' alignItems='center'>
                    <Spacer />
                    <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem', alignItems: 'center', justifySelf: 'center', marginRight: isDesktop ? '0': '3.5rem'}}>
                        {props.archiveMode ? <>Closed Cases</>: <>Clients</>}
                    </Heading>
                    <VStack justifySelf='flex-end' justifyContent='flex-end'>
                        <Button 
                        variant="outline"
                        color="white" 
                        bg={isDark ? 'brand.dark.purple': 'brand.green'} 
                        style={{marginRight: isDesktop ? '1rem': null, marginLeft: '2rem'}}
                        onClick={() => {props.addClientShown(true)}}
                        >Add</Button>
                        {isDesktop ? <ClientSortMenu setSorting={setSorting} currBreakpoint={currBreakpoint} breakpoints={breakpoints}/>: null} 
                    </VStack>
            </SimpleGrid>
        </HStack>
        {/* table */}
            <Table size='lg' style={{marginBottom: '2rem', tableLayout: 'fixed'}} variant='striped'>
                <Thead style={{textAlign: 'center'}}>
                    <Tr>
                        <Th width="50%" style={{textAlign: 'start'}}>Client</Th>
                        <Th width="50%" style={{textAlign: 'end'}}>Balance</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {clients.map(client => { 
                        // create url endpoint based on archived status
                        let endpoint = `/client/${client._id}`;
                        if (client.isArchived) { endpoint += '?closed=true'; }
                        return (
                        <Tr key={client._id} onClick={() => { navigate(endpoint) }}>
                            <Td>
                                {client.fname + " " + client.lname}
                                {parseFloat(client.balance) > parseFloat(client.balanceNotifyThreshold) ? null: 
                                <>
                                    <Badge colorScheme='red' style={{ marginBottom: '.25rem', marginLeft: '1rem' }}>LOW</Badge>
                                </> 
                                }
                            </Td>
                            <Td isNumeric>${client.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Td>
                        </Tr>
                        )}
                    )}
                </Tbody>
            </Table>
       </> 
    )
}