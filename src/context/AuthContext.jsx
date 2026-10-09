import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('courier_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Default registered users list with User's custom credentials added!
  const defaultUsers = [
    {
      id: 'usr_pavan',
      name: 'Pavan',
      email: 'pavan@delivey.com',
      password: 'password123',
      role: 'Admin',
      phone: '+91 9876543210'
    },
    {
      id: 'usr_bpava',
      name: 'BPava',
      email: 'bpava@delivey.com',
      password: 'password123',
      role: 'Manager',
      phone: '+91 9123456789'
    },
    {
      id: 'usr_1',
      name: 'Admin User',
      email: 'admin@delivey.com',
      password: 'password123',
      role: 'Admin',
      phone: '+91 9876543210'
    },
    {
      id: 'usr_2',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'Customer',
      phone: '+91 9123456789'
    }
  ];

  // Initialize stored registered users in LocalStorage
  useEffect(() => {
    const existing = localStorage.getItem('courier_registered_users');
    if (!existing) {
      localStorage.setItem('courier_registered_users', JSON.stringify(defaultUsers));
    } else {
      // Ensure Pavan credentials exist in stored list
      try {
        const parsed = JSON.parse(existing);
        const hasPavan = parsed.some((u) => u.email.toLowerCase() === 'pavan@delivey.com' || u.email.toLowerCase() === 'bpava@delivey.com');
        if (!hasPavan) {
          const merged = [...defaultUsers, ...parsed];
          localStorage.setItem('courier_registered_users', JSON.stringify(merged));
        }
      } catch (e) {
        localStorage.setItem('courier_registered_users', JSON.stringify(defaultUsers));
      }
    }
  }, []);

  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem('courier_registered_users');
      return stored ? JSON.parse(stored) : defaultUsers;
    } catch {
      return defaultUsers;
    }
  };

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getRegisteredUsers();
        const foundUser = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (foundUser) {
          const sessionUser = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role || 'Customer',
            phone: foundUser.phone || '',
            loginTime: new Date().toISOString()
          };

          setUser(sessionUser);
          localStorage.setItem('courier_user', JSON.stringify(sessionUser));
          setLoading(false);
          resolve({ success: true, user: sessionUser });
        } else {
          setLoading(false);
          reject(new Error('Invalid email or password. Try pavan@delivey.com / password123'));
        }
      }, 500);
    });
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getRegisteredUsers();
        const exists = users.some(
          (u) => u.email.toLowerCase() === userData.email.toLowerCase()
        );

        if (exists) {
          setLoading(false);
          reject(new Error('An account with this email already exists.'));
          return;
        }

        const newUser = {
          id: 'usr_' + Date.now(),
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone || '',
          role: 'Customer'
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('courier_registered_users', JSON.stringify(updatedUsers));

        const sessionUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          loginTime: new Date().toISOString()
        };

        setUser(sessionUser);
        localStorage.setItem('courier_user', JSON.stringify(sessionUser));
        setLoading(false);
        resolve({ success: true, user: sessionUser });
      }, 600);
    });
  };

  // Reset Password simulation
  const resetPassword = async (email, newPassword) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getRegisteredUsers();
        const userIndex = users.findIndex(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (userIndex === -1) {
          setLoading(false);
          reject(new Error('No account found with this email address.'));
          return;
        }

        users[userIndex].password = newPassword;
        localStorage.setItem('courier_registered_users', JSON.stringify(users));
        setLoading(false);
        resolve({ success: true, message: 'Password has been reset successfully!' });
      }, 500);
    });
  };

  // Update User Profile state
  const updateUserProfile = (updatedFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem('courier_user', JSON.stringify(updatedUser));

    // Also update registered users cache if found
    try {
      const users = getRegisteredUsers();
      const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updatedFields };
        localStorage.setItem('courier_registered_users', JSON.stringify(users));
      }
    } catch (e) {
      console.error('Failed to update registered users cache', e);
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('courier_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        resetPassword,
        updateUserProfile,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
