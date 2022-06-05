import React, { useState }from 'react'
import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Select,
  Input,
  FormLabel,
  Heading,
  Button,
  Stack,
  VStack,
  RadioGroup,
  Radio,
  Text,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Spinner
} from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/color-mode';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function QuickStatement(props) {
  
  // const stateStr = window.sessionStorage.getItem('persist:root');
  // const state = JSON.parse(stateStr);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const clients = useSelector((state) => state.clients);
  const allEvents = useSelector((state) => state.events);

  const [autoSelection, setAutoSelection] = useState(false);
  const [currentRadio, setCurrentRadio] = useState(null);
  const [client, setClient] = useState(props.client ? props.client: clients[0]);
  const [startdate, setStartdate] = useState(new Date());
  const [enddate, setEnddate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const makeStatement = () => {
    setLoading(true);
    axios.post(`/client/makestatement/${user.id}/${client._id}/${startdate}/${enddate}`,
      {},
      {
        headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'text/json',
      },
      responseType: 'blob'
    })
    .then((response) => {console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data],{type: "application/pdf"}));
      var link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${client.fname}${client.lname[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      setLoading(false);  
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
      setMessage("There are no events in the given range of dates.");
    })
  } 

  return (
    <>
      <Drawer
        isOpen={props.statementDrawerOpen}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton onClick={() => { props.setStatementDrawerOpen(false) }}/>
          <DrawerHeader borderBottomWidth="1px">Make Statement</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px" style={{marginTop: '2rem'}}>
              <Box>
              <Box>
                {props.client ? 
                (<>
                  <Heading style={{fontFamily: '"Quicksand", sans-serif', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem'}}>{client.fname + " " + client.lname}</Heading>  
                  <Divider />
                </>) : (
                  <>
                    <FormLabel>Select Client</FormLabel>
                    <Select onChange={(e) => {
                      setClient(e.target.value); 
                      setMessage(""); 
                      setEvents(allEvents.filter(event => event.clientID == client["_id"]));
                    }}>
                      {clients.map(client => {return (
                            <option key={client._id} value={JSON.stringify(client)}>{client.fname + " " + client.lname}</option>
                          )}
                        )}
                    </Select>
                  </>
                )}
              </Box>
                <RadioGroup onClick={() => { setAutoSelection(true) }}
                 onChange={(val) => {
                    setCurrentRadio(val);
                    // set dates based on input
                    const date = new Date();
                    if (val == "currentMonth") {
                      setStartdate(new Date(date.getFullYear(), date.getMonth(), 1));
                    }
                    if (val == "currentYear") {
                      setStartdate(new Date(date.getFullYear(), 0, 1))
                    }
                    if (val == "all") {
                      setStartdate(new Date("0"))
                    }
                    setMessage("");
                    }}
                  style={{marginTop: '2rem'}}>
                  <VStack spacing={4} direction="row">
                    <HStack>
                      <Radio 
                        defaultChecked="false" 
                        isDisabled={autoSelection ? false : true} 
                        value="currentMonth"
                      ></Radio>
                      <FormLabel>Current Month</FormLabel>
                    </HStack>
                    <HStack>
                      <Radio 
                        defaultChecked="false" 
                        isDisabled={autoSelection ? false : true}
                        value="currentYear"
                      ></Radio>
                      <FormLabel>Current Year</FormLabel>
                    </HStack>
                    <HStack>
                      <Radio 
                        defaultChecked="false" 
                        isDisabled={autoSelection ? false : true}
                        value="all"
                      ></Radio>
                      <FormLabel>All Events</FormLabel>
                    </HStack>
                  </VStack>
                </RadioGroup>
              </Box>
              <HStack>
                <Divider />
                  <h3>or</h3>
                <Divider />
              </HStack>
              <Stack spacing={4} direction="column"onClick={() => {setAutoSelection(false); setMessage("")}}>
                <Box>
                    <Text mb="8px">Start Date</Text>
                    <Input type="date" isDisabled={autoSelection ? true: false} onChange={(e) => {setStartdate(e.target.value)}}/>
                </Box>
                <Box>
                    <Text mb="8px">End Date</Text>
                    <Input type="date" isDisabled={autoSelection ? true: false} onChange={(e) => {setEnddate(e.target.value)}}/>
                </Box>
                <Alert status='error' style={{display: message ? 'flex': 'none'}}>
                    <AlertTitle mr={2}>{message}</AlertTitle>
                    <CloseButton position='absolute' right='8px' top='8px' />
                </Alert>
              </Stack>
              {loading ? (
                  <>
                    <VStack width='100%'>
                      <Spinner style={{margin: '2rem', padding: '2rem', color: isDark? "#63326E" : "#03b126"}}/>
                    </VStack>
                  </>
                ) : (
                  null
                )}
            </Stack>
          </DrawerBody>

          <DrawerFooter >
            <Button style={{backgroundColor: isDark? "#63326E" : "#03b126", color: 'white'}} onClick={() => { makeStatement() }}>Download</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
