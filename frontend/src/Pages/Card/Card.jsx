import React, { useState, useEffect } from "react";
import axios from "axios";
import { VARIABLE } from "../../Data/variable";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../../assets/img/head-gift.svg";
import YouTubePreview from "../../components/YouTubePreview";
import { differenceInCalendarDays, format, parse, startOfDay } from "date-fns";

const Card = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await axios.get(`${VARIABLE.url}/card/${id}`);
        setCard(res.data.data);
      } catch (err) {
        console.error("Error fetching card:", err);
        setError("Không thể tải card. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCard();
    } else {
      setError("Không tìm thấy ID card");
      setLoading(false);
    }
  }, [id]);

  // Tính số ngày yêu
  const calculateLoveDays = (dateLoved) => {
    if (!dateLoved) return 0;
    
    try {
      // Parse date từ string (có thể là DD-MM-YYYY hoặc YYYY-MM-DD)
      let parsedDate;
      if (dateLoved.includes('-')) {
        const parts = dateLoved.split('-');
        if (parts[0].length === 4) {
          // YYYY-MM-DD format
          parsedDate = new Date(dateLoved);
        } else {
          // DD-MM-YYYY format
          parsedDate = parse(dateLoved, 'dd-MM-yyyy', new Date());
        }
      } else {
        parsedDate = new Date(dateLoved);
      }
      
      const today = startOfDay(new Date());
      const loveDate = startOfDay(parsedDate);
      
      return Math.max(0, differenceInCalendarDays(today, loveDate));
    } catch (err) {
      console.error("Error parsing date:", err);
      return 0;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa có ngày";
    
    try {
      let parsedDate;
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts[0].length === 4) {
          parsedDate = new Date(dateStr);
        } else {
          parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
        }
      } else {
        parsedDate = new Date(dateStr);
      }
      
      return format(parsedDate, 'dd/MM/yyyy');
    } catch (err) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Đang tải card...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="container my-5">
        <div className="card shadow rounded-4 p-4 text-center">
          <div className="alert alert-danger">
            <h4>Oops! Có lỗi xảy ra</h4>
            <p>{error || "Không tìm thấy card"}</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/edit-card')}
            >
              Tạo card mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  const loveDays = calculateLoveDays(card.date_loved);

  return (
    <div className="container my-5">
      <div className="card shadow rounded-4 p-4" id="card-love">
        {/* Header với logo */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <img src={logo} className="mb-3" alt="logo" style={{ maxWidth: "200px" }} />
            <h2 className="text-primary fw-bold">Card Tình Yêu</h2>
          </div>
        </div>

        {/* Thông tin hai người */}
        <div className="row mb-5">
          {/* Người thứ nhất */}
          <div className="col-md-4 text-center">
            <div className="position-relative d-inline-block">
              <img
                src={card.img_person_one || "https://via.placeholder.com/150"}
                alt={card.person_one}
                className="rounded-circle shadow-lg"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  border: "4px solid #fff",
                }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle" 
                   style={{ 
                     background: "linear-gradient(45deg, rgba(255,182,193,0.3), rgba(255,105,180,0.3))",
                     pointerEvents: "none"
                   }}></div>
            </div>
            <h4 className="mt-3 text-primary fw-bold">{card.person_one}</h4>
            <p className="text-muted">Người yêu</p>
          </div>

          {/* Phần giữa - Ngày yêu và đếm ngày */}
          <div className="col-md-4 text-center d-flex flex-column justify-content-center">
            <div className="mb-4">
              <h5 className="text-muted mb-2">Ngày bắt đầu yêu</h5>
              <div className="bg-light rounded-pill p-3">
                <i className="bi bi-heart-fill text-danger me-2"></i>
                <span className="fw-bold">{formatDate(card.date_loved)}</span>
              </div>
            </div>
            
            {/* Counter ngày yêu */}
            <div className="days-counter mx-auto">
              <div className="days-number">{loveDays}</div>
              <div className="days-label">Days</div>
            </div>
            
            <div className="mt-3">
              <span className="badge bg-primary fs-6">
                <i className="bi bi-calendar-heart me-1"></i>
                {loveDays} ngày yêu nhau
              </span>
            </div>
          </div>

          {/* Người thứ hai */}
          <div className="col-md-4 text-center">
            <div className="position-relative d-inline-block">
              <img
                src={card.img_person_two || "https://via.placeholder.com/150"}
                alt={card.person_two}
                className="rounded-circle shadow-lg"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  border: "4px solid #fff",
                }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle" 
                   style={{ 
                     background: "linear-gradient(45deg, rgba(255,182,193,0.3), rgba(255,105,180,0.3))",
                     pointerEvents: "none"
                   }}></div>
            </div>
            <h4 className="mt-3 text-primary fw-bold">{card.person_two}</h4>
            <p className="text-muted">Người yêu</p>
          </div>
        </div>

        {/* YouTube Video */}
        {card.url_youtube && (
          <div className="row mb-4">
            <div className="col-12">
              <h5 className="text-center mb-3">
                <i className="bi bi-youtube text-danger me-2"></i>
                Video kỷ niệm
              </h5>
              <div className="d-flex justify-content-center">
                <div style={{ maxWidth: "600px", width: "100%" }}>
                  <YouTubePreview 
                    value={card.url_youtube} 
                    onChange={() => {}} 
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thông tin bổ sung */}
        <div className="row">
          <div className="col-12">
            <div className="bg-light rounded-3 p-4 text-center">
              <h5 className="text-primary mb-3">
                <i className="bi bi-heart-fill text-danger me-2"></i>
                Câu chuyện tình yêu
              </h5>
              <p className="lead mb-0">
                {card.person_one} và {card.person_two} đã yêu nhau được <strong>{loveDays}</strong> ngày
                {card.date_loved && ` kể từ ngày ${formatDate(card.date_loved)}`}.
              </p>
              <div className="mt-3">
                <span className="badge bg-success me-2">
                  <i className="bi bi-check-circle me-1"></i>
                  Đã xác nhận
                </span>
                <span className="badge bg-info">
                  <i className="bi bi-calendar-check me-1"></i>
                  {formatDate(card.date_loved)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <div className="btn-group" role="group">
              <button 
                className="btn btn-outline-primary"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-2"></i>
                In card
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={() => {
                  const shareText = `Card tình yêu của ${card.person_one} và ${card.person_two} - ${loveDays} ngày yêu nhau!`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'Card Tình Yêu',
                      text: shareText,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link đã được copy vào clipboard!');
                  }
                }}
              >
                <i className="bi bi-share me-2"></i>
                Chia sẻ
              </button>
              <button 
                className="btn btn-outline-warning"
                onClick={() => navigate('/edit-card')}
              >
                <i className="bi bi-pencil me-2"></i>
                Tạo card mới
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <small className="text-muted">
              <i className="bi bi-heart-fill text-danger me-1"></i>
              Tạo bởi Card for Love - Chia sẻ tình yêu của bạn
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;