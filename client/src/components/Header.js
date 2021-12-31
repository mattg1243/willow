import React from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import HamburgerMenu from './Menu';
import { useColorMode } from '@chakra-ui/color-mode'

export default function Header() {
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'

    return (
        <header className="navbar" style={{backgroundColor: isDark? "#63326E" : "#03b126"}}>
            <HamburgerMenu />
            <h3 className="willowCursive" style={{color: 'white', fontSize: '3rem', padding: '.5rem'}}>Willow</h3>
            <ColorModeSwitcher />
        </header>
    )
}