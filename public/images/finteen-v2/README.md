# Bộ nhân vật chibi FinTeen v2

Cập nhật 03/10/2026 theo yêu cầu người dùng: **toàn bộ nhân vật dùng chibi; khác tuổi qua quần áo và nét mặt**. Giữ tỷ lệ cơ thể chibi nhất quán, không kéo dài chân/thân hoặc tạo thang chiều cao theo tuổi. Mẹ, cô Linh và các NPC người lớn có mẫu cố định dùng lại giữa các chương.

Đã thay **84 PNG: 60 sprite và 24 tranh scene**, từ 60 ảnh riêng biệt tạo/chỉnh bằng imagegen tích hợp. Giữ đường dẫn cũ và alpha của sprite. Background trống, đạo cụ và ảnh mini-game không thuộc đợt sửa này.

| Chương | Tuổi An/Minh | Trang phục nhận diện |
| --- | --- | --- |
| [1](chapter-01/README.md) | 14 | Áo thun/polo, quần short |
| [2](chapter-02/README.md) | 16 | Áo khoác sơ mi ngắn tay, áo trong sáng, quần dài |
| [3](chapter-03/README.md) | 17 | Polo và quần dài |
| [4](chapter-04/README.md) | 16 | Cùng bộ chương 2 |
| [5](chapter-05/README.md) | 16 | Cùng bộ chương 2 |
| [6](chapter-06/README.md) | 18 | Sơ mi xắn tay và quần dài |

GDD v2 có 8 **tình huống độc lập**. Chương 7 là 17 tuổi, chương 8 là 18 tuổi; hai chương này chưa nằm trong bộ ảnh hiện tại. Không nối số chương thành một hành trình lớn lên.

- [Nguồn và quy tắc độ tuổi](../../../docs/finteen-v2-character-ages.md).
- [Manifest ảnh hiện tại](character-age-manifest.json).
- [Bảng kiểm tra sprite](../../../output/age-review/final-sprites-review.png).
- [Bảng kiểm tra scene](../../../output/age-review/final-scenes-review.png).
- [Bộ prompt cuối](../../../output/age-review/final-prompt-set.md).

Khi ghép sprite, dùng contain và canh chân; không đặt hệ số tăng chiều cao theo tuổi. Dùng scene có sẵn nhân vật thì ẩn sprite rời. Việc sửa asset không tự tích hợp nội dung v2 vào gameplay main.

## Hợp đồng ghép ảnh dành cho AI

Mỗi thư mục chương là một gói tự đủ. Luôn dùng asset bên trong đúng chương để tránh An/Minh mặc trang phục sai tuổi. Không suy rằng cùng tên `an-neutral.png` thì file ở các chương có thể hoán đổi.

| Thư mục | Ý nghĩa runtime | Cách render |
| --- | --- | --- |
| `bg/` | Nền trống cho thoại, lựa chọn, mini-game | Full màn hình, `cover`; được phép ghép sprite/prop. |
| `scene/` | Tranh kể chuyện đã ghép nhân vật và hành động | Full màn hình, `cover`; **ẩn toàn bộ sprite/prop trùng**. |
| `char/` | Sprite nhân vật trong suốt | `contain`, căn chân, đổi file theo cảm xúc; không crop đầu/chân. |
| `props/` | Đạo cụ kể chuyện | `contain`; số/chữ và trạng thái nằm ở UI. |
| `asset-mini-game/` | Hình đại diện thẻ/vật trong cơ chế chơi | Render trong component tương tác; ảnh không phải vùng bấm hay đáp án. |

### Trình tự lắp một scene

