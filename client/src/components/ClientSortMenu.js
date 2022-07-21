import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { BiChevronDown } from 'react-icons/bi';
import { FaSort } from 'react-icons/fa'

export default function ClientSortMenu(props) {

  const { setSorting, currBreakpoint, breakpoints } = props;
  let isDesktop = breakpoints[currBreakpoint] > breakpoints.tablet;

  return (
    <Menu>
      <MenuButton as={isDesktop ? Button: IconButton} icon={isDesktop ? null: <FaSort/>} rightIcon={isDesktop ? <BiChevronDown/>: null}>
        {isDesktop ? (<>Sort</>): null}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => { setSorting(0); }}>A-Z</MenuItem>
        <MenuItem onClick={() => { setSorting(1); }}>Z-A</MenuItem>
        <MenuItem onClick={() => { setSorting(2); }}>Custom</MenuItem>
      </MenuList>
    </Menu>
  )
}