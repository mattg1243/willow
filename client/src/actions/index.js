export const loginAction = (user, clients) => {
    return {
        type: 'login',
        payload: user,
    }
}
