const userReducer = (state =  {}, action) => {
    switch (action.type) {
        case 'login':
            return action.payload;
        case 'getClients':
            return {
                ...state,
                clients: action.payload
            }
        case 'getEvents':
            return {
                ...state,
                events: action.payload
            }
        default:
            return {};
    }
}

export default userReducer;