import React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box,
  Select,
  Input,
  FormLabel,
  Button,
  Stack,
  RadioGroup,
  Radio,
  Text
} from '@chakra-ui/react'
import { useSelector } from 'react-redux';
import { useColorMode } from '@chakra-ui/color-mode';
import { AddIcon } from '@chakra-ui/icons'

function QuickStatement() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const firstField = React.useRef()
  
  const clients = useSelector(state => state.user.clients);

  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  
  return (
    <>
      <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
        Quick Statement
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Quick Statement</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <RadioGroup >
                  <Stack spacing={4} direction="row">
                    <Radio value="1" defaultChecked="false">Current Month</Radio>
                    <Radio value="2" defaultChecked="false">Current Year</Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              <Box>
                <FormLabel htmlFor="owner">Select Client</FormLabel>
                <Select id="owner" defaultValue="segun">
                  {clients.map(client => {return (
                        <option value={client}>{client.fname + ' ' + client.lname}</option>
                    )})}
                </Select>
              </Box>

              <Box>
                  <Text mb="8px">Start Date</Text>
                  <Input type="date" />
              </Box>

              <Box>
                  <Text mb="8px">End Date</Text>
                  <Input type="date" />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px" backgroundColor={isDark? "black" : "white"}>
            <Button variant="outline" mr={20} colorScheme="red" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default QuickStatement
