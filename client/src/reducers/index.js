import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import userReducer from './user';

const persistConfig = {
    key: 'root',
    storage: storageSession,
    setTimeout: 36000
}

const rootReducer = combineReducers({
    user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, userReducer);

export default persistedReducer;