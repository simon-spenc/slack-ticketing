import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', currentUser.email)));
    const organizationId = userDoc.docs[0].data().organizationId;

    const q = query(collection(db, 'users'), where('organizationId', '==', organizationId));
    const querySnapshot = await getDocs(q);
    setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No authenticated user');

      const userDoc = await getDocs(doc(db, 'users', currentUser.uid));
      const organizationId = userDoc.data().organizationId;

      await addDoc(collection(db, 'users'), {
        email: newUserEmail,
        organizationId: organizationId,
        role: 'member',
        firstName: '',
        lastName: '',
        photoURL: '',
        createdAt: new Date()
      });

      setNewUserEmail('');
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  const removeUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={addUser}>
        <input
          type="email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="New User Email"
          required
        />
        <button type="submit">Add User</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Profile Picture</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.firstName || 'N/A'}</td>
              <td>{user.lastName || 'N/A'}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" style={{width: '50px', height: '50px', borderRadius: '50%'}} />
                ) : (
                  'No photo'
                )}
              </td>
              <td>
                {user.role !== 'admin' && (
                  <button onClick={() => removeUser(user.id)}>Remove</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;