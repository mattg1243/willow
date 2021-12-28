import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { Input, Container, VStack, HStack, Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios"
import ClientTable from "./ClientTable"
import Header from "./Header";

export default function Base(props) {
    
    const clients = useSelector((state) => {return state.user.clients});
    
    useEffect(() => {
        console.log(clients);
    })
    return (
        <>
            <Header />
            <h1>Base Component</h1>
            <ClientTable />
        </>
    )
}