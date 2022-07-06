import React, { useEffect } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { BiChevronDown } from 'react-icons/bi';

export default function ClientSortMenu(props) {
  // save the cliets array coming from props
  const clients = props.clients;
  // a new array so that the parent component will rerender on setState call
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

  const sortCustom = () => {
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
      sortFunc(name1, name2);
    })
    return clientsArr;
  }

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BiChevronDown />}>
        Sort
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => { props.setClients(sortClients(clientsSorted, 0)); }}>A-Z</MenuItem>
        <MenuItem onClick={() => { props.setClients(sortClients(clientsSorted, 1)); }}>Z-A</MenuItem>
        <MenuItem onClick={() => { props.setClients(sortClients(clientsSorted, 2)); }}>Custom</MenuItem>
      </MenuList>
    </Menu>
  )
}