import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { VARIABLE } from "../../Data/variable";

function Register() {
  const navigation = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      setSuccessMsg("");
      return;
    }

    try {
      const response = await axios.post(`${VARIABLE.url}/auth/register`, {
        username,
        password,
      });
      if (response) {
        setSuccessMsg("Đăng ký thành công!");
        setErrorMsg("");
        setTimeout(() => navigation("/login"), 2000);
      }
    } catch (error) {
      setErrorMsg("Đăng ký thất bại. Tài khoản có thể đã tồn tại.");
      setSuccessMsg("");
    }
  };

  return (
    <div className="container mt-5" style={{ minWidth: "400px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h4 className="card-title mb-4 text-center">Đăng ký tài khoản</h4>
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          {successMsg && (
            <div className="alert alert-success">{successMsg}</div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-3 text-start">
              <label className="form-label">Tài khoản</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Đăng ký
              </button>
            </div>
            <div className="text-center mt-2">
              <NavLink to="/login"> Quay lại trang đăng nhập</NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
