import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';

export default function ClientPage() {
    
    const { id } = useParams();
    const client = useSelector(state => state.user.clients.find(client => client._id === id));

    return (
        <>
            <Header />
            <h1>{client.fname}</h1>
        </>
    )
}