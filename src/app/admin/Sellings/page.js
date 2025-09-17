"use client";
import { useEffect, useState } from "react";

export default function AdminSellingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pending-selling-requests");
      const data = await res.json();
      if (res.ok) setRequests(data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmRequest = async (id) => {
    if (!confirm("Confirm this selling request?")) return;
    try {
      const res = await fetch("/api/admin/confirm-selling-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Selling request confirmed ✅");
        fetchRequests();
      } else alert(data.error);
    } catch (err) {
      console.error(err);
      alert("Error confirming request");
    }
  };

  const rejectRequest = async (id) => {
    if (!confirm("Reject this selling request?")) return;
    try {
      const res = await fetch("/api/admin/reject-selling-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Selling request rejected ❌");
        fetchRequests();
      } else alert(data.error);
    } catch (err) {
      console.error(err);
      alert("Error rejecting request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p style={{ color: "#fff", textAlign: "center" }}>Loading...</p>;
  if (!requests.length) return <p style={{ color: "#fff", textAlign: "center" }}>No pending selling requests 🎉</p>;

  return (
    <div style={{ padding: 20, color: "#fff", fontFamily: "Arial, sans-serif", overflowX: "auto" }}>
      <h1 style={{ marginBottom: 20 ,color:'black'}}>Admin - Pending Selling Requests</h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
          color: "#fff",
        }}
      >
        <thead style={{ backgroundColor: "#111827" }}>
          <tr>
            <th style={{ padding: "10px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "10px", textAlign: "left" }}>User</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Amount</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Account No.</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r, idx) => (
            <tr
              key={r.id}
              style={{
                backgroundColor: idx % 2 === 0 ? "#1f2937" : "#374151",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4b5563")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#1f2937" : "#374151")
              }
            >
              <td style={{ padding: "10px" }}>{r.id}</td>
              <td style={{ padding: "10px" }}>{r.user.email}</td>
              <td style={{ padding: "10px" }}>{r.amount}</td>
              <td style={{ padding: "10px" }}>{r.address}</td>
              <td style={{ padding: "10px" }}>{r.status}</td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => confirmRequest(r.id)}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    marginRight: "6px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  ✅ Confirm
                </button>
                <button
                  onClick={() => rejectRequest(r.id)}
                  style={{
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "6px 10px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  ❌ Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
