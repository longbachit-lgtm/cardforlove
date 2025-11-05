# Hướng dẫn Git Commands

## Kiểm tra trạng thái
```bash
git status
```

## Thêm file vào staging area
```bash
# Thêm tất cả file đã thay đổi
git add .

# Thêm file cụ thể
git add <tên-file>

# Thêm tất cả file (bao gồm file đã xóa)
git add -A
```

## Commit thay đổi
```bash
git commit -m "Mô tả thay đổi sadas"
```

## Push lên remote
```bash
# Push lên branch hiện tại
git push

# Push lên branch cụ thể
git push origin master

# Push lần đầu (nếu chưa set upstream)
git push -u origin master
```

## Workflow đầy đủ
```bash
# 1. Kiểm tra thay đổi
git status

# 2. Thêm file vào staging
git add .

# 3. Commit
git commit -m "Mô tả commit"

# 4. Push lên GitHub
git push
```

## Xử lý lỗi thường gặp

### Lỗi khi push (SSH key)
Nếu gặp lỗi authentication khi push:
```bash
# Kiểm tra SSH key
ssh -T git@github.com

# Nếu chưa có SSH key, tạo mới:
ssh-keygen -t ed25519 -C "longbach.it@gmail.com"
```

### Lỗi "nothing to commit"
Nếu git status hiển thị "nothing to commit":
- Có thể bạn chưa có thay đổi nào
- Hoặc tất cả thay đổi đã được commit
- Kiểm tra: `git log` để xem commit gần nhất

### Lỗi "Your branch is ahead of origin"
Nếu branch local đã commit nhưng chưa push:
```bash
git push origin master
```

