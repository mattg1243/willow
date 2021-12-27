import logo from './logo.svg';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ClientPage from './components/ClientPage';
import './style.css';
import { Center, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);


function App() {
  return (
    <>
      <ChakraProvider>
      <Provider store={store}>
          <Router>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
          </Router>
        </Provider>
      </ChakraProvider>
    </>
  );
}

export default App;
