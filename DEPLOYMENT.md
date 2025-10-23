# 🚀 Deployment Guide - CardForLove

## ✅ **Repository đã được đẩy lên GitHub thành công!**

### 📍 **Repository URL:**
```
https://github.com/longbachit-lgtm/cardforlove.git
```

## 🌐 **Các tùy chọn deployment:**

### **1. Vercel (Recommended for Frontend)**

#### **Deploy Frontend:**
1. **Truy cập Vercel**: https://vercel.com
2. **Import project**: Chọn repository `longbachit-lgtm/cardforlove`
3. **Configure build settings**:
   ```
   Framework Preset: Vite
   Root Directory: valentine-story-web
   Build Command: npm run build
   Output Directory: dist
   ```
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
5. **Deploy**: Click Deploy

### **2. Netlify (Alternative for Frontend)**

#### **Deploy Frontend:**
1. **Truy cập Netlify**: https://netlify.com
2. **New site from Git**: Chọn GitHub repository
3. **Build settings**:
   ```
   Base directory: valentine-story-web
   Build command: npm run build
   Publish directory: valentine-story-web/dist
   ```
4. **Deploy**: Click Deploy

### **3. Heroku (Backend)**

#### **Deploy Backend:**
1. **Truy cập Heroku**: https://heroku.com
2. **Create new app**: Chọn tên app
3. **Connect to GitHub**: Chọn repository
4. **Configure buildpacks**:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```
5. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cardforlove
   JWT_SECRET=your_jwt_secret
   ```
6. **Deploy**: Enable automatic deploys

### **4. Railway (Full-stack)**

#### **Deploy Full Application:**
1. **Truy cập Railway**: https://railway.app
2. **New Project**: From GitHub repo
3. **Add Services**:
   - Frontend service (valentine-story-web)
   - Backend service (bken)
4. **Configure services**:
   - Frontend: Build command `npm run build`
   - Backend: Start command `npm start`
5. **Deploy**: Automatic deployment

## 🛠️ **Local Development Setup:**

### **1. Clone repository:**
```bash
git clone git@github.com:longbachit-lgtm/cardforlove.git
cd cardforlove
```

### **2. Setup Backend:**
```bash
cd bken
npm install
npm start
```

### **3. Setup Frontend:**
```bash
cd valentine-story-web
npm install
npm run dev
```

## 📱 **Production Checklist:**

### **Backend:**
- ✅ Environment variables configured
- ✅ MongoDB connection string
- ✅ JWT secret set
- ✅ CORS configured for frontend domain
- ✅ File upload directory permissions
- ✅ Error handling implemented

### **Frontend:**
- ✅ API URL updated for production
- ✅ Build optimized
- ✅ Static assets served correctly
- ✅ Environment variables set
- ✅ Error boundaries implemented

## 🔧 **Environment Variables:**

### **Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cardforlove
JWT_SECRET=your_super_secret_jwt_key
CORS_ORIGIN=https://your-frontend-domain.com
```

### **Frontend (.env):**
```env
VITE_API_URL=https://your-backend-domain.com
```

## 📊 **Database Setup:**

### **MongoDB Atlas:**
1. **Create cluster** on MongoDB Atlas
2. **Create database** named `cardforlove`
3. **Create user** with read/write permissions
4. **Whitelist IP addresses** (0.0.0.0/0 for all)
5. **Get connection string**

### **Local MongoDB:**
```bash
# Install MongoDB
brew install mongodb/brew/mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Create database
mongo
use cardforlove
```

## 🚀 **Deployment Commands:**

### **Build Frontend:**
```bash
cd valentine-story-web
npm run build
```

### **Start Backend:**
```bash
cd bken
npm start
```

### **Docker Deployment:**
```dockerfile
# Dockerfile for Backend
FROM node:18-alpine
WORKDIR /app
COPY bken/package*.json ./
RUN npm install
COPY bken/ .
EXPOSE 5000
CMD ["npm", "start"]
```

```dockerfile
# Dockerfile for Frontend
FROM node:18-alpine as builder
WORKDIR /app
COPY valentine-story-web/package*.json ./
RUN npm install
COPY valentine-story-web/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📈 **Performance Optimization:**

### **Frontend:**
- ✅ Code splitting implemented
- ✅ Lazy loading for components
- ✅ Image optimization
- ✅ Bundle size optimization
- ✅ Caching strategies

### **Backend:**
- ✅ Compression middleware
- ✅ Rate limiting
- ✅ Database indexing
- ✅ File upload optimization
- ✅ Error logging

## 🔒 **Security Considerations:**

### **Backend:**
- ✅ JWT authentication
- ✅ Input validation
- ✅ File upload restrictions
- ✅ CORS configuration
- ✅ Environment variables secured

### **Frontend:**
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure API calls
- ✅ Input sanitization

## 📞 **Support:**

### **GitHub Issues:**
- Create issues for bugs or feature requests
- Use labels for categorization
- Provide detailed reproduction steps

### **Documentation:**
- README.md for project overview
- API documentation in code comments
- Deployment guides for different platforms

---

**🎉 Website đã được đẩy lên GitHub thành công! Bạn có thể deploy lên bất kỳ platform nào để chia sẻ với mọi người!**
