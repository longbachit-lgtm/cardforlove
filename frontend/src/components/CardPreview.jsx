import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const CardPreview = ({ card, showActions = true }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa có ngày";
    
    try {
      let parsedDate;
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts[0].length === 4) {
          parsedDate = new Date(dateStr);
        } else {
          parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
      } else {
        parsedDate = new Date(dateStr);
      }
      
      return format(parsedDate, 'dd/MM/yyyy');
    } catch (err) {
      return dateStr;
    }
  };

  const calculateLoveDays = (dateLoved) => {
    if (!dateLoved) return 0;
    
    try {
      let parsedDate;
      if (dateLoved.includes('-')) {
        const parts = dateLoved.split('-');
        if (parts[0].length === 4) {
          parsedDate = new Date(dateLoved);
        } else {
          parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
      } else {
        parsedDate = new Date(dateLoved);
      }
      
      const today = new Date();
      const diffTime = Math.abs(today - parsedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (err) {
      return 0;
    }
  };

  const loveDays = calculateLoveDays(card.date_loved);

  return (
    <div className="card shadow rounded-3 h-100" id="card-love">
      <div className="card-body p-3">
        {/* Header */}
        <div className="text-center mb-3">
          <h6 className="text-primary fw-bold mb-0">Card Tình Yêu</h6>
          <small className="text-muted">ID: {card._id?.slice(-8) || 'N/A'}</small>
        </div>

        {/* Two people */}
        <div className="row mb-3">
          <div className="col-6 text-center">
            <img
              src={card.img_person_one || "https://via.placeholder.com/60"}
              alt={card.person_one}
              className="rounded-circle shadow-sm"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
              }}
            />
            <p className="mt-1 mb-0 fw-bold text-primary small">{card.person_one}</p>
          </div>
          <div className="col-6 text-center">
            <img
              src={card.img_person_two || "https://via.placeholder.com/60"}
              alt={card.person_two}
              className="rounded-circle shadow-sm"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
              }}
            />
            <p className="mt-1 mb-0 fw-bold text-primary small">{card.person_two}</p>
          </div>
        </div>

        {/* Love days counter */}
        <div className="text-center mb-3">
          <div className="days-counter mx-auto" style={{ width: "80px", height: "80px" }}>
            <div className="days-number" style={{ fontSize: "20px" }}>
              {loveDays}
            </div>
            <div className="days-label" style={{ fontSize: "10px" }}>Days</div>
          </div>
          <p className="text-muted mb-0 small">Từ: {formatDate(card.date_loved)}</p>
        </div>

        {/* YouTube indicator */}
        {card.url_youtube && (
          <div className="text-center mb-2">
            <small className="text-muted">
              <i className="bi bi-youtube text-danger me-1"></i>
              Có video
            </small>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="d-grid gap-1">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => navigate(`/card/${card._id}`)}
            >
              <i className="bi bi-eye me-1"></i>
              Xem
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/card/${card._id}`);
                alert('Link đã được copy!');
              }}
            >
              <i className="bi bi-share me-1"></i>
              Chia sẻ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPreview;
