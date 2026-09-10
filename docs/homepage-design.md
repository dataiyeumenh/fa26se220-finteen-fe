# FinTeen - Trang Chủ

## Concept

Trang chủ cho FinTeen - nền tảng học tài chính dựa trên mô phỏng dành cho học sinh THPT (13-18 tuổi).

### Vị trí trong codebase
- File này là design spec cho trang chủ
- Code implementation: `src/pages/Home.tsx` (React/Next.js)

### Link reference
- Design system: `DESIGN.md`

---

## Homepage Structure

### 1. Hero Section
- Headline: "Học tài chính. Đoán trước. Hiểu thật."
- Subheadline: "Nền tảng học tài chính đầu tiên tại Việt Nam với cơ chế đoán-trước độc quyền"
- CTA: "Bắt đầu học ngay" (primary pill button)
- Visual: Animated illustration showing the estimate-first mechanic

### 2. Problem Statement
- Three cards showing:
  1. "Biết công thức lãi kép nhưng đoán sai cả trăm triệu"
  2. "Tưởng tăng lương 5% là tốt, nhưng lạm phát 6%"
  3. "Không ai hỏi em nghĩ gì trước khi dạy"

### 3. Feature Showcase
- 4 feature cards with icons:
  1. Máy mô phỏng lãi kép
  2. Trò chơi tình huống
  3. Phân tích sai số
  4. Trợ lý AI

### 4. Interactive Demo
- Mini game showing estimate-first mechanic
- User inputs estimate, sees result

### 5. Testimonials
- 3 student testimonials

### 6. CTA Section
- Final call to action

---

## Visual Direction

### Color Palette
- Primary: `#1a1a2e` (dark navy - trust, money)
- Accent: `#00d4aa` (teal mint - youthful, fresh)
- Secondary: `#ff6b6b` (coral - gamification, attention)
- Background: `#f8f9fa` (soft white)
- Text: `#1a1a2e`

### Typography
- Headings: Plus Jakarta Sans (bold, modern)
- Body: Plus Jakarta Sans (regular)
- Accent numbers: Space Grotesk (techy, modern)

### Animations
- Subtle entrance animations
- Micro-interactions on buttons
- Animated number counters
- Floating elements for depth

---

## Components

### Navigation
- Logo + wordmark left
- Links: "Tính năng", "Trò chơi", "Về chúng tôi"
- CTA button right
- Sticky on scroll

### Hero Pills
- Feature tags: "🎮 Trò chơi", "📊 Mô phỏng", "🤖 AI Assistant"

### Feature Cards
- Icon + title + description
- Hover: slight lift + accent border

### Demo Component
- Input field for estimate
- Animated reveal
- Error visualization

### Testimonial Cards
- Avatar + name + school
- Quote text
- Star rating

### CTA Buttons
- Primary: filled with accent color
- Secondary: outlined
- All rounded-full (pill shape)
