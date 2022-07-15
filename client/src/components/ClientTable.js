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
    Flex,
    Spacer
} from '@chakra-ui/react';
import { useColorMode } from "@chakra-ui/react";
import ClientSortMenu from "./ClientSortMenu";

export default function ClientTable(props) {

    const clientsFromStore = useSelector(state => state.clients)
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [clients, setClients] = useState(clientsFromStore);
    const [sorting, setSorting] = useState(0);
    // copy of array so setState call causes rerender
    const clientsSorted = [...clients];
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
    // sort the client array on component mount, 
    // fname A-Z by default
    useEffect(() => {
        const sortedClients = sortClients(clientsSorted, sorting);
        setClients(sortedClients);
    });

    return (
        <>
        {/* top stack, "Client", Add button, Sort menu */}
        <HStack spacing={10} style={{paddingRight: '2rem', paddingLeft: '2rem', justifyContent: 'center', width: '90%'}}>
            <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '3rem', position: 'absolute'}}>Clients</Heading>
            <VStack style={{flexDirection: props.breakpoints[props.currentBreakpoint] > props.breakpoints.tablet ? 'row': 'column', alignItems: 'end', marginLeft: "95%"}}>
                <Button 
                    variant="outline"
                    color="white" 
                    style={{backgroundColor: isDark? "#63326E" : '#03b126', marginRight: props.breakpoints[props.currentBreakpoint] > props.breakpoints.tablet ? '1rem': null}}
                    onClick={() => {props.addClientShown(true)}}
                    >Add Client</Button>
                <ClientSortMenu setSorting={setSorting}/>
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