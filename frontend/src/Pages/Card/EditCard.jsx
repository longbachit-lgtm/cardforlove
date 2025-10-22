import React, { useState } from "react";
import axios from "axios";
import { VARIABLE } from "../../Data/variable";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/head-gift.svg";
import LoveDaysPicker from "../../components/LoveDaysPicker";
import YouTubePreview from "../../components/YouTubePreview";

// Dựa vào CardLove.js (bản chuẩn):
// module.exports = mongoose.model("CardLove", {
//   person_one: String,
//   person_two: String,
//   img_person_one: String,
//   img_person_two: String,
//   start_date: Date,
//   url_youtube: String,
//   // Có thể có thêm các field khác, nhưng đây là các trường chính để tạo card mới
// });

const CreateCard = () => {
  const navigate = useNavigate();

  // Thêm trường day_loved cho formData
  const [formData, setFormData] = useState({
    person_one: "",
    person_two: "",
    img_person_one: "",
    img_person_two: "",
    start_date: "",
    url_youtube: "",
    day_loved: 0, // thêm trường day_loved
  });

  const [imgPersonOneFile, setImgPersonOneFile] = useState(null);
  const [imgPersonTwoFile, setImgPersonTwoFile] = useState(null);

  // Youtube
  const handleYoutubeChange = (val) => {
    setFormData((prev) => ({ ...prev, url_youtube: val }));
  };

  // Date (from LoveDaysPicker)
  // Cập nhật ngày yêu và số ngày yêu
  const handleDateChange = (date, daysLoved) => {
    setFormData((prev) => ({
      ...prev,
      start_date: date,
      day_loved: daysLoved,
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      // Limit 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert("File vượt quá 5MB, vui lòng chọn file nhỏ hơn.");
        return;
      }
      if (name === "img_person_one") {
        setImgPersonOneFile(file);
        setFormData((prev) => ({ ...prev, img_person_one: file }));
      }
      if (name === "img_person_two") {
        setImgPersonTwoFile(file);
        setFormData((prev) => ({ ...prev, img_person_two: file }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    console.log('handleChange', formData)
  };

  // Upload image (no auth)
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("image", file);
    const res = await axios.post(`${VARIABLE.url}/upload`, data);
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({ formData })

    try {
      let imgPersonOneUrl = formData.img_person_one;
      let imgPersonTwoUrl = formData.img_person_two;

      // Only upload if local file
      if (imgPersonOneFile) {
        imgPersonOneUrl = await uploadImage(imgPersonOneFile);
      }
      if (imgPersonTwoFile) {
        imgPersonTwoUrl = await uploadImage(imgPersonTwoFile);
      }

      // Dữ liệu đúng chuẩn CardLove, thêm day_loved
      const newCard = {
        person_one: formData.person_one,
        person_two: formData.person_two,
        img_person_one: imgPersonOneUrl,
        img_person_two: imgPersonTwoUrl,
        start_date: formData.start_date,
        url_youtube: formData.url_youtube,
        day_loved: formData.day_loved,
      };

      console.log({ newCard })

      const response = await axios.post(`${VARIABLE.url}/card`, newCard);

      alert("Tạo card thành công!");
      navigate(`/card/${response.data.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Tạo card thất bại");
    }
  };

  // Tính số ngày yêu dựa vào start_date
  const calcDaysLoved = (startDateStr) => {
    if (!startDateStr) return 0;
    // Chuyển "dd-MM-yyyy" thành Date
    const parts = startDateStr.split("-");
    if (parts.length !== 3) return 0;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const startDate = new Date(year, month, day);
    const today = new Date();
    const diff = Math.floor(
      (today.setHours(0,0,0,0) - startDate.setHours(0,0,0,0)) / 86400000
    );
    return diff >= 0 ? diff : 0;
  };

  return (
    <div className="container my-5">
      <div className="card shadow rounded-4 p-4" id="card-love">
        <div className="row ">
          <img src={logo} className="col-4 justify-center mx-auto mb-5" alt="logo" />
        </div>
        <form onSubmit={handleSubmit}>
          {/* Thông tin cá nhân */}
          <div className="row">
            <div className="row">
              <div className="col-3">
                <div className="text-center mb-4">
                  <label htmlFor="img_person_one" style={{ cursor: "pointer" }}>
                    <img
                      src={
                        imgPersonOneFile
                          ? URL.createObjectURL(imgPersonOneFile)
                          : (formData.img_person_one && typeof formData.img_person_one === "string")
                            ? formData.img_person_one
                            : "https://via.placeholder.com/120"
                      }
                      alt="img_person_one"
                      className="rounded-circle shadow"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                  </label>
                  <input
                    type="file"
                    id="img_person_one"
                    name="img_person_one"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control mt-4 love-input"
                    name="person_one"
                    value={formData.person_one}
                    placeholder="Nhập tên bạn"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="col-6">
                {/* Truyền callback nhận ngày và số ngày yêu từ LoveDaysPicker */}
                <LoveDaysPicker
                  onDateChange={(date) => {
                    // Tính daysLoved ở đây
                    const daysLoved = calcDaysLoved(date);
                    setFormData((prev) => ({
                      ...prev,
                      start_date: date,
                      day_loved: daysLoved,
                    }));
                  }}
                />
    
              </div>
              <div className="col-3">
                <div className="text-center mb-4">
                  <label htmlFor="img_person_two" style={{ cursor: "pointer" }}>
                    <img
                      src={
                        imgPersonTwoFile
                          ? URL.createObjectURL(imgPersonTwoFile)
                          : (formData.img_person_two && typeof formData.img_person_two === "string")
                            ? formData.img_person_two
                            : "https://via.placeholder.com/120"
                      }
                      alt="img_person_two"
                      className="rounded-circle shadow"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                  </label>
                  <input
                    type="file"
                    id="img_person_two"
                    name="img_person_two"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control mt-4  love-input"
                    name="person_two"
                    value={formData.person_two}
                    placeholder="Nhập tên người ấy"
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-8">
                <YouTubePreview
                  value={formData.url_youtube}
                  onChange={(val) => {
                    setFormData((prev) => ({ ...prev, url_youtube: val }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-success px-5 mt-5">
              Tạo card mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCard;
