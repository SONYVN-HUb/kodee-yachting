# Kodee Yachting — website bán vé du thuyền (CTV Theia Yachting)

Web tĩnh (HTML/CSS/JS), không cần build. Hiệu ứng: GSAP + ScrollTrigger + Lenis (CDN jsDelivr).

## 1. Việc anh cần điền
1. `assets/js/config.js` — số Zalo, hotline, link Facebook, Messenger, email, tên thương hiệu. Trống thì nút hiện "Chưa cập nhật".
2. Tên miền: thay `https://TEN-MIEN-CUA-BAN.com` trong mọi file:
   `grep -rl TEN-MIEN-CUA-BAN.com . | xargs sed -i 's#https://TEN-MIEN-CUA-BAN.com#https://tenmiencuaban.com#g'`
3. Tên thương hiệu "Kodee Yachting" trong title/meta — đổi bằng sed tương tự nếu muốn.
4. Phần "Khách hàng nói gì" là NỘI DUNG MẪU — thay bằng đánh giá thật.
5. Hỏi Theia: chính sách hủy/hoàn tiền, đặt cọc, giá VNĐ, giá cả ngày (đang ghi "Liên hệ").

## 2. Cấu trúc
- `index.html` trang chủ · `du-thuyen/*.html` 10 trang chi tiết · `blog/` 3 bài + kế hoạch nội dung
- `assets/img/` ảnh gốc độ phân giải cao từ theiayachting.com · `sitemap.xml`, `robots.txt`, favicon, `assets/img/og.jpg`

## 3. Nguồn dữ liệu
Giá, thông số, ảnh lấy từ https://theiayachting.com/vi (20/11/2026). Giá USD, nửa ngày 5 giờ, trọn tàu.

## 4. Đưa lên mạng miễn phí
Netlify Drop (kéo thả thư mục) · Cloudflare Pages · Vercel · GitHub Pages.
