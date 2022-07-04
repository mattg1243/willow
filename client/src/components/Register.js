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
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAction } from '../actions';
import BadInputAlert from './BadInputAlert';
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

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const registerUser = () => {
        axios.post("/user/register/newuser", {
            fname: fname, lname: lname, email: email, username: username,
            password: password, passwordConfirm: passwordConfirm, nameForHeader: nameForHeader, phone: phone,
            street: street, city: city, state: state, zip: zip,
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
                        <Input className="textInput" placeholder="First Name" type="text" size='lg' focusBorderColor="#03b126" onChange={(e) => {setFname(e.target.value);}}/>
                        <Input className="textInput" placeholder="Last Name" type="text" size='lg' focusBorderColor="#03b126" onChange={(e) => {setLname(e.target.value);}}/>
                    </InputGroup>
                    <InputGroup>
                        <Input className="textInput" placeholder="Email" type="email" size='lg' focusBorderColor="#03b126" onChange={(e) => {setEmail(e.target.value);}}/>
                        <Input className="textInput" placeholder="Username" type="text" size='lg' focusBorderColor="#03b126" onChange={(e) => {setUsername(e.target.value);}}/>
                    </InputGroup>
                    <InputGroup>
                        <Input className="textInput" placeholder="Password" type="password" size='lg' focusBorderColor="#03b126" onChange={(e) => {setPassword(e.target.value);}}/>
                        <Input className="textInput" placeholder="Confirm Password" type="password" size='lg' focusBorderColor="#03b126" onChange={(e) => {setPasswordConfirm(e.target.value);}}/>
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
                        <Input className="textInput" placeholder="Name to appear on statements" type="email" size='lg' focusBorderColor="#03b126" onChange={(e) => {setNameForHeader(e.target.value);}}/>
                        <Input className="textInput" placeholder="Phone Number" type="text" size='lg' focusBorderColor="#03b126" onChange={(e) => {setPhone(e.target.value);}}/>
                    <InputGroup>
                        <Input className="textInput" placeholder="Street" type="text" size='lg' focusBorderColor="#03b126" onChange={(e) => {setStreet(e.target.value);}}/>
                        <Input className="textInput" placeholder="City" type="text" size='lg' focusBorderColor="#03b126" onChange={(e) => {setCity(e.target.value);}}/>
                    </InputGroup>
                    <InputGroup>
                        <Input className="textInput" placeholder="State" type="text" size='lg' focusBorderColor="#03b126" onChange={(e) => {setState(e.target.value);}}/>
                        <Input className="textInput" placeholder="Zip" type="number" size='lg' focusBorderColor="#03b126" onChange={(e) => {setZip(e.target.value);}}/>
                    </InputGroup>
                    <Button background="#63326E" color="#fff" onClick={() => { registerUser(); }}>Register</Button>
                </VStack>
            </Container>
        </>
    )
}