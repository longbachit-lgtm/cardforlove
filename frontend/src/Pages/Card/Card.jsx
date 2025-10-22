import React, { useEffect } from "react";
import { VARIABLE } from "../../Data/variable";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/userSlice";
import axios from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userLogin = localStorage.getItem("userLogin");

        const res = await axios.get(`${VARIABLE.url}/user/${userLogin}`, {
          headers: {
            x_authorization: `${token}`,
          },
        });

        dispatch(setUser(res.data.user)); // gán dữ liệu user từ server
      } catch (err) {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          localStorage.removeItem("accessToken");
        }

        console.error("Lỗi khi lấy thông tin user:", err);
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <div className="container my-5">
      <div className="card shadow rounded-4 p-4">
        <h2 className="text-center mb-4">Hồ sơ sức khỏe của tôi</h2>

        {/* Thông tin cá nhân */}
        <div className="row mb-4">
          <div className="col-md-6">
            <p>
              <strong>Họ tên:</strong> {user && user.fullname}
            </p>
            <p>
              <strong>Tuổi:</strong> {user && user.age}
            </p>
            <p>
              <strong>Chiều cao:</strong> {user && user.height}
            </p>
            <p>
              <strong>Cân nặng trước:</strong> {user && user.weightBefore}kg
            </p>
            <p>
              <strong>Cân nặng hiện tại:</strong> {user && user.weightAfter}kg
            </p>
          </div>
          <div className="col-md-6 text-center">
            <p>
              <strong>Chỉ số BMI:</strong> {user && user.bmi}(Bình thường)
            </p>
            <p>
              <strong>Thời gian thay đổi:</strong> {user && user.duration}
            </p>
          </div>
        </div>

        {/* Hình ảnh trước và sau */}
        <div className="row text-center mb-4">
          <div className="col-md-6">
            <h5>Trước</h5>
            <img
              src={user && user.beforeImg}
              alt="Trước thay đổi"
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-6">
            <h5>Sau</h5>
            <img
              src={user && user.afterImg}
              alt="Sau thay đổi"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>

        {/* Câu chuyện thay đổi */}
        <div className="mb-4">
          <h4>Hành trình thay đổi</h4>
          <p>
            Trong vòng 3 tháng, tôi đã thay đổi lối sống: tập gym đều đặn, ăn
            uống lành mạnh, và giữ vững tinh thần. Nhờ vậy, tôi giảm được 10kg,
            cải thiện sức bền, và cảm thấy tự tin hơn mỗi ngày.
          </p>
        </div>

        {/* Nút hành động */}
        <div className="text-center">
          <button className="btn btn-success me-2">Chia sẻ kết quả</button>
          <button className="btn btn-secondary">Tải về ảnh so sánh</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
