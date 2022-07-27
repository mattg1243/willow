import React from "react";
import { 
    Input, 
    InputGroup,
    InputRightElement,
    Button, 
    FormLabel,
} from '@chakra-ui/react';


export default function PaymentInfoInput(props) {

  return <InputGroup style={{alignItems: 'center'}}>
      <FormLabel style={{width: '100px'}} >{props.fieldLabel}</FormLabel>
      <Input 
        type="text" 
        value={props.stateName} 
        onChange={(e) => { props.stateSetter(e.target.value) }} 
        maxLength='80'
      />
      <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={() => { props.stateSetter('');  }}>
          Clear
          </Button>
      </InputRightElement>
  </InputGroup>

}