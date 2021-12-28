import logo from './logo.svg';
import Login from './components/Login';
import ClientPage from './components/ClientPage';
import ClientTable from './components/ClientTable';
import './style.css';
import { Center, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import Base from './components/Base';

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

function App() {
  return (
    <>
      <ChakraProvider>
      <Provider store={store}>
          <Router>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/dashboard' element={<Base />} />
            </Routes>
          </Router>
        </Provider>
      </ChakraProvider>
    </>
  );
}

export default App;
