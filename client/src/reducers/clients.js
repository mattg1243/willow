const clientReducer = (state = {}, action) => {
    switch (action.type) {
        case 'populateClients':
            return action.clients;
        default:
            return {};
    }
}

export default clientReducer;