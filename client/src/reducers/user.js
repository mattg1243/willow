const userReducer = (state =  {}, action) => {
    switch (action.type) {
        case 'login':
            return action.payload;
        default:
            return {};
    }
}

export default userReducer;