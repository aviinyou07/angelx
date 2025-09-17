'use client';
import { useEffect, useState } from 'react';

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/admin/pending-deposits');
      const data = await res.json();
      if (res.ok) setDeposits(data.deposits);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const confirmDeposit = async (id) => {
    if (!confirm('Are you sure you want to confirm this deposit?')) return;
    try {
      const res = await fetch('/api/admin/confirm-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Deposit confirmed ✅');
        fetchDeposits();
      } else {
        alert(data.error || 'Failed to confirm deposit');
      }
    } catch (err) {
      console.error(err);
      alert('Error confirming deposit');
    }
  };

  return (
    <div style={{ padding: 20, color: '#111', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 20 }}>Admin - Pending Deposits</h1>
      {loading ? (
        <p>Loading...</p>
      ) : deposits.length === 0 ? (
        <p>No pending deposits 🎉</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
            color: '#111',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
              <th>ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Network</th>
              <th>Txid</th>
              <th>Deposit ID</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((d) => (
              <tr key={d.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{d.id}</td>
                <td>{d.user?.email}</td>
                <td>{d.amount}</td>
                <td>{d.network}</td>
                <td>{d.txnId || 'N/A'}</td>
                <td>{d.depositId}</td>
                <td>{new Date(d.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => confirmDeposit(d.id)}
                    style={{
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    ✅ Confirm
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
