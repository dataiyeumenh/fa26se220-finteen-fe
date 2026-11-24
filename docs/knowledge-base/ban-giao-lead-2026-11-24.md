# Bàn giao yêu cầu lead ngày 24/11/2026

Đã gửi duyệt CH01–CH08 trên [Studio](https://fa26se220-finteen-fe.vercel.app/internal/chapters). Cả tám chương ở trạng thái `SUBMITTED`, loại thay đổi `PATCH`; bản công khai vẫn là **2.7.2**. Không thay stat hoặc I/C/P trong Studio: lead yêu cầu nhận bảng để kiểm và tự nhập.

## PR 78 và Studio

- Đối chiếu toàn bộ nháp thật với kết quả migration đã duyệt: đủ 13 mini-game, 63 câu; nội dung khớp hoàn toàn. Gửi duyệt không đổi nội dung hoặc revision.
- Ba chỗ cá nhân hóa CH01 là có chủ ý: tiêu đề `CH01_SC02_A`, mô tả giao dịch phương án A trong `CH01_SC02_CHOICE`, và lời thoại `CH01_SC02_CHOICE_B_1`. Chúng đã có trong nháp, không sửa lại lần nữa. `{{item}}`/`{{Item}}` lấy món đồ theo sở thích.
- Đã gọi Sinh giọng CH01. Backend trả `queued=0`, `ready=160`, không có câu thiếu, chờ hoặc lỗi. Riêng cảnh `CH01_SC02_CHOICE_B_1` đủ 18 bản đọc theo nội dung/giọng; backend có thể dùng lại bản ghi đúng nội dung dù cảnh không có `voiceUrl` tĩnh.
- Sửa khóa câu sai thành `${item.gameId}-${item.itemId}` và cập nhật fixture báo cáo đúng hai trường BE trả về.
- Giới hạn tài liệu mới được đưa vào git ở `docs/knowledge-base/`; tài liệu và ảnh ngoài phạm vi giữ local. Tài liệu bảng duyệt được migration liên kết là [báo cáo duyệt nội dung](bao-cao-duyet-noi-dung-2026-11-23.md).

[Audit thao tác Studio](../../scripts/content-migrations/lead-followup-2026-11-24.audit.json) ghi revision, thời điểm, trạng thái và kết quả giọng. Ghi chú dài ở lần gửi đầu bị backend trả HTTP 500/code 1000; rút ngắn xuống dưới 255 ký tự thì cả tám chương gửi thành công. Đây là quan sát, chưa xác minh giới hạn cột hoặc nguyên nhân trong BE.

## Bảng 98 lựa chọn

[CSV đã điền bốn cột HA](bang-quy-tac-chi-so-98-lua-chon-2026-11-24.csv) giữ nguyên 11 cột gốc, thứ tự 98 dòng và đầy đủ mã cảnh/lựa chọn. Bản gốc trong Downloads không bị ghi đè. Dùng cả **Cảnh + Mã lựa chọn** để định danh vì CH04 dùng lại ID lựa chọn ở ba cảnh hóa đơn.

Thang chung cho từng stat là **0, ±2, ±5, ±10**:

| Độ lớn | Quy tắc áp dụng |
|---|---|
| 0 | Chưa có thay đổi được chứng minh; điều hướng; tránh cộng/trừ hai lần cho Money. |
| Nhỏ: 2 | Một bước kiểm tra, theo dõi, bỏ cảnh báo hoặc ảnh hưởng giới hạn tới mục tiêu. |
| Vừa: 5 | Kế hoạch tích lũy khả thi, giữ/phá mục tiêu rõ ràng, hoặc biện pháp quản lý rủi ro có tác dụng đáng kể. |
| Lớn: 10 | Tiêu bốc đồng phá khoản tích lũy chủ chốt, lộ OTP, nghĩa vụ nợ khó trả hoặc đầu tư tập trung ảnh hưởng tiền sắp cần. |

Đây là thang thiết kế gameplay để lead duyệt và playtest. Mục 6 khung v3 cung cấp **chiều tăng/giảm**, không quy định các số 2/5/10. CSV ghi rõ từng dòng của mục 6 được dùng, tình huống cụ thể và lý do sửa; các chỉ số giữ 0 cũng được giải thích. Không quy đổi VND thành điểm. RISK cao là phơi nhiễm lớn; không phạt dùng dự phòng đúng mục đích; không thưởng HAPPINESS chỉ vì mua bốc đồng trái mục tiêu.

Nguồn nội bộ: `FinTeen_Financial_Knowledge_Framework_v3_money_fixed.docx`, mục 6 (Money/4 stats) và mục 8 (minh chứng); `FinTeen_Game_Design_Document_GDD_v3_money_fixed.docx`, mục 7 (I/C/P và reflection). Hai tài liệu DOCX có tại cùng thư mục trong workspace, vẫn thuộc quy tắc bỏ qua tài liệu Office của repo.

I/C/P: **I** kiểm tra thông tin; **C** tính toán/so sánh; **P** kế hoạch/đánh đổi/theo dõi. Mức 0 là bỏ/sai dữ kiện hay không có phương án; 1 là đúng một phần; 2 là đủ minh chứng phù hợp tình huống. Mỗi lựa chọn chính có dòng giải thích riêng cho ba chiều. Việc mở thẻ hoặc nghe lời thoại sau chọn chưa đủ để nhận điểm tối đa.

47 dòng thiếu I/C/P gồm:

| Nhóm | Số dòng | Xử lý trong cột HA |
|---|---:|---|
| Lựa chọn chính CH04: 3 tiêu chí mua, 2 thuê bao, 3 sửa quyết định | 8 | Đề xuất đủ I/C/P và điều kiện bằng chứng. |
| Phản tư CH03/CH04 | 12 | Giữ `reflectionScore` 0/1/2 riêng; không thêm vào điểm quyết định. |
| Đi tiếp, mở dữ kiện, chọn nhánh tạm, xác nhận/quay lại, giao dịch tháng, bày tỏ ưu tiên | 27 | Ghi rõ không chấm I/C/P và loại khỏi mẫu số quyết định; không gán 0/0/0 như một câu sai. |

51 dòng đã có I/C/P cũng có giải thích và đề xuất sửa những điểm tối đa chưa đủ bằng chứng. Những quyết định sửa lại thay điểm hiệu lực của cùng nhóm, giữ lịch sử lần đầu; không cộng dồn điểm hoặc stat khi quay lại. Bảng là đề xuất cần lead kiểm, chưa thay cấu trúc chấm runtime.

Các điểm cần lead chú ý khi nhập: CH06 chỉ tìm hiểu gói B chưa đủ để giảm RISK; CH08 chọn “dùng bản vừa lập” chưa chứng minh bản kế hoạch khả thi nên không tự thưởng SAVING; không tự cho CH04 đủ 2/2/2 chỉ vì đã mở bảng giá.

## Kiểm chứng

- CSV: 98 dòng, 15 cột, giữ nguyên 11 cột gốc, điền đủ 392 ô HA, đọc lại CSV trùng khớp; chỉ dùng độ lớn 0/2/5/10.
- Đủ 47 dòng thiếu ban đầu: CH03 6, CH04 32, CH05 7, CH06 2.
- Mapping: hai kiểm thử qua; đối chiếu nháp thật đủ tám chương khớp migration.
- Build và ESLint hai tệp JSX sửa: qua.
- Kiểm thử Chrome báo cáo học tập: qua cả bảy nhóm kiểm tra, fixture dùng đúng `gameId`/`itemId`.

[Script tạo/kiểm CSV](../../scripts/content-migrations/choice-rules-2026-11-24.py) và [audit CSV](../../scripts/content-migrations/choice-rules-2026-11-24.audit.json) lưu mã băm nguồn và đầu ra. Chạy lại từ repo:

```powershell
python scripts/content-migrations/choice-rules-2026-11-24.py 'bang-quy-tac-chi-so-98-lua-chon-2026-11-24.csv'
```

Dùng file CSV gốc làm đầu vào cho lệnh trên; tên file chỉ là ví dụ, không gắn với đường dẫn máy cá nhân. Trong PR, phần tài liệu mới chỉ gồm ba tài liệu Markdown và bảng CSV tại `docs/knowledge-base/`, cùng script/audit migration và các thay đổi code/kiểm thử liên quan. Các tài liệu ngoài phạm vi đã được gỡ khỏi PR và giữ bản local. Chưa triển khai FE hoặc phát hành nội dung.
