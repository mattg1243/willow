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
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react';
import ClientSortMenu from "./ClientSortMenu";

export default function ClientTable() {

    const clientsFromStore = useSelector(state => state.clients)
    const navigate = useNavigate();

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
    // sort the client array, fname A-Z by default
    useEffect(() => {
        const sortedClients = sortClients(clientsSorted, sorting);
        setClients(sortedClients);
    });

    return (
        <>
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
            <ClientSortMenu clients={clients} setSorting={setSorting} />
       </> 
    )
}