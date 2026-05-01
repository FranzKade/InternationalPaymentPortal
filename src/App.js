import React, { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("register");
  const [message, setMessage] = useState("");

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [amount, setAmount] = useState("");

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/;

    if (!nameRegex.test(registerData.fullName)) {
      setMessage("Full name must contain letters only and be at least 3 characters.");
      return;
    }

    if (!emailRegex.test(registerData.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!passwordRegex.test(registerData.password)) {
      setMessage("Password must be at least 12 characters and include uppercase, lowercase, number and special character.");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Registration successful. Redirecting to login...");

    setTimeout(() => {
      setMessage("");
      setPage("login");
    }, 1500);
  };

  const handleLogin = () => {
    if (isLocked) {
      setMessage("Account locked after 3 failed login attempts. Please go to our nearest branch.");
      return;
    }

    if (!loginEmail) {
      setMessage("Email is required.");
      return;
    }

    if (!loginPassword) {
      setMessage("Password is required.");
      return;
    }
    /*
    if (loginEmail !== registerData.email || loginPassword !== registerData.password) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);

      if (attempts >= 3) {
        setIsLocked(true);
        setMessage("Account locked after 3 failed login attempts. Please go to our nearest branch.");
      } else {
        setMessage(`Invalid login details. Attempt ${attempts} of 3.`);
      }

      return;
    }*/

    setFailedAttempts(0);
    setMessage("Login successful. Redirecting to MFA...");

    setTimeout(() => {
      setMessage("");
      setPage("mfa");
    }, 1500);
  };

  const handleMfaVerify = () => {
    if (!mfaCode) {
      setMessage("Please enter the PIN sent to your email.");
      return;
    }

    if (!/^\d{6}$/.test(mfaCode)) {
      setMessage("PIN must be 6 digits.");
      return;
    }

    setMessage("MFA verification successful. Redirecting to payment...");

    setTimeout(() => {
      setMessage("");
      setPage("payment");
    }, 1500);
  };
const handlePaymentSubmit = () => {
  if (!recipientName) {
    setMessage("Recipient name is required.");
    return;
  }

  if (!accountNumber) {
    setMessage("Account number is required.");
    return;
  }

  if (!/^[0-9]+$/.test(accountNumber)) {
    setMessage("Account number must contain digits only.");
    return;
  }

  if (!swiftCode) {
    setMessage("SWIFT code is required.");
    return;
  }

  if (!/^[A-Z]{8,11}$/.test(swiftCode)) {
    setMessage("SWIFT code must be 8–11 uppercase letters.");
    return;
  }

  if (!amount) {
    setMessage("Amount is required.");
    return;
  }

  if (amount <= 0) {
    setMessage("Amount must be greater than zero.");
    return;
  }

  setMessage("Payment submitted successfully.");

  setTimeout(() => {
    setMessage("");
    setPage("history");
  }, 1500);
};
  return (
    <div className="container">
      <h1>Secure Customer International Payments Portal</h1>

      {page === "register" && (
        <section className="card">
          <h2>Register Customer</h2>

          <form onSubmit={handleRegister}>
            <input type="text" name="fullName" placeholder="Full Name" value={registerData.fullName} onChange={handleRegisterChange} required />
            <input type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} required />
            <input type="password" name="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={registerData.confirmPassword} onChange={handleRegisterChange} required />

            <button type="submit">Register</button>
          </form>

          <p>
            Already registered?{" "}
            <button className="linkButton" onClick={() => setPage("login")}>
              Go to Login
            </button>
          </p>
        </section>
      )}

      {page === "login" && (
        <section className="card">
          <h2>Customer Login</h2>

          <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />

          <button onClick={handleLogin}>Login</button>
        </section>
      )}

      {page === "mfa" && (
        <section className="card">
          <h2>MFA Verification</h2>

          <p>
            A secure one-time PIN has been sent to your registered email address.
            Please enter the PIN below to continue.
          </p>

          <input type="text" placeholder="Enter 6-digit PIN" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} />

          <button onClick={handleMfaVerify}>Verify PIN</button>
        </section>
      )}

     {page === "payment" && (
  <section className="card">
    <h2>International Payment</h2>

    <input
      type="text"
      placeholder="Recipient Name"
      value={recipientName}
      onChange={(e) => setRecipientName(e.target.value)}
    />

    <input
      type="text"
      placeholder="Account Number"
      value={accountNumber}
      onChange={(e) => setAccountNumber(e.target.value)}
    />

    <input
      type="text"
      placeholder="SWIFT Code"
      value={swiftCode}
      onChange={(e) => setSwiftCode(e.target.value)}
    />

    <input
      type="number"
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />

    <button onClick={handlePaymentSubmit}>Submit Payment</button>
  </section>
)}

      {page === "history" && (
        <section className="card">
          <h2>Payment History</h2>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Recipient</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-04-30</td>
                <td>John Smith</td>
                <td>R2500</td>
                <td>Completed</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;