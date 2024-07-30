import React, { useState, useEffect, useContext } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { AuthContext } from '../Contexts/AuthContext';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', photoURL: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      let updatedProfile = { ...profile };

      if (file) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        updatedProfile.photoURL = photoURL;
      }

      await updateDoc(userRef, updatedProfile);
      setProfile(updatedProfile);
      setFile(null);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          value={profile.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastName"
          value={profile.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          type="file"
          onChange={handleFileChange}
        />
        {profile.photoURL && <img src={profile.photoURL} alt="Profile" width="100" />}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;