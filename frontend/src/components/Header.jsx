// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

function Header() {
  const { data: user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          MyApp
        </Link>

        {/* Toggle mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          {!accessToken ? (
            <div className="d-flex flex-column flex-lg-row mt-3 mt-lg-0">
              <button
                className="btn btn-outline-light me-lg-2 mb-2 mb-lg-0"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
              <button
                className="btn btn-warning"
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </button>
            </div>
          ) : (
            <div className="nav-item dropdown text-center text-lg-start">
              <img
                src={
                  user && user.avatar
                    ? user.avatar
                    : "https://via.placeholder.com/40"
                }
                alt="avatar"
                className="rounded-circle"
                style={{
                  cursor: "pointer",
                  width: "45px",
                  height: "45px",
                  objectFit: "cover",
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              <ul
                className={`dropdown-menu dropdown-menu-end ${
                  dropdownOpen ? "show" : ""
                }`}
                style={{ right: 0, left: "auto" }}
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/edit-profile"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Chỉnh sửa hồ sơ
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/cards"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Danh sách Card
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/target"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Mục tiêu của tôi
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;