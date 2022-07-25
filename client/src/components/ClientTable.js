import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
    Button,
    Table, 
    Thead,
    Tr, 
    Th, 
    Td, 
    Tbody,
    HStack,
    VStack,
    Heading,
} from '@chakra-ui/react';
import { useColorMode } from "@chakra-ui/react";
import ClientSortMenu from "./ClientSortMenu";

export default function ClientTable(props) {

    const clientsFromStore = useSelector(state => state.clients)
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    // store the breakpoints from props
    const breakpoints = props.breakpoints;
    const currBreakpoint = props.currentBreakpoint
    const isDesktop = breakpoints[currBreakpoint] > breakpoints.tablet;
    // copy of array so setState call causes rerender
    const clientsSorted = [...clientsFromStore];
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
        <HStack style={{paddingRight: '2rem', paddingLeft: '2rem', justifyContent: 'center', width: '85%'}}>
        {isDesktop ? null : <ClientSortMenu setSorting={setSorting} currBreakpoint={currBreakpoint} breakpoints={breakpoints}/>}
            <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem', position: 'absolute', alignSelf: 'center'}}>Clients</Heading>
                <VStack style={{flexDirection: isDesktop ? 'row': 'column', alignItems: 'end', marginLeft: "100%"}}>
                <Button 
                    variant="outline"
                    color="white" 
                    bg={isDark ? 'brand.dark.purple': 'brand.green'} 
                    style={{marginRight: isDesktop ? '1rem': null}}
                    onClick={() => {props.addClientShown(true)}}
                    >Add</Button>
                   {isDesktop ? <ClientSortMenu setSorting={setSorting} currBreakpoint={currBreakpoint} breakpoints={breakpoints}/>: null} 
            </VStack>
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
                    {clients.map(client => {return (
                        <Tr key={client._id} onClick={() => { navigate(`/client/${client._id}`) }}>
                            <Td>{client.fname + " " + client.lname}</Td>
                            <Td isNumeric>${client.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Td>
                        </Tr>
                        )}
                    )}
                </Tbody>
            </Table>
       </> 
    )
}