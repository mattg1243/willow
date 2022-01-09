import Login from './components/Login';
import ClientPage from './components/ClientPage';
import Register from './components/Register';
import './style.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import persistedReducer from './reducers';
import Dashboard from './components/Dashboard';

const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

const persistor = persistStore(store);

function App() {

  return (
    <>
      <ChakraProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
          <Router>
              <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/clients' element={<Dashboard />} />
                <Route path='/client/:id' element={<ClientPage />} />
              </Routes>
          </Router>
          </PersistGate>
        </Provider>
      </ChakraProvider>
    </>
  );
}

export default App;
