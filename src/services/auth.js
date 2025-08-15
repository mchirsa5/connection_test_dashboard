const auth = {
    login(username, password) {
      return new Promise(resolve => {
        localStorage.setItem('egatvpptesting', 'password');
        resolve();
      });
    },
    logout() {
      localStorage.removeItem('egatvpptesting');
    },
    isAuthenticated() {
      return localStorage.getItem('egatvpptesting') !== null;
    },
  };
  
  export default auth;
  