const userReducer = (state =  {}, action) => {
    switch (action.type) {
        case 'login':
            return action.user;
        default:
            return {};
    }
}

export default userReducer;