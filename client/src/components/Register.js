import { React, useState } from 'react';
import { 
    VStack, 
    HStack, 
    Container, 
    Input, 
    InputGroup, 
    Button, 
    Tooltip, 
    Divider, 
    FormLabel,
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAction } from '../actions';
import BadInputAlert from './BadInputAlert';
import PaymentInfoInput from './PaymentInfoInput';
import axios from 'axios';

export default function Register() {
    // states for text fields
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [nameForHeader, setNameForHeader] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [badInput, setBadInput] = useState(false);
    const [errMsg, setErrMsg] = useState([])
    const [checkField, setCheckField] = useState("")
    const [venmoField, setVenmoField] = useState("")
    const [paypalField, setPaypalField] = useState("")
    const [zelleField, setZelleField] = useState("")

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const registerUser = () => {
        axios.post("/user/register/newuser", {
            fname: fname, lname: lname, email: email, username: username,
            password: password, passwordConfirm: passwordConfirm, nameForHeader: nameForHeader, phone: phone,
            street: street, city: city, state: state, zip: zip, 
            paymentInfo: {
                check: checkField,
                venmo: venmoField,
                paypal: paypalField,
                zelle: zelleField
            }
        }) 
        .then((response) => {       
            if (response.data) {
                dispatch(loginAction(response.data));
                setTimeout(() => {navigate('/clients')}, 1000);
            }
        })
        .catch(err => {
            console.error(err);
            // check for invalid characters
            if (err.response.status === 422) {
                setErrMsg(err.response.data);
                setBadInput(true);
            }
        })
    }

    return (
        <>
            <Container style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <VStack spacing={5}>
                    <h3>User Info</h3>
                   {badInput ? 
                   errMsg.map(err => (
                       <BadInputAlert errMsg={err.msg} />
                   )) : <></>}
                    <InputGroup>
                        <Input className="textInput" placeholder="First Name" type="text" size='lg' focusBorderColor="brand.green" onChange={(e) => {setFname(e.target.value);}}/>
                        <Input className="textInput" placeholder="Last Name" type="text" size='lg' focusBorderColor="brand.green" onChange={(e) => {setLname(e.target.value);}}/>
                    </InputGroup>
                    <InputGroup>
                        <Input className="textInput" placeholder="Email" type="email" size='lg' focusBorderColor="brand.green" onChange={(e) => {setEmail(e.target.value);}}/>
                        <Input className="textInput" placeholder="Username" type="text" size='lg' focusBorderColor="brand.green" onChange={(e) => {setUsername(e.target.value);}}/>
                    </InputGroup>
                    <InputGroup>
                        <Input className="textInput" placeholder="Password" type="password" size='lg' focusBorderColor="brand.green" onChange={(e) => {setPassword(e.target.value);}}/>
                        <Input className="textInput" placeholder="Confirm Password" type="password" size='lg' focusBorderColor="brand.green" onChange={(e) => {setPasswordConfirm(e.target.value);}}/>
                    </InputGroup>
                    <Divider orientation="horizontal"/>
                    <HStack style={{justifyContent: 'center'}}>
                        <h3>Info for Statement Header</h3>
                            <Tooltip label="This information will be included in the header of all statements.
                            If you would like your name to appear with a title or as anything else than provided in the previous form,
                            enter it here.">
                                <QuestionIcon/>
                            </Tooltip> 
                    </HStack>
                    <InputGroup>
                    </InputGroup>
                        <Input className="textInput" placeholder="Name to appear on statements" type="email" size='lg' focusBorderColor="brand.green" onChange={(e) => {setNameForHeader(e.target.value);}}/>
                        <Input className="textInput" placeholder="Phone Number" type="text" size='lg' focusBorderColor="brand.green" onChange={(e) => {setPhone(e.target.value);}}/>
                    <InputGroup>
                        <Input className="textInput" placeholder="Street" type="text" size='lg' focusBorderColor="brand.green" onChange={(e) => {setStreet(e.target.value);}}/>
                        <Input className="textInput" placeholder="City" type="text" size='lg' focusBorderColor="brand.green" onChange={(e) => {setCity(e.target.value);}}/>
                    </InputGroup>
                    <InputGroup>
                        <Input className="textInput" placeholder="State" type="text" size='lg' focusBorderColor="brand.green" onChange={(e) => {setState(e.target.value);}}/>
                        <Input className="textInput" placeholder="Zip" type="number" size='lg' focusBorderColor="brand.green" onChange={(e) => {setZip(e.target.value);}}/>
                    </InputGroup>
                    <Tooltip 
                    label="This will tell your clients how you'd like to receive payment. 
                        It will show on the bottom of statements, but is not required (limited to 80 characters)."
                        >
                    <FormLabel>Payment Info <QuestionIcon style={{color: 'grey'}}/></FormLabel>
                </Tooltip>
                {/* payment info fields */}
                <PaymentInfoInput fieldLabel="Check" stateName={checkField} stateSetter={setCheckField} />
                <PaymentInfoInput fieldLabel="Venmo" stateName={venmoField} stateSetter={setVenmoField} />
                <PaymentInfoInput fieldLabel="PayPal" stateName={paypalField} stateSetter={setPaypalField} />
                <PaymentInfoInput fieldLabel="Zelle  " stateName={zelleField} stateSetter={setZelleField} />
                {/* buttons */}
                    <Button background="#63326E" color="#fff" onClick={() => { registerUser(); }}>Register</Button>
                </VStack>
            </Container>
        </>
    )
}