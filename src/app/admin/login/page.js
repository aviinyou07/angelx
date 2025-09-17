"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // server sets HTTP-only cookie, no need to store token in localStorage
        localStorage.setItem("adminEmail", email);
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Inline CSS
  const styles = {
    container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" },
    card: { backgroundColor: "#fff", padding: "2rem", borderRadius: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" },
    title: { textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" },
    input: { width: "100%", padding: "0.75rem", marginBottom: "1rem", border: "1px solid #ccc", borderRadius: "0.5rem", outline: "none" },
    button: { width: "100%", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "bold", color: "#fff", backgroundColor: loading ? "#9ca3af" : "#3b82f6", cursor: loading ? "not-allowed" : "pointer", border: "none" },
    error: { color: "red", textAlign: "center", marginTop: "1rem" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" style={styles.button} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
