"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDepositsPage from "../deposits/page";
import AdminSellingRequests from "../Sellings/page";
import Users from "../Users/Page";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [adminEmail, setAdminEmail] = useState("Admin");

  // ✅ Check cookie-based session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/check-session");
        if (!res.ok) {
          router.replace("/admin/login");
          return;
        }
        const data = await res.json();
        setAdminEmail(data.email || "Admin");
        setLoading(false);
      } catch (err) {
        router.replace("/admin/login");
      }
    };
    checkSession();
  }, [router]);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      router.replace("/admin/login");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "5rem" }}>Loading...</p>;

  // --- Styles ---
  const containerStyle = { display: "flex", minHeight: "100vh", backgroundColor: "#f3f4f6" };
  const sidebarStyle = { width: "220px", backgroundColor: "#1f2937", color: "#fff", display: "flex", flexDirection: "column", padding: "1rem" };
  const sidebarItemStyle = (active) => ({
    padding: "0.75rem 1rem",
    cursor: "pointer",
    borderRadius: "0.5rem",
    marginBottom: "0.5rem",
    backgroundColor: active ? "#2563eb" : "#374151",
  });
  const mainStyle = { flex: 1, padding: "2rem" };
  const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" };
  const welcomeStyle = { fontSize: "1.5rem", fontWeight: "bold" };
  const logoutBtnStyle = { padding: "0.5rem 1rem", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "0.5rem", cursor: "pointer" };
  const cardStyle = { backgroundColor: "#fff", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", marginBottom: "1rem" };

  // --- Render content based on activePage ---
  const renderContent = () => {
    if (activePage === "dashboard") {
      return (
        <>
          <div style={cardStyle}>
            <h3 style={{ marginBottom: "1rem" }}>Pending Deposits</h3>
            <AdminDepositsPage />
          </div>
          <div style={cardStyle}>
            <h3 style={{ marginBottom: "1rem" }}>Pending Selling Requests</h3>
            <AdminSellingRequests />
          </div>
        </>
      );
    }
    if (activePage === "users") {
      return (
        <div style={cardStyle}>
          <h3>Users</h3>
          <Users />
        </div>
      );
    }
    if (activePage === "settings") {
      return (
        <div style={cardStyle}>
          <h3>Settings</h3>
          <p>Admin settings can be configured here.</p>
        </div>
      );
    }
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Admin Panel</h2>
        <div style={sidebarItemStyle(activePage === "dashboard")} onClick={() => setActivePage("dashboard")}>Dashboard</div>
        <div style={sidebarItemStyle(activePage === "users")} onClick={() => setActivePage("users")}>Users</div>
        <div style={sidebarItemStyle(activePage === "settings")} onClick={() => setActivePage("settings")}>Settings</div>
        <button style={{ ...logoutBtnStyle, marginTop: "auto" }} onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={mainStyle}>
        <div style={headerStyle}>
          <span style={welcomeStyle}>Welcome, {adminEmail}</span>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