1. `ENTER`: nạp background và preload mọi ảnh của scene.
2. `ESTABLISH`: nếu có `scene/scNN-*.png`, hiện ngắn hoặc chờ người chơi bấm; không chồng sprite.
3. `DIALOGUE`: cross-fade về background/góc nền tương ứng, ghép nhân vật theo README chương.
4. `INTERACTION`: mở panel dữ kiện/choice/mini-game; ẩn sprite nếu che vùng thao tác.
5. `COMMIT`: chỉ khi người chơi xác nhận mới ghi lựa chọn/effect; khóa double click.
6. `FEEDBACK`: đổi biểu cảm theo kết quả thực và giải thích phép tính.
7. `EXIT`: lưu checkpoint, scene ID, lựa chọn và state trước khi chuyển cảnh.

### State tối thiểu

```text
chapterId, sceneId, beatId, mode
scenarioMoney, goalAmount, plannedAmounts, transactions[]
choices{}, flags{}, skillScores{}, minigameProgress{}
endingId, effectLedger[], checkpointVersion
```

`effectLedger` chứa ID effect đã áp dụng để reload không cộng/trừ lần nữa. `scenarioMoney` thuộc tình huống trong chương, không mặc định đồng bộ với ví hồ sơ. Mỗi chương khởi tạo state mới theo README riêng.

### Bố cục và lựa chọn chế độ

- Hai nhân vật: người nói ưu tiên một bên, người nghe bên còn lại; đổi active/dim chứ không đổi scale.
- Ba nhân vật: dùng trái–giữa–phải, tối đa ba sprite; NPC qua tin nhắn không được đứng trong phòng.
- Góc bàn/quầy: dùng sprite nhỏ hơn hoặc ẩn sprite để chân không xuyên đồ vật.
- Dùng `scene` ở nhịp mở đầu/chuyển cảnh để thể hiện hành động tự nhiên. Dùng `bg + char` khi có nhiều câu thoại, đổi cảm xúc, lựa chọn hoặc mini-game.
- Không cắt nhân vật ra khỏi `scene`, không dùng tranh scene làm dữ liệu logic và không tạo kết quả nhánh từ chi tiết vẽ sẵn.

## Chuỗi nội dung sáu chương đã có ảnh

| Chương | Tình huống độc lập | Nhịp chính |
| --- | --- | --- |
| 1 | Tiền đầu tiên, 14 tuổi | Nhận tiền → bị hấp dẫn bởi tai nghe → phân biệt nhu cầu/mong muốn → giữ hoặc sửa mục tiêu lớp vẽ. |
| 2 | Tháng tự lập, 16 tuổi | Nhận ngân sách → chia khoản → lập mục tiêu laptop → gặp sửa xe → điều chỉnh kế hoạch. |
| 3 | Công việc đầu tiên, 17 tuổi | So ba cơ hội → kiểm tra nguồn → lập lịch/chi phí → báo cáo quyết định. |
| 4 | Mua thông minh, 16 tuổi | Xác định nhu cầu điện thoại → so tổng chi phí → hỏi chứng từ → theo dõi đổi trả/gia hạn. |
| 5 | Ngân hàng và lãi, 16 tuổi | So tài khoản → kiểm tra nhà cung cấp → hiểu lãi/sức mua → chọn theo thời hạn. |
| 6 | Vay và trả nợ, 18 tuổi | Xác định nhu cầu laptop → so đề nghị vay → đọc BNPL/thanh toán tối thiểu → lập kế hoạch trả khả thi. |

Đây là trật tự thư mục/học phần, không phải bằng chứng cùng một An già đi liên tục.

## Tiêu chí nghiệm thu tích hợp

- Không có `scene` và sprite trùng nhân vật cùng lúc.
- Không có dữ liệu số quan trọng bị đọc từ ảnh.
- Mọi branch đều hội tụ hoặc kết thúc có chủ đích, lưu/khôi phục được.
- Đúng asset của chương, đúng nhân vật có mặt trong cốt truyện, đúng cảm xúc sau kết quả.
- Ảnh tải lỗi có fallback; preload không khóa game vô hạn.
- Người dùng bàn phím có thể hoàn thành lựa chọn và mini-game; animation có thể bỏ qua.
