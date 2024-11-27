export const getUserData = () => {
    const savedUser = localStorage.getItem('user');
    return savedUser
      ? JSON.parse(savedUser)
      : {
          displayName: 'John Doe',
          email: 'johndoe@example.com',
          profilePicture: null,
        };
  };
  
  export const setUserData = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };