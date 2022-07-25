import Login from './components/Login';
import ClientPage from './components/ClientPage';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import Splash from './components/Splash';
import ProtectedRoute from './components/ProtectedRoute';
import { theme } from './theme';
import './style.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import persistedReducer from './reducers';


const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

const persistor = persistStore(store);

function App() {

  return (
    <>
      <ChakraProvider theme={theme}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Router>
              <Routes>
                <Route path='/home' element={<Splash />} />
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/resetpassword/:token/:username' element={<ResetPassword />} />
                {/* All routes below are priveleged and need to be wrapped in a PrivateRoutes component */}
                <Route path='/profile' element={<ProtectedRoute component={Profile} />} />
                <Route path='/clients' element={<ProtectedRoute component={Dashboard} />} />
                <Route path='/client-archive' element={<ProtectedRoute archiveMode={true} component={Dashboard} />} />
                <Route path='/client/:id' element={<ProtectedRoute component={ClientPage} />} />
              </Routes>
            </Router>
          </PersistGate>
        </Provider>
      </ChakraProvider>
    </>
  );
}

export default App;
