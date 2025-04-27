"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token from localStorage:', token ? 'Found' : 'Not found');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/login');
          return;
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/users`;
        console.log('Fetching users from:', apiUrl);

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
        
        console.log('Request headers:', headers);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: headers,
          credentials: 'include'
        });

        if (response.status === 401) {
          console.log('Unauthorized access - redirecting to login');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
      }
    };

    fetchUsers();
  }, [router]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      {users.length > 0 ? (
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user._id} className="border p-2 rounded">
              {user.email} - {user.role}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading users...</p>
      )}
    </div>
  );
}
