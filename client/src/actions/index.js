export const loginAction = (user) => {
    return {
        type: 'login',
        user: user,
    }
}

export const clientsAction = (clients) => {
    return {
        type: 'populateClients',
        clients: clients,
    }
}