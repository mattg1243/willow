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
      <AlertDescription>
        {props.errMsg}
      </AlertDescription>
    </Alert>
  )
}