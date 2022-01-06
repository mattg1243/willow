export const loginAction = (user) => {
    return {
        type: 'login',
        payload: user,
    }
}

export const getClients = (clients) => {
    return {
        type: 'getClients',
        payload: clients,
    }
}

export const getEvents = (events) => {
    return {
        type: 'getClients',
        payload: events,
    }
}