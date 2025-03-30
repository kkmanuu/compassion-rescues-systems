export const storeAuthToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  
  export const clearAuthToken = () => {
    localStorage.removeItem('token');
  };
  
  export const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };