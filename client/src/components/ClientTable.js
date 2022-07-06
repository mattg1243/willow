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

    useEffect(() => {console.log("ClientTable mounted")});

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
            <ClientSortMenu clients={clients} setClients={setClients} />
       </> 
    )
}