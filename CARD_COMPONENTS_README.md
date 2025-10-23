# Card Display Components

Đây là các component để hiển thị card tình yêu đã tạo trong ứng dụng Card for Love.

## 📁 Cấu trúc Files

```
frontend/src/
├── Pages/Card/
│   ├── Card.jsx          # Hiển thị chi tiết 1 card
│   ├── CardList.jsx      # Danh sách tất cả cards
│   └── EditCard.jsx      # Tạo/chỉnh sửa card
├── components/
│   ├── CardPreview.jsx   # Component preview card nhỏ
│   ├── LoveDaysPicker.jsx # Date picker cho ngày yêu
│   └── YouTubePreview.jsx # Preview YouTube videos
```

## 🎯 Các Component Chính

### 1. **Card.jsx** - Hiển thị chi tiết card
- **Route**: `/card/:id`
- **Chức năng**: Hiển thị đầy đủ thông tin card tình yêu
- **Tính năng**:
  - Hiển thị ảnh 2 người yêu
  - Đếm số ngày yêu nhau
  - Preview YouTube video
  - Nút in, chia sẻ, tạo card mới
  - Responsive design

### 2. **CardList.jsx** - Danh sách cards
- **Route**: `/cards`
- **Chức năng**: Hiển thị danh sách tất cả cards
- **Tính năng**:
  - Grid layout responsive
  - Tìm kiếm theo tên
  - Phân trang
  - Sử dụng CardPreview component
  - Empty state khi chưa có card

### 3. **CardPreview.jsx** - Component preview
- **Chức năng**: Hiển thị card dạng compact
- **Props**:
  - `card`: Object chứa thông tin card
  - `showActions`: Boolean để hiện/ẩn nút action
- **Tính năng**:
  - Preview nhỏ gọn
  - Tính toán ngày yêu
  - Nút xem chi tiết và chia sẻ

## 🔧 API Endpoints Sử Dụng

### Backend Endpoints:
- `GET /card/:id` - Lấy thông tin 1 card
- `GET /card?page=1&limit=12&q=keyword` - Lấy danh sách cards với phân trang và tìm kiếm
- `POST /card` - Tạo card mới
- `PUT /card/:id` - Cập nhật card
- `DELETE /card/:id` - Xóa card

### Data Structure:
```javascript
const card = {
  _id: "card_id",
  person_one: "Tên người 1",
  person_two: "Tên người 2", 
  img_person_one: "URL ảnh người 1",
  img_person_two: "URL ảnh người 2",
  date_loved: "DD-MM-YYYY", // Ngày bắt đầu yêu
  url_youtube: "YouTube URL",
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

## 🎨 UI/UX Features

### Design System:
- **Colors**: Primary blue, danger red cho heart icons
- **Typography**: Bootstrap classes với custom font weights
- **Layout**: Responsive grid với Bootstrap
- **Icons**: Bootstrap Icons cho UI elements
- **Animations**: Smooth transitions và hover effects

### Responsive Breakpoints:
- **Mobile**: 1 column
- **Tablet**: 2 columns (col-md-6)
- **Desktop**: 3 columns (col-lg-4)

## 🚀 Cách Sử Dụng

### 1. Tạo Card Mới:
```javascript
// Navigate đến trang tạo card
navigate('/edit-card');

// Sau khi tạo thành công, tự động redirect đến trang hiển thị
navigate(`/card/${newCardId}`);
```

### 2. Xem Danh Sách Cards:
```javascript
// Navigate đến danh sách
navigate('/cards');
```

### 3. Xem Chi Tiết Card:
```javascript
// Navigate đến card cụ thể
navigate(`/card/${cardId}`);
```

### 4. Chia Sẻ Card:
```javascript
// Copy link card vào clipboard
navigator.clipboard.writeText(`${window.location.origin}/card/${cardId}`);
```

## 🔄 State Management

### Redux Store:
- **user**: Thông tin user hiện tại
- **cards**: Danh sách cards (có thể thêm sau)

### Local State:
- **loading**: Trạng thái loading
- **error**: Thông báo lỗi
- **searchTerm**: Từ khóa tìm kiếm
- **currentPage**: Trang hiện tại

## 📱 Mobile Optimization

### Touch-Friendly:
- Nút bấm đủ lớn (min 44px)
- Spacing phù hợp cho touch
- Swipe gestures cho pagination

### Performance:
- Lazy loading cho images
- Debounced search
- Pagination để giảm load time

## 🎯 Future Enhancements

### Planned Features:
1. **Card Templates**: Nhiều mẫu card khác nhau
2. **Social Sharing**: Share lên Facebook, Instagram
3. **Card Analytics**: Thống kê views, shares
4. **Card Collections**: Nhóm cards theo chủ đề
5. **Export Options**: PDF, PNG export
6. **Card Comments**: Bình luận trên card
7. **Love Milestones**: Đánh dấu các cột mốc quan trọng

### Technical Improvements:
1. **Caching**: Redis cache cho API calls
2. **CDN**: Cloudinary cho image optimization
3. **PWA**: Progressive Web App features
4. **Offline Support**: Service workers
5. **Push Notifications**: Anniversary reminders

## 🐛 Troubleshooting

### Common Issues:

1. **Card không hiển thị**:
   - Kiểm tra API endpoint
   - Verify card ID trong URL
   - Check network requests

2. **Ảnh không load**:
   - Kiểm tra URL ảnh
   - Verify CORS settings
   - Check image permissions

3. **Date calculation sai**:
   - Kiểm tra format date trong database
   - Verify timezone settings
   - Check date-fns imports

4. **YouTube không play**:
   - Kiểm tra URL format
   - Verify video privacy settings
   - Check iframe permissions

## 📞 Support

Nếu có vấn đề gì, hãy:
1. Check console logs
2. Verify API responses
3. Test với different browsers
4. Check network connectivity

---

**Happy Coding! 💖**

