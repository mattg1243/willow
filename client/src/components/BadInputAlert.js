import React from 'react';
import {
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';

export default function BadInputAlert(props) {
  return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle mr={2}>Input Error</AlertTitle>
      <AlertDescription>
        {props.errMsg}
      </AlertDescription>
      <CloseButton position='absolute' right='8px' top='8px'/>
    </Alert>
  )
}