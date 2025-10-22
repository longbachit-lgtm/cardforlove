import React, { useState, useEffect } from "react";
import axios from "axios";
import { VARIABLE } from "../../Data/variable";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import CardPreview from "../../components/CardPreview";

const CardList = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCards();
  }, [currentPage, searchTerm]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { q: searchTerm })
      });
      
      const res = await axios.get(`${VARIABLE.url}/card?${params}`);
      setCards(res.data.data);
      setTotalPages(res.data.meta.pages);
    } catch (err) {
      console.error("Error fetching cards:", err);
      setError("Không thể tải danh sách card. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCards();
  };


  if (loading && cards.length === 0) {
    return (
      <div className="container my-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Đang tải danh sách card...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-primary fw-bold">
              <i className="bi bi-heart-fill text-danger me-2"></i>
              Danh sách Card Tình Yêu
            </h2>
            <button 
              className="btn btn-success"
              onClick={() => navigate('/edit-card')}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Tạo card mới
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="row mb-4">
        <div className="col-12">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <div className="flex-grow-1">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo tên người yêu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className="text-center py-5">
          <div className="card shadow rounded-4 p-5">
            <i className="bi bi-heart text-muted" style={{ fontSize: "4rem" }}></i>
            <h4 className="mt-3 text-muted">Chưa có card nào</h4>
            <p className="text-muted">Hãy tạo card tình yêu đầu tiên của bạn!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/edit-card')}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Tạo card mới
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {cards.map((card) => (
              <div key={card._id} className="col-lg-4 col-md-6">
                <CardPreview card={card} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="row mt-4">
              <div className="col-12">
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Trước
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      } else if (
                        page === currentPage - 2 || 
                        page === currentPage + 2
                      ) {
                        return <li key={page} className="page-item disabled"><span className="page-link">...</span></li>;
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Sau
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CardList;
