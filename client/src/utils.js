import { TOKEN_LIFE } from './config'

export const runLogoutTimer = () => {
  setTimeout(() => {
    window.sessionStorage.removeItem('persist:root');
    window.location.href = '/?expired=true';
  }, TOKEN_LIFE);
}