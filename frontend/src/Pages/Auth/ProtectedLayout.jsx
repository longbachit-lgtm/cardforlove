import { Outlet, Navigate } from "react-router-dom";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { VARIABLE } from "../../Data/variable";
import { setUser } from "../../store/userSlice";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
export default function ProtectedLayout() {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const { data: user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true); // trạng thái load dữ liệu user

  const isTokenValid = (token) => {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const now = Math.floor(Date.now() / 1000);
      return decodedPayload.exp > now;
    } catch {
      return false;
    }
  };

  // Nếu không có token hoặc token hết hạn → redirect login
  if (!accessToken || !isTokenValid(accessToken)) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userLogin = localStorage.getItem("userLogin");
        const res = await axiosInstance.get(`/user/${userLogin}`);
        console.log({ res });
        dispatch(setUser(res.data.user));
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.error("Lỗi khi lấy thông tin user:", err);
        window.location.href = "/login";
      } finally {
        setLoading(false); // Dù thành công hay lỗi cũng tắt loading
      }
    };

    if (!user) {
      fetchUserData();
    } else {
      setLoading(false); // đã có user thì bỏ loading
    }
  }, [dispatch, user]);

  // Khi đang load dữ liệu → hiển thị loading cho toàn bộ trang
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}
