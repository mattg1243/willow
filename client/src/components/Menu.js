import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuDivider,
    IconButton,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useColorMode } from '@chakra-ui/color-mode';
import { IoSettingsSharp } from 'react-icons/io5';
import { GiHamburgerMenu } from 'react-icons/gi';
import { BiLogOut } from 'react-icons/bi';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import QuickStatement from './QuickStatement';

export default function HamburgerMenu() {
    
    const [statementDrawerOpen, setStatementDrawerOpen] = useState(false);
    
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'

    const navigate = useNavigate();

    useEffect(() => {console.log(statementDrawerOpen)})

    return(
        <>
        <Menu>
            <MenuButton 
            as={IconButton}
            aria-label='Menu'
            icon={<GiHamburgerMenu size={25} />}
            variant='flat'
                />
            <MenuList >
                <MenuItem icon={<BsFillPersonLinesFill color={isDark? "white" : "black"} />} color={isDark? "white" : "black"} onClick={() => { navigate('/clients') }} >
                    Clients
                </MenuItem>
                <MenuItem icon={<FaFileInvoiceDollar color={isDark? "white" : "black"} />} color={isDark? "white" : "black"} onClick={() => { setStatementDrawerOpen(true) }}>
                    Quick Statement
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<IoSettingsSharp color={isDark? "white" : "black"}/>} color={isDark? "white" : "black"}>
                    Settings
                </MenuItem>
                <MenuItem icon={<BiLogOut color="#EC4E20" />} color={isDark? "white" : "black"}>
                    Logout
                </MenuItem>
            </MenuList>
        </Menu>
        
        </>
    )
}
