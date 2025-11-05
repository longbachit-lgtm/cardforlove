# API Integration Guide

## Tổng quan

Frontend đã được tích hợp với backend API để:
- Upload ảnh lên server
- Tạo và lưu thiệp Valentine vào database
- Quản lý trạng thái loading và error handling

## API Endpoints

### Upload API
- **URL**: `http://localhost:5000/upload`
- **Method**: POST
- **Body**: FormData với field `image`
- **Response**: `{ url: string }`

### Card API
- **Create Card**: `POST http://localhost:5000/card`
- **Get Cards**: `GET http://localhost:5000/card?page=1&limit=20&q=search`
- **Get Card**: `GET http://localhost:5000/card/:id`
- **Update Card**: `PUT http://localhost:5000/card/:id`
- **Delete Card**: `DELETE http://localhost:5000/card/:id`

## Cách sử dụng

### 1. Chạy Backend
```bash
cd bken
npm start
```
Backend sẽ chạy tại `http://localhost:5000`

### 2. Chạy Frontend
```bash
cd valentine-story-web
npm run dev
```
Frontend sẽ chạy tại `http://localhost:8080`

### 3. Sử dụng ứng dụng
1. Upload ảnh của hai người (ảnh sẽ được tải lên server)
2. Chọn ngày bắt đầu yêu
3. Thêm YouTube link (tùy chọn)
4. Xem preview thiệp
5. Nhấn "Lưu thiệp" để lưu vào database

## Tính năng đã tích hợp

### ✅ Upload Ảnh
- Upload ảnh lên server với Multer
- Preview ảnh ngay lập tức
- Loading indicator khi upload
- Error handling khi upload thất bại

### ✅ Tạo Card
- Validation dữ liệu trước khi lưu
- Lưu card vào MongoDB
- Toast notification khi thành công/thất bại
- Reset form sau khi lưu thành công

### ✅ UI/UX Improvements
- Loading states cho tất cả actions
- Disable buttons khi đang xử lý
- Error messages rõ ràng
- Success notifications

## Cấu trúc dữ liệu CardLove

```typescript
interface CardLoveData {
  person_one: string;        // Tên người thứ nhất
  img_person_one: string;    // URL ảnh người thứ nhất
  person_two: string;        // Tên người thứ hai  
  img_person_two: string;    // URL ảnh người thứ hai
  start_date: string;        // Ngày bắt đầu yêu (YYYY-MM-DD)
  url_youtube: string;       // Link YouTube
  message?: string;          // Tin nhắn (tùy chọn)
}
```

## Error Handling

- **Upload Error**: Hiển thị toast error khi upload ảnh thất bại
- **Save Error**: Hiển thị toast error khi lưu card thất bại
- **Validation**: Kiểm tra dữ liệu trước khi gửi API
- **Network Error**: Xử lý lỗi kết nối mạng

## Loading States

- **Upload Loading**: Hiển thị spinner khi đang upload ảnh
- **Save Loading**: Hiển thị spinner khi đang lưu card
- **Button Disabled**: Disable buttons khi đang xử lý

## CORS Configuration

Backend đã được cấu hình CORS để cho phép frontend kết nối:
```javascript
app.use(cors());
```
