import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

const SignUp = () => {
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Generate a unique organizationID
      const organizationId = uuidv4();

      // Create organization
      const orgRef = doc(db, 'organizations', organizationId);
      await setDoc(orgRef, {
        id: organizationId,
        name: orgName,
        createdAt: new Date(),
        ownerId: user.uid
      });

      // Create user profile
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        organizationId: organizationId,
        organizationName: orgName,
        role: 'admin',
        firstName: '',
        lastName: '',
        photoURL: '',
        createdAt: new Date()
      });

      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Create a New Horizon Account</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Organization Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;