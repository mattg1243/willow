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

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BiChevronDown />}>
        Sort
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => { props.setSorting(0); }}>A-Z</MenuItem>
        <MenuItem onClick={() => { props.setSorting(1); }}>Z-A</MenuItem>
        <MenuItem onClick={() => { props.setSorting(2); }}>Custom</MenuItem>
      </MenuList>
    </Menu>
  )
}