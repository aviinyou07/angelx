'use client';
import { useEffect, useState } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users'); 
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUser = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  // Filter users based only on fullName or email
  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem', color: '#111' }}>Loading...</p>;
  if (!users.length) return <p style={{ color: '#111' }}>No users found.</p>;

  return (
    <div style={{ padding: 20, color: '#111', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 20 }}>Admin - Users</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: 20,
          padding: '8px 12px',
          width: '100%',
          maxWidth: 400,
          borderRadius: 4,
          border: '1px solid #ccc',
        }}
      />

      {filteredUsers.map(user => (
        <div
          key={user.id}
          onClick={() => toggleUser(user.id)}
          style={{
            marginBottom: 20,
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 8,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
          }}
        >
          <h2>{user.fullName || user.email}</h2>
          <p>Email: {user.email}</p>

          {expandedUser === user.id && (
            <div style={{ marginTop: 15 }}>
              <p>Mobile: {user.mobile || 'N/A'}</p>

              <h3>Wallet</h3>
              <p>Available: {user.wallet?.usdtAvailable ?? 0}</p>
              <p>Deposited: {user.wallet?.usdtDeposited ?? 0}</p>
              <p>Withdrawn: {user.wallet?.usdtWithdrawn ?? 0}</p>

              <h3>Bank Accounts</h3>
              {user.bankCards.length ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
                  <thead style={{ backgroundColor: '#f0f0f0' }}>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: 6 }}>Account No</th>
                      <th style={{ border: '1px solid #ddd', padding: 6 }}>IFSC</th>
                      <th style={{ border: '1px solid #ddd', padding: 6 }}>Payee Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.bankCards.map(b => (
                      <tr key={b.id}>
                        <td style={{ border: '1px solid #ddd', padding: 6 }}>{b.accountNo}</td>
                        <td style={{ border: '1px solid #ddd', padding: 6 }}>{b.ifsc}</td>
                        <td style={{ border: '1px solid #ddd', padding: 6 }}>{b.payeeName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No bank accounts</p>}

              <h3>Transactions</h3>
              {user.transactions.length ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f0f0f0' }}>
                    <tr>
                      <th style={{ border: '1px solid #ddd', padding: 6 }}>Type</th>
                      <th style={{ border: '1px solid #ddd', padding: 6 }}>Amount</th>
                      <th style={{ border: '1px solid #ddd', padding: 6 }}>Status</th>
                      <th style={{ border: '1px solid #ddd', padding: 6 }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.transactions.map(t => (
                      <tr key={t.id}>
                        <td style={{ border: '1px solid #ddd', padding: 6 }}>{t.type}</td>
                        <td style={{ border: '1px solid #ddd', padding: 6 }}>{t.amount}</td>
                        <td style={{ border: '1px solid #ddd', padding: 6 }}>{t.status}</td>
                        <td style={{ border: '1px solid #ddd', padding: 6 }}>{new Date(t.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No transactions</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
