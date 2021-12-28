import React from 'react';
import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons'

export default function Header() {
    return (
        <header className="navbar">
            <HamburgerIcon w={6} h={6} />
            <h3 className="willowCursive" style={{color: 'white', fontSize: '3rem', padding: '.5rem'}}>Willow</h3>
            <SettingsIcon w={6} h={6} />
        </header>
    )
}