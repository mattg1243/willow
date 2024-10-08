import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    IconButton,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useColorMode } from '@chakra-ui/color-mode';
import { GiHamburgerMenu } from 'react-icons/gi';
import { BiLogOut, BiHome } from 'react-icons/bi';
import { FaFileInvoiceDollar, FaUserCircle, FaRegFileArchive } from 'react-icons/fa';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import QuickStatement from './QuickStatement';

export default function HamburgerMenu() {
    
    const [statementDrawerOpen, setStatementDrawerOpen] = useState(false);
    
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    const navigate = useNavigate();

    const logout = () => {
        window.sessionStorage.removeItem('persist:root');
        navigate('/');
    }

    useEffect(() => {console.log(statementDrawerOpen)})

    const maintMsg = "This feature is under maintenence. To generate a statement, please go to the client's page and click on the Statement button.";

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
                <MenuItem icon={<BiHome color={isDark? "white" : "black"} />} color={isDark? "white" : "black"} onClick={() => { navigate('/home') }} >
                    Home
                </MenuItem>
                <MenuItem icon={<BsFillPersonLinesFill color={isDark? "white" : "black"} />} color={isDark? "white" : "black"} onClick={() => { navigate('/clients') }} >
                    Clients
                </MenuItem>
                <MenuItem icon={<FaRegFileArchive color={isDark? "white" : "black"} />} color={isDark? "white" : "black"} onClick={() => { navigate('/client-archive') }} >
                    Closed Cases
                </MenuItem>
                {/* <MenuItem icon={<FaFileInvoiceDollar color={isDark? "white" : "black"} />} color={isDark? "white" : "black"} onClick={() => { setStatementDrawerOpen(true); }} disabled tooltip={maintMsg}>
                    Quick Statement
                </MenuItem> */}
                <MenuDivider />
                <MenuItem icon={<FaUserCircle color={isDark? "white" : "black"}/>} color={isDark? "white" : "black"} onClick={() => { navigate('/profile') }}>
                    Profile
                </MenuItem>
                <MenuItem icon={<BiLogOut color="#EC4E20" />} color={isDark? "white" : "black"} onClick={() => { logout(); }}>
                    Logout
                </MenuItem>
            </MenuList>
        </Menu>
        <QuickStatement statementDrawerOpen={statementDrawerOpen} setStatementDrawerOpen={setStatementDrawerOpen}/>
        </>
    )
}
