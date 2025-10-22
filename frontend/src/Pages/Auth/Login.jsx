import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { VARIABLE } from "../../Data/variable";

function Login() {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    setError("");

    try {
      const res = await axios.post(`${VARIABLE.url}/auth/login`, formData);

      if (res.status === 200) {
        setMessage("✅ " + res.data.msg);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("userLogin", res.data.userLogin);
        navigation("/profile");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Đăng nhập thất bại!");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="row shadow rounded-4 overflow-hidden bg-white w-100" style={{ maxWidth: "900px" }}>
        {/* Left: Login Form */}
        <div className="col-12 col-md-6 p-4 p-md-5">
          <h2 className="fw-bold mb-4 text-center text-md-start">Signin</h2>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="username"
                className="form-control form-control-lg"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                className="form-control form-control-lg"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-success btn-lg w-100 mb-3">
              Signin
            </button>

            <div className="text-center text-muted mb-2">or signin with</div>
            <div className="d-flex justify-content-center gap-3">
              <i className="fab fa-facebook fa-lg text-primary"></i>
              <i className="fab fa-google fa-lg text-danger"></i>
              <i className="fab fa-linkedin fa-lg text-info"></i>
            </div>
          </form>
          <p className="text-danger mt-3">{message}</p>
        </div>

        {/* Right: Welcome message */}
        <div className="col-12 col-md-6 bg-success text-white d-flex flex-column justify-content-center align-items-center p-4 p-md-5">
          <h3 className="mb-3 text-center text-md-start">Welcome back!</h3>
          <p className="text-center mb-4">
            We are so happy to have you here. It's great to see you again. We
            hope you had a safe and enjoyable time away.
          </p>
          <NavLink className="text-dark" to="/register">
            <button className="btn btn-outline-light rounded-pill px-4">
              No account yet? Signup.
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Login;