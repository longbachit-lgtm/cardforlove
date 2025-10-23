# 🕒 Cập nhật trường createdAt và updatedAt tự động

## ✅ **Thay đổi đã thực hiện:**

### **1. Cập nhật CardLove Model:**
```javascript
const CardLove = new Schema({
  person_one: { type: String, required: true },
  img_person_one: { type: String, required: true },
  person_two: { type: String, required: true },
  img_person_two: { type: String, required: true },
  start_date: { type: String, default: null },
  url_youtube: { type: String, required: true },
  message: { type: String },
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});
```

### **2. Tính năng timestamps:**
- ✅ **createdAt**: Tự động thêm khi tạo document mới
- ✅ **updatedAt**: Tự động cập nhật mỗi khi save document
- ✅ **Date type**: Sử dụng Date object thay vì String
- ✅ **ISO format**: Lưu theo định dạng ISO 8601

## 🔍 **Trước và sau:**

### **Trước:**
```javascript
const CardLove = new Schema({
  // ... other fields
  createdAt: { type: String }, // Manual String type
});
```

### **Sau:**
```javascript
const CardLove = new Schema({
  // ... other fields
}, {
  timestamps: true // Auto Date fields
});
```

## 🎯 **Lợi ích:**

### **1. Tự động hóa:**
- **Không cần thêm thủ công**: Mongoose tự động thêm timestamps
- **Consistent**: Tất cả documents đều có cùng format
- **Error-free**: Không lo quên thêm createdAt

### **2. Date handling:**
- **Date objects**: Dễ dàng format và manipulate
- **ISO format**: Chuẩn quốc tế, dễ parse
- **Timezone aware**: Hỗ trợ timezone

### **3. Database queries:**
- **Sorting**: Dễ dàng sort theo thời gian
- **Filtering**: Filter theo date range
- **Indexing**: MongoDB có thể index Date fields

## 📝 **Cách hoạt động:**

### **1. Khi tạo document mới:**
```javascript
const card = await CardLove.create({
  person_one: "Em",
  person_two: "Anh",
  // ... other fields
});

// Mongoose tự động thêm:
// createdAt: 2024-01-15T10:30:00.000Z
// updatedAt: 2024-01-15T10:30:00.000Z
```

### **2. Khi update document:**
```javascript
const card = await CardLove.findByIdAndUpdate(
  cardId,
  { message: "New message" },
  { new: true }
);

// Mongoose tự động cập nhật:
// updatedAt: 2024-01-15T11:45:00.000Z
// createdAt: giữ nguyên
```

## 🛠️ **API Response:**

### **Trước:**
```json
{
  "data": {
    "_id": "...",
    "person_one": "Em",
    "person_two": "Anh",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### **Sau:**
```json
{
  "data": {
    "_id": "...",
    "person_one": "Em",
    "person_two": "Anh",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🎨 **Frontend Integration:**

### **1. CardDisplay component:**
```typescript
// Format createdAt
<p>Được tạo vào {formatDateTime(cardData.createdAt)}</p>

// Format updatedAt (nếu cần)
<p>Cập nhật lần cuối: {formatDateTime(cardData.updatedAt)}</p>
```

### **2. Date formatting:**
```typescript
const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return "Không xác định";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Không xác định";
    return format(date, "dd/MM/yyyy 'lúc' HH:mm", { locale: vi });
  } catch (error) {
    return "Không xác định";
  }
};
```

## 📊 **Database Schema:**

### **MongoDB Document:**
```javascript
{
  "_id": ObjectId("..."),
  "person_one": "Em",
  "person_two": "Anh",
  "img_person_one": "http://localhost:5000/uploads/image1.jpg",
  "img_person_two": "http://localhost:5000/uploads/image2.jpg",
  "start_date": "2024-01-01",
  "url_youtube": "https://youtube.com/watch?v=...",
  "message": "Thông điệp tình yêu",
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z"),
  "deletedAt": null // từ mongoose-delete plugin
}
```

## 🚀 **Tính năng mới:**

### **1. Tracking:**
- **Tạo thiệp**: Ghi lại thời gian tạo
- **Cập nhật thiệp**: Ghi lại thời gian sửa
- **Audit trail**: Theo dõi lịch sử thay đổi

### **2. Analytics:**
- **Thống kê**: Số thiệp tạo theo ngày/tháng
- **Trends**: Xu hướng tạo thiệp
- **Popular times**: Thời gian tạo thiệp nhiều nhất

### **3. User Experience:**
- **Hiển thị thời gian**: Người dùng biết thiệp được tạo khi nào
- **Sorting**: Sắp xếp thiệp theo thời gian
- **Recent**: Hiển thị thiệp mới nhất

## 💡 **Best Practices:**

### **1. Indexing:**
```javascript
// Thêm index cho createdAt để query nhanh hơn
CardLove.index({ createdAt: -1 }); // Descending order
```

### **2. Query optimization:**
```javascript
// Lấy thiệp mới nhất
const recentCards = await CardLove.find()
  .sort({ createdAt: -1 })
  .limit(10);

// Lấy thiệp trong tháng này
const thisMonth = await CardLove.find({
  createdAt: {
    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  }
});
```

### **3. Error handling:**
```javascript
// Luôn kiểm tra timestamps có tồn tại không
if (card.createdAt) {
  console.log('Card created at:', card.createdAt);
}
```

---

**🎉 Timestamps đã được cập nhật! Bây giờ mỗi khi tạo hoặc cập nhật thiệp, hệ thống sẽ tự động ghi lại thời gian chính xác!**
