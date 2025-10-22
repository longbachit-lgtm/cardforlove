// src/pages/WeightControlGoals.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { VARIABLE } from "../../Data/variable";

export default function Target() {
  const token = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);
  const { data: user } = useSelector((state) => state.user);
  const [goals, setGoals] = useState({
    steps: 8000,
    targetWeight: "",
    targetCalories: 300,
    sleepHours: 8,
    finishMonths: 3,
  });
  const [tracking, setTracking] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${VARIABLE.url}/target/${user.username}`, {
          headers: { x_authorization: token },
        });
        if (res.data?.goals) setGoals(res.data.goals);
        if (res.data?.tracking) {
          setTracking(res.data.tracking);
        }
      } catch (err) {
        console.error("Fetch goals error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleGoalChange = (field, value) => {
    setGoals((g) => ({ ...g, [field]: value }));
  };

  const handleTrackingChange = (index, field, value) => {
    setTracking((arr) => {
      const newArr = [...arr];
      newArr[index] = { ...newArr[index], [field]: value };
      return newArr;
    });
  };

  const addTrackingRow = () => {
    setTracking((arr) => [
      {
        date: dayjs(new Date()).format("DD-MM-YYYY"),
        weight: "",
        fat: "",
        bone: "",
        water: "",
        muscle: "",
        balanceIndex: "",
        rmr: "",
        bioAge: "",
        visceralFat: "",
        waist: "",
      },
      ...arr,
    ]);
  };

  const removeTrackingRow = (idx) => {
    setTracking((arr) => arr.filter((_, i) => i !== idx));
  };

  const saveGoals = async (e) => {
    e?.preventDefault();
    try {
      await axios.put(
        `${VARIABLE.url}/target/${user.username}`,
        { goals, tracking },
        {
          headers: { x_authorization: token, Authorization: `Bearer ${token}` },
        }
      );
      alert("Lưu mục tiêu thành công");
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại");
    }
  };

  if (loading) return <div className="container py-4">Đang tải...</div>;

  return (
    <div className="container py-4">
      {/* Avatar + tên */}
      <div className="card mb-4 shadow-sm text-center p-3">
        <img
          src={(user && user.avatar) || "https://via.placeholder.com/80"}
          alt="avatar"
          className="rounded-circle mx-auto mb-2"
          style={{ width: 80, height: 80, objectFit: "cover" }}
        />
        <h5 className="mb-0">{(user && user.fullname) || "Người dùng"}</h5>
        <small className="text-muted">Cập nhật mục tiêu kiểm soát cân nặng</small>
      </div>

      {/* Form mục tiêu */}
      <form onSubmit={saveGoals} className="card p-3 mb-4 shadow-sm">
        <h5 className="mb-3">
          <i className="bi bi-flag-fill me-2"></i>Mục tiêu của tôi
        </h5>
        <div className="row g-3">
          {/* Responsive inputs */}
          <div className="col-12 col-md-4">
            <label className="form-label">Số bước mục tiêu</label>
            <input
              className="form-control"
              type="number"
              value={goals.steps}
              onChange={(e) => handleGoalChange("steps", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Cân nặng mục tiêu (kg)</label>
            <input
              className="form-control"
              type="number"
              value={goals.targetWeight}
              onChange={(e) => handleGoalChange("targetWeight", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Thời gian hoàn thành (tháng)</label>
            <input
              className="form-control"
              type="number"
              value={goals.finishMonths}
              onChange={(e) => handleGoalChange("finishMonths", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Calo mục tiêu</label>
            <input
              className="form-control"
              type="number"
              value={goals.targetCalories}
              onChange={(e) =>
                handleGoalChange("targetCalories", e.target.value)
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Giờ ngủ mục tiêu</label>
            <input
              className="form-control"
              type="number"
              value={goals.sleepHours}
              onChange={(e) => handleGoalChange("sleepHours", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <button type="submit" className="btn btn-success">
            <i className="bi bi-save2 me-1"></i> Lưu mục tiêu
          </button>
        </div>
      </form>

      {/* Bảng theo dõi */}
      <div className="card p-3 shadow-sm">
        <h5 className="mb-3">
          <i className="bi bi-clipboard-data-fill me-2"></i>Bảng theo dõi
        </h5>

        {/* Desktop: Table */}
        <div className="d-none d-md-block table-responsive">
          <table className="table table-bordered table-sm align-middle">
            <thead className="table-light">
              <tr>
                <th>Ngày</th>
                <th>Cân nặng</th>
                <th>Mỡ (%)</th>
                <th>Xương</th>
                <th>Nước (%)</th>
                <th>Cơ</th>
                <th>Cân đối</th>
                <th>RMR</th>
                <th>Tuổi sinh học</th>
                <th>Mỡ nội tạng</th>
                <th>Vòng eo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tracking.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <DatePicker
                      onChange={(date) =>
                        handleTrackingChange(
                          idx,
                          "date",
                          dayjs(date).format("DD-MM-YYYY")
                        )
                      }
                      className="form-control form-control-sm"
                      value={row.date || ""}
                    />
                  </td>
                  {["weight", "fat", "bone", "water", "muscle", "balanceIndex", "rmr", "bioAge", "visceralFat", "waist"].map((f) => (
                    <td key={f}>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={row[f] || ""}
                        onChange={(e) =>
                          handleTrackingChange(idx, f, e.target.value)
                        }
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeTrackingRow(idx)}
                      type="button"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card View */}
        <div className="d-block d-md-none">
          {tracking.map((row, idx) => (
            <div key={idx} className="card mb-3 p-2 shadow-sm">
              <div className="d-flex justify-content-between">
                <strong>{row.date}</strong>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeTrackingRow(idx)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <div className="row g-2 mt-2">
                {[
                  ["Cân nặng", "weight", "kg"],
                  ["Mỡ", "fat", "%"],
                  ["Xương", "bone", ""],
                  ["Nước", "water", "%"],
                  ["Cơ", "muscle", ""],
                  ["Cân đối", "balanceIndex", ""],
                  ["RMR", "rmr", ""],
                  ["Tuổi sinh học", "bioAge", ""],
                  ["Mỡ nội tạng", "visceralFat", ""],
                  ["Vòng eo", "waist", "cm"],
                ].map(([label, field, unit]) => (
                  <div key={field} className="col-6">
                    <label className="form-label small">{label}</label>
                    <div className="input-group input-group-sm">
                      <input
                        type="number"
                        className="form-control"
                        value={row[field] || ""}
                        onChange={(e) =>
                          handleTrackingChange(idx, field, e.target.value)
                        }
                      />
                      {unit && <span className="input-group-text">{unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={addTrackingRow}>
            <i className="bi bi-plus-circle me-1"></i> Thêm dòng
          </button>
          <button className="btn btn-success ms-auto" onClick={saveGoals}>
            <i className="bi bi-cloud-arrow-up me-1"></i> Lưu tất cả
          </button>
        </div>
      </div>
    </div>
  );
}
