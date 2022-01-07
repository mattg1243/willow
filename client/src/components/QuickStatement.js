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
  Button,
  Stack,
  VStack,
  RadioGroup,
  Radio,
  Text,
  HStack
} from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/color-mode';
import { useEffect } from 'react';

export default function QuickStatement(props) {
  
  const [autoSelection, setAutoSelection] = useState(false);
  
  const stateStr = window.sessionStorage.getItem('persist:root');
  const state = JSON.parse(stateStr);
  const clients = JSON.parse(state.clients);

  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  useEffect(() => {console.log("QuickStatement mounted")})
  
  return (
    <>
      <Drawer
        isOpen={props.statementDrawerOpen}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton onClick={() => { props.setStatementDrawerOpen(false) }}/>
          <DrawerHeader borderBottomWidth="1px">Quick Statement</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px" style={{marginTop: '2rem'}}>
              <Box>
              <Box>
                <FormLabel htmlFor="owner">Select Client</FormLabel>
                <Select id="owner" defaultValue="segun">
                  {clients.map(client => {return (
                        <option key={`${client._id}`} value={client}>{client.fname + ' ' + client.lname}</option>
                    )})}
                </Select>
              </Box>
                <RadioGroup onClick={() => { setAutoSelection(true) }} style={{marginTop: '2rem'}}>
                  <VStack spacing={4} direction="row">
                    <Radio value="1" defaultChecked="false" isDisabled={autoSelection ? false : true}>Current Month</Radio>
                    <Radio value="2" defaultChecked="false" isDisabled={autoSelection ? false : true}>Current Year</Radio>
                  </VStack>
                </RadioGroup>
              </Box>
              <HStack>
                <Divider />
                  <h3>or</h3>
                <Divider />
              </HStack>
              <Stack spacing={4} direction="column"onClick={() => {setAutoSelection(false)}}>
                <Box>
                    <Text mb="8px">Start Date</Text>
                    <Input type="date" isDisabled={autoSelection ? true: false}/>
                </Box>
                <Box>
                    <Text mb="8px">End Date</Text>
                    <Input type="date" isDisabled={autoSelection ? true: false}/>
                </Box>
              </Stack>
            </Stack>
          </DrawerBody>

          <DrawerFooter >
            <Button style={{backgroundColor: isDark? "#63326E" : "#03b126", color: 'white'}}>Download</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
