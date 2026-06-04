import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      alert("Login Successful!");

      navigate("/");
    } catch (error) {
      alert("Invalid Email or Password");
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
        }}
      >
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;