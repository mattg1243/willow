import logo from './logo.svg';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ClientPage from './components/ClientPage';
import './style.css';
import { Center, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


function App() {
  return (
    <>
      <ChakraProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='dashboard' element={<Dashboard />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
