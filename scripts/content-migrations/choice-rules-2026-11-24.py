"""Fill only the four HA columns; validate against the supplied 2.7.2 CSV.

Usage: python scripts/content-migrations/choice-rules-2026-11-24.py INPUT.csv
This prepares a review artifact. It never writes to Studio.
"""
import csv
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/knowledge-base/bang-quy-tac-chi-so-98-lua-chon-2026-11-24.csv'
STATS = ('SAVING', 'GOAL', 'RISK', 'HAPPINESS')
QUOTES = {
    ('SAVING', 1): 'Tiết kiệm đều; hoãn mua sắm; đạt mục tiêu',
    ('SAVING', -1): 'Impulse spending; rút quỹ dự phòng không cần thiết',
    ('GOAL', 1): 'Hành động phù hợp mục tiêu; lập kế hoạch; duy trì kỷ luật',
    ('GOAL', -1): 'Chi tiêu lệch mục tiêu; bỏ kế hoạch; quyết định ngắn hạn phá mục tiêu',
    ('RISK', 1): 'Nợ khó trả; đầu tư tập trung; lộ dữ liệu; bỏ qua cảnh báo',
    ('RISK', -1): 'Đa dạng hóa phù hợp; bảo vệ dữ liệu; quản lý rủi ro/bảo hiểm phù hợp',
    ('HAPPINESS', 1): 'Chi tiêu phù hợp giá trị; đạt mục tiêu; duy trì cân bằng',
    ('HAPPINESS', -1): 'Quá thắt chặt; stress do nợ; lựa chọn trái mục tiêu',
}

# Explicit editorial judgments, not rounding of the previous arbitrary values.
# Tuple order: SAVING, GOAL, RISK, HAPPINESS. Each basis is specific to the choice.
RULES = {}
def rule(ids, stats, basis, note=''):
    for option_id in ids.split():
        assert option_id not in RULES, option_id
        RULES[option_id] = (stats, basis, note)

rule('CH01_SC02_CHOICE_A', (-10,-5,0,-2), 'Mua ngay 250.000đ làm hụt khoản dành cho lớp vẽ.', 'SAVING -25 là điểm gameplay, không được sao lại giao dịch VND. Đổi HAPPINESS +5 thành -2 vì trái mục tiêu; không thưởng mua bốc đồng.')
rule('CH01_SC02_CHOICE_B CH01_SC02_CHOICE_C', (5,5,0,2), 'Hoãn mua để bảo vệ tiền cho lớp vẽ, không phải thắt chặt quá mức.', 'Đổi HAPPINESS -2 thành +2 theo cân bằng/giá trị; không phạt mặc định việc hoãn mua. C có thêm so tổng giá, không vì vậy được cộng stat nhiều hơn B.')
rule('CH02_SC03_CHOICE_A', (5,5,2,0), 'Lộ trình 1.000.000 × 6 đạt 6.000.000đ; dự trù chỉ còn 200.000đ/tháng.', 'SAVING/GOAL +5 cho kế hoạch tích lũy, RISK +2 cho dư địa hẹp; không coi chọn kế hoạch là đã có thêm Money.')
rule('CH02_SC03_CHOICE_B', (5,5,0,2), 'Lộ trình 800.000 × 8 đạt 6.400.000đ; dự trù 400.000đ/tháng giữ cân bằng.', 'Cùng +5 SAVING/GOAL như A: thời hạn chậm hơn không đồng nghĩa kém năng lực.')
rule('CH02_SC04_CHOICE_A', (0,2,-5,2), 'Dùng đúng quỹ dự trù trả sửa xe 200.000đ và giữ nguyên tiền mục tiêu laptop.', 'Mục 6: không phạt mặc định dùng quỹ dự phòng đúng mục đích. Bỏ SAVING +5: chi quỹ không phải tích lũy mới. Money -200.000đ giữ riêng.')
rule('CH02_SC04_CHOICE_B', (0,-2,0,0), 'Chi thiết yếu sửa xe bằng tiền laptop làm lùi mục tiêu, không phải tiêu bốc đồng.', 'Bỏ SAVING -5, RISK +5 và HAPPINESS -2: chưa có nợ/lộ dữ liệu/stress. GOAL -2 chỉ biểu diễn lùi lịch laptop; không phạt chi thiết yếu lần hai.')
rule('CH03_SC02_CHOICE_A', (0,2,-2,0), 'Đối chiếu chương trình, phí nhập môn 200.000đ và nguồn tuyển dụng độc lập trước lời tư vấn có hoa hồng.')
rule('CH03_SC02_CHOICE_B', (0,0,2,0), 'Đăng ký dựa trên lời bảo đảm chưa được kiểm chứng; bỏ cảnh báo hoa hồng tuyển sinh.')
rule('CH03_SC03_CHOICE_A CH03_SC03_REVISE_A', (0,5,0,0), 'Trợ lý thiết kế 10 giờ/tuần nằm trong quỹ 12 giờ; phí 200.000đ trong ngân sách 300.000đ.', 'Bản sửa thay lựa chọn cũ trong cùng nhóm nghề, không cộng dồn hai lần GOAL.')
rule('CH03_SC03_CHOICE_C CH03_SC03_REVISE_C', (0,5,0,0), 'Bán sản phẩm nhỏ 12 giờ/tuần phù hợp quỹ thời gian; cần phân biệt doanh thu với lợi nhuận.', 'Cùng GOAL +5 như trợ lý thiết kế vì đều có thể phù hợp; không ưu ái nghề theo số tiền. Bản sửa thay lựa chọn cũ.')
rule('CH03_SC03_CHOICE_B CH03_SC03_REVISE_KEEP', (0,-5,0,-2), 'Bán hàng hoa hồng 16 giờ/tuần vượt quỹ 12 giờ, xung đột lịch học.', 'Đổi GOAL +1 thành -5 vì quyết định trái mục tiêu, HAPPINESS -2 vì mất cân bằng. Không suy diễn tính cách hay nghề tốt/xấu.')
rule('CH04_SC02_A CH04_SC02_B', (0,5,-2,0), 'A chỉ phù hợp khi hủy thuê bao; B cần kiểm tra pin/bảo hành. Cả hai có thể giữ 500.000đ cho hoạt động trường.', 'Điểm phù hợp là có điều kiện, không mặc định A/B luôn tốt. Chỉ công nhận bằng chứng đã kiểm tra và phương án chi phí khả thi.')
rule('CH04_SC02_C', (0,-5,0,-2), 'Máy C 2.300.000đ vượt giới hạn chi 2.000.000đ, thiếu 300.000đ cho mục tiêu giữ lại.', 'Đổi HAPPINESS +4 thành -2 theo lựa chọn trái mục tiêu; không suy từ giá máy sang SAVING.')
rule('CH04_SC03_A', (0,2,-2,0), 'Hỏi rõ phí ngoài báo giá 100.000đ và giữ chứng từ trước khi chấp nhận thanh toán.', 'Cùng quy tắc cho ba cảnh hóa đơn A/B/C; định danh bằng cả Cảnh + Mã lựa chọn vì ID được dùng lại.')
rule('CH04_SC03_B', (0,0,2,0), 'Chấp nhận phí 100.000đ chưa có trong báo giá mà không đối chiếu.', 'Money của giá máy và phí vẫn riêng; không trừ SAVING chỉ vì phát sinh giao dịch. Cùng quy tắc cho ba cảnh hóa đơn.')
rule('CH05_SC02_A', (0,2,-2,0), 'Đối chiếu nhà cung cấp, phạm vi bảo vệ và ngày cần rút của riêng từng sản phẩm.')
rule('CH05_SC02_B CH05_PROVIDER_GENERALIZE', (0,0,0,0), 'Bản 2.7.2 không gắn delta cho việc tin quảng cáo hoặc suy rộng điều kiện sản phẩm.', 'Giữ stat 0; chấm thiếu kiểm chứng bằng I/C/P, không tự thêm mức rủi ro chưa xảy ra. Không được suy rộng bảo vệ từ sản phẩm A/B sang ứng dụng khác.')
rule('CH05_B_MATURITY', (0,-5,0,0), 'Giữ đủ 12 tháng không đáp ứng lịch đóng học cuối tháng 3.')
rule('CH05_SC04_A', (5,5,0,0), 'Rút B cuối tháng 3 theo lãi trước hạn 2%/năm, không phí: 1.005.000đ đủ học phí 1.000.000đ.', 'Phù hợp nhờ đúng lịch và điều kiện rút; không dùng lãi niêm yết 6%/năm cho ba tháng.')
rule('CH05_SC04_C', (0,-5,0,0), 'Giữ A mà không bù thiếu: lãi ba tháng 7.500đ, phí 15.000đ, còn 992.500đ, thiếu 7.500đ học phí.')
rule('CH05_TOPUP_VERIFIED', (5,5,0,0), 'Xác minh 7.500đ từ khoản giải trí chưa chi, chuyển vào học phí và hẹn kiểm tra cuối tháng 1.')
rule('CH05_TOPUP_PROMISE CH05_TOPUP_UNVERIFIED', (0,0,0,0), 'Bản 2.7.2 chưa gắn delta; nguồn bù học phí chưa xác minh nên không thưởng kế hoạch.', 'Giữ trạng thái pending và stat 0; không biến lời hứa thành nguồn Money mới.')
rule('CH06_SC02_A', (0,5,-5,0), 'Dùng máy trường, để dành mua sau; tránh cam kết trả nợ chưa kiểm chứng nguồn thu.')
rule('CH06_SC02_B', (0,2,0,0), 'Chỉ tìm hiểu gói B 550.000đ × 12 = 6.600.000đ; nguồn thu và ngày trả chưa xác minh.', 'Bỏ RISK -5: chưa xác minh khả năng trả nợ nên chưa đủ căn cứ giảm phơi nhiễm. GOAL +2 cho bước lập kế hoạch, không coi đã mua/đã vay.')
rule('CH06_SC02_C', (0,0,2,0), 'Chú ý khoản 500.000đ/nửa tháng nhưng bỏ tổng 1.000.000đ/tháng và thiếu 600.000đ tiền mua.', 'Chỉ xem tiếp gói, chưa giải ngân: bỏ SAVING -2/HAPPINESS +3; RISK +2 cho bỏ cảnh báo, không dùng mức của một khoản nợ đã phát sinh.')
rule('CH06_SC03_A', (0,2,-2,0), 'Tính nguồn trả phần nợ còn lại sau mức tối thiểu, thay vì bỏ nghĩa vụ tháng sau.', 'Bước tìm kế hoạch, không phải xác nhận đã trả hết nợ; chỉ giảm rủi ro nhỏ.')
rule('CH06_SC03_B', (0,-5,10,0), 'Bỏ kế hoạch trả dư nợ, tiếp tục nghĩa vụ có thể khó trả và phát sinh chi phí.', 'Mức lớn cho bỏ nghĩa vụ nợ; không lấy số dư nợ làm số điểm stat.')
rule('CH07_SC02_A', (0,0,-5,0), 'Chi y tế bằng 300.000đ đang có và giữ giấy tờ nộp hồ sơ bảo hiểm.', 'Không phạt dùng tiền dự phòng đúng việc; không cộng SAVING hoặc Money trước khi hồ sơ được duyệt/hoàn tiền.')
rule('CH07_SC02_B', (0,-5,10,0), 'Vay 300.000đ để giữ tiền đang có tạo nghĩa vụ trả trong tình huống dù có thể dùng tiền sẵn.', 'Mức lớn cho phơi nhiễm nợ khó trả; giải ngân và thanh toán y tế là hai giao dịch Money riêng.')
rule('CH07_SC02_C', (0,-5,5,0), 'Hoãn giải quyết chi phí y tế, không có phương án thanh toán khả thi.')
rule('CH07_SC03_A', (0,2,-5,0), 'Kiểm chứng qua ứng dụng bảo hiểm và lưu tin nhắn để bảo vệ dữ liệu.', 'Bỏ SAVING +1/HAPPINESS +1: xác minh tin nhắn chưa chứng minh tích lũy hay thay đổi cân bằng cá nhân.')
rule('CH07_SC03_B', (0,0,10,0), 'Gửi OTP cho yêu cầu chưa kiểm chứng làm lộ dữ liệu; tình huống mô phỏng mất 150.000đ.', 'Mức lớn cho lộ dữ liệu; tổn thất 150.000đ chỉ ghi Money, không đổi thành SAVING -15.')
rule('CH07_SC04_A', (0,2,-5,0), 'Nhờ cô kiểm tra thiếu sót hồ sơ qua bên bảo hiểm và lưu mã hồ sơ để theo dõi.')
rule('CH07_SC04_B', (0,-2,5,0), 'Gửi phí trước 100.000đ cho người nhắn chưa được xác minh, tiếp tục bỏ cảnh báo.', 'Mức vừa; tổn thất 100.000đ giữ trong Money, không cộng/trừ theo số tiền vào stat.')
rule('CH08_SC02_A', (0,5,-5,0), 'Giữ đủ 3 triệu dễ rút cho mục tiêu gần; chia 4 triệu trái phiếu và 3 triệu cổ phiếu giảm tập trung.', 'Giảm rủi ro tương đối, không coi trái phiếu/cổ phiếu chắc chắn an toàn hoặc có lãi.')
rule('CH08_SC02_B', (0,0,10,0), 'Chỉ 1 triệu dễ rút cho nhu cầu gần 3 triệu, 9 triệu tập trung vào cổ phiếu.')
rule('CH08_SC03_A', (0,2,-2,0), 'Hoãn theo lời mời đang thúc mua để tìm hiểu rủi ro, phí, thanh khoản và nguồn độc lập.')
rule('CH08_SC03_B', (0,-5,2,-2), 'Theo bảng xếp hạng và bỏ cảnh báo thay vì bảo vệ mục tiêu.', 'Không có giao dịch tại màn này: RISK +2 cho bỏ cảnh báo, bỏ thưởng HAPPINESS +3, dùng -2 cho lựa chọn trái mục tiêu.')
rule('CH08_SC04_A', (0,2,0,0), 'Hẹn xem lại bản kế hoạch vừa lập nhưng kết quả mini-game có thể còn thiếu nguồn bù.', 'Bỏ SAVING +6/GOAL +6 mặc định. Chỉ +2 GOAL cho bước theo dõi; muốn +5 cần xác nhận life_plan_feasible từ kết quả thật, không chỉ chọn câu này.')
rule('CH08_SC04_B', (0,-5,5,0), 'Giữ tiết kiệm 600.000đ và chi thêm 400.000đ khi kế hoạch tháng khó chưa có nguồn bù khả thi.')

# Eight missing primary choices. The other 39 missing records are navigation,
# obligatory ledger events, preferences or separately scored reflection.
NEW = {
 'CH04_PRIORITY_NEEDS': ((1,1,1), 'I1: nêu nhu cầu/pin/bảo hành, chưa kiểm tra chứng từ; C1: xét tổng ngân sách nhưng chưa tính 2.500.000 - 500.000; P1: có tiêu chí, chưa có bước theo dõi.'),
 'CH04_PRIORITY_FRIENDS': ((0,0,0), 'I0: dùng mẫu bạn bè thay dữ kiện cá nhân; C0: bỏ tổng chi phí; P0: không đối chiếu mục tiêu giữ 500.000đ.'),
 'CH04_PRIORITY_CHEAP': ((1,0,0), 'I1: chú ý giá nhưng thiếu pin/bảo hành/ứng dụng; C0: giá thấp không phải tổng chi phí; P0: chưa có phương án đáp ứng việc học.'),
 'CH04_CANCEL': ((2,1,2), 'I2: thực hiện và lưu xác nhận hủy; C1: biết tránh phí 50.000đ/tháng nhưng nhãn chưa tính 11 × 50.000; P2: hành động trước hạn và giữ bằng chứng.'),
 'CH04_KEEP': ((1,1,0), 'I1: biết phí từng tháng; C1: biết 50.000đ/tháng nhưng chưa dùng tổng 550.000đ; P0: tổng A 2.150.000đ vượt trần 2.000.000đ, chưa có nguồn bù.'),
 'CH04_RECAP_RECEIPT': ((2,1,2), 'I2: kiểm tra hóa đơn qua bộ phận chính thức; C1: nhận diện phí tranh chấp 100.000đ, chưa có phép đối chiếu đầy đủ; P2: tìm hỗ trợ để sửa sai và theo dõi.'),
 'CH04_RECAP_BUDGET': ((1,2,1), 'I1: biết thiếu tiền nhưng nguồn bù chưa kiểm chứng; C2: ghi đúng thiếu 2.300.000 - 2.000.000 = 300.000đ; P1: có thời hạn kiểm tra, chưa có nguồn bù thực.'),
 'CH04_RECAP_SUBSCRIPTION': ((1,1,1), 'I1: nhận ra thuê bao thực tế; C1: chưa ghi phép tính tổng chi phí và số thiếu; P1: muốn điều chỉnh nhưng chưa nêu nguồn bù và hạn kiểm tra.'),
}

# Observable rationale for the existing decision scores. Retain the supplied
# values unless a specific correction is stated below; do not infer mastery
# merely from reading an inspect card.
EVIDENCE = {
 'CH01_SC02_CHOICE_A': 'I0 bỏ thông tin cần/muốn; C0 bỏ phần còn lại sau 250.000đ; P0 làm hụt tiền lớp vẽ.',
 'CH01_SC02_CHOICE_B': 'I1 biết món cũ còn dùng được; C1 chưa nêu tổng giá; P2 ưu tiên lớp vẽ và hoãn một tuần.',
 'CH01_SC02_CHOICE_C': 'I2 xét dữ kiện giá và nhu cầu; C2 so tổng giá và phần không còn để tiết kiệm; P2 hoãn để giữ mục tiêu.',
 'CH02_SC03_CHOICE_A': 'I2 dùng thu nhập/chi thiết yếu/dự trù; C2 tính 1.000.000 × 6; P1 có lịch nhưng dự trù mỏng, chưa có ứng phó.',
 'CH02_SC03_CHOICE_B': 'I2 dùng thu nhập/chi thiết yếu/dự trù; C1 dùng 800.000 và 8 tháng nhưng chưa giải thích vượt đích 400.000đ; P2 lịch cân bằng và duy trì dự trù.',
 'CH02_SC04_CHOICE_A': 'I2 xác định đúng quỹ dự trù; C2 kiểm tra đủ 200.000đ (requires); P2 xử lý sửa xe và giữ lịch laptop.',
 'CH02_SC04_CHOICE_B': 'I1 biết nguồn tiền laptop; C1 biết khoản sửa xe nhưng chưa tính lại đủ lịch; P1 chấp nhận lùi mục tiêu, thiếu theo dõi.',
 'CH03_SC02_CHOICE_A': 'I2 kiểm tra điều kiện khóa học và nguồn độc lập; C1 xét phí 200.000đ, chưa tính thu nhập ròng; P2 đối chiếu trước khi đăng ký.',
 'CH03_SC02_CHOICE_B': 'I0 tin bảo đảm chưa xác minh; C0 bỏ phí/nguồn trả; P0 đăng ký ngay chưa cân đối.',
 'CH03_SC03_CHOICE_A': 'I2 đối chiếu khóa học/nguồn tuyển dụng; C2 dùng 10 ≤ 12 giờ và 200.000 ≤ 300.000đ; P2 phù hợp lịch học. Cần ghi nhận phép so sánh do người chơi thực hiện trước khi cho đủ 2.',
 'CH03_SC03_CHOICE_B': 'I0 bỏ giới hạn thời gian; C0 bỏ 16 - 12 = 4 giờ vượt; P0 xung đột lịch học.',
 'CH03_SC03_CHOICE_C': 'I2 xét công việc theo dữ kiện; C2 dùng 12 ≤ 12 giờ và lợi nhuận sau chi phí; P2 có dự phòng tháng ít khách. Chỉ đủ 2 khi có bằng chứng tính/lập kế hoạch của người chơi.',
 'CH04_SC02_A': 'I1 mở bảng nhưng chưa kiểm tra thuê bao thực; C1 nhãn chưa dùng tổng 1.600.000 hoặc 2.150.000 so với trần 2.000.000đ; P1 mới chọn máy, chưa thực hiện hủy/theo dõi. Nâng từng chiều lên 2 khi có bằng chứng tương ứng.',
 'CH04_SC02_B': 'I1 mở bảng nhưng chưa kiểm tra pin/bảo hành thực; C1 chưa dùng tổng 1.300.000 + 250.000 nếu thay pin; P1 mới chọn máy, chưa ghi cách quản lý pin/theo dõi. Nâng từng chiều lên 2 khi có bằng chứng tương ứng.',
 'CH04_SC02_C': 'I0 bỏ nhu cầu/giới hạn; C0 bỏ thiếu 300.000đ; P0 chưa có nguồn bù.',
 'CH04_SC03_A': 'I1 nhận ra phí chưa rõ nhưng nhãn chưa chứng minh đối chiếu chứng từ; C1 biết có phí chênh nhưng chưa nêu phép so 100.000đ; P1 muốn hỏi trước khi trả, chưa nêu lưu chứng từ/theo dõi. Nâng từng chiều lên 2 khi có hành động tương ứng.',
 'CH04_SC03_B': 'I0 bỏ chứng từ; C0 không kiểm tra chênh 100.000đ; P0 trả khoản chưa rõ mà không xử lý.',
 'CH05_SC02_A': 'I2 đối chiếu đúng từng nhà cung cấp/phạm vi bảo vệ; C1 xét ngày rút nhưng chưa tính lãi/phí; P2 chọn cách kiểm tra phù hợp lịch cần tiền.',
 'CH05_SC02_B': 'I0 tin lãi quảng cáo; C0 chưa tính lãi ròng/điều kiện; P0 chưa bảo vệ lịch học phí.',
 'CH05_PROVIDER_GENERALIZE': 'I0 suy rộng điều kiện sang ứng dụng khác; C0 chưa kiểm tra phí/lãi riêng; P0 dùng giả định chưa xác minh.',
 'CH05_B_MATURITY': 'I2 biết kỳ hạn; C2 hiểu giữ 12 tháng; P0 trái lịch cuối tháng 3. C2 cần người chơi thực sự đối chiếu hai mốc, không lấy lời thoại sau chọn làm bằng chứng.',
 'CH05_SC04_A': 'I2 xét lãi trước hạn 2%/năm và không phí; C2 tính 1.000.000 × 2% × 3/12 = 5.000đ; P2 có 1.005.000đ vào đúng hạn. Đủ 2 cần kết quả tính đúng trong phần học.',
 'CH05_SC04_C': 'I0 bỏ phí; C0 không nhận ra còn 992.500đ; P0 không bù thiếu 7.500đ.',
 'CH05_TOPUP_VERIFIED': 'I2 kiểm tra ngân sách chưa chi; C2 bù đúng 7.500đ; P2 nêu khoản giải trí và hạn kiểm tra cuối tháng 1.',
 'CH05_TOPUP_PROMISE': 'I0 chưa kiểm tra nguồn bù; C0 chưa xử lý thiếu 7.500đ; P0 chỉ hẹn tính sau.',
 'CH05_TOPUP_UNVERIFIED': 'I0 bỏ nguồn đã xem; C0 không xử lý thiếu 7.500đ; P0 giữ chi và chưa có phương án bù.',
 'CH06_SC02_A': 'I2 xem ba gói và nguồn lực; C2 dùng tổng trả và khả năng tích lũy; P2 chọn phương án khả thi có lịch. Nhãn chưa ghi con số/thời hạn, cần bằng chứng từ mini-game hoặc bổ sung nhãn.',
 'CH06_SC02_B': 'I1 biết gói B nhưng nguồn thu chưa xác minh; C1 nêu 550.000đ/tháng trong 12 tháng, chưa dùng tổng 6.600.000đ và tháng giảm thu; P1 mới tìm hiểu, cần kiểm tra nguồn thu/ngày trả.',
 'CH06_SC02_C': 'I0 bỏ tiền thực nhận/khấu trừ; C0 bỏ tổng 1.000.000đ/tháng và thiếu 600.000đ; P0 chưa có cách trả/bù.',
 'CH06_SC03_A': 'I1 nhận ra dư nợ; C1 muốn tính phần còn lại nhưng chưa nêu kết quả; P1 định tìm nguồn tháng sau, chưa có nguồn và hạn kiểm tra cụ thể.',
 'CH06_SC03_B': 'I0 bỏ nghĩa vụ; C0 không xử lý phần còn lại; P0 để tháng sau tính.',
 'CH07_SC02_A': 'I2 dùng điều kiện bảo hiểm và chứng từ; C2 đối chiếu 300.000đ với tiền sẵn; P2 thanh toán và giữ giấy tờ nộp hồ sơ. Không coi tiền hoàn là chắc chắn có.',
 'CH07_SC02_B': 'I0 bỏ tiền sẵn và điều kiện vay; C0 chưa so tổng trả; P0 tạo nghĩa vụ chưa có kế hoạch.',
 'CH07_SC02_C': 'I0 bỏ điều kiện giải quyết chi phí; C0 chưa xác định nguồn trả; P0 trì hoãn chưa có bước xử lý.',
 'CH07_SC03_A': 'I2 dùng kênh chính thức/lưu tin; C1 nhận ra yêu cầu 200.000đ cần kiểm tra, không có phép tính đầy đủ; P2 xác minh và giữ bằng chứng.',
 'CH07_SC03_B': 'I0 tin tin nhắn xin OTP; C0 chỉ nhìn 200.000đ hứa nhận; P0 lộ dữ liệu.',
 'CH07_SC04_A': 'I2 hỏi bảo hiểm về điều kiện thiếu; C1 nhận diện khoản/điều kiện nhưng chưa tính hoàn; P2 lưu mã hồ sơ để theo dõi.',
 'CH07_SC04_B': 'I0 tin người lạ; C0 bỏ kiểm tra phí 100.000đ; P0 trả trước chưa xác minh.',
 'CH08_SC02_A': 'I2 phân biệt rủi ro và thanh khoản; C2 phân bổ 3 + 4 + 3 = 10 triệu, giữ 3 triệu cần gần; P2 đa dạng hóa theo lịch dùng tiền.',
 'CH08_SC02_B': 'I0 bỏ thanh khoản/rủi ro; C0 chỉ giữ 1/3 triệu cần gần; P0 tập trung 9 triệu cổ phiếu.',
 'CH08_SC03_A': 'I2 tìm bằng chứng/nguồn độc lập; C1 chưa có phép tính chi phí đầy đủ; P2 hoãn và kiểm tra trước quyết định. Chỉ đủ I2 khi có thao tác kiểm chứng trong phần claims.',
 'CH08_SC03_B': 'I0 tin xếp hạng; C0 bỏ phí/khả năng lỗ; P0 chạy theo thúc mua.',
 'CH08_SC04_A': 'I1 biết có bản kế hoạch; C1 chưa chứng minh kết quả đúng; P1 hẹn cuối tháng xem lại nhưng tính khả thi phụ thuộc kết quả mini-game.',
 'CH08_SC04_B': 'I0 bỏ dữ kiện tháng khó; C0 không cân đối 600.000 + 400.000đ với tiền còn; P0 thiếu nguồn bù.',
}
EVIDENCE['CH03_SC03_REVISE_A'] = EVIDENCE['CH03_SC03_CHOICE_A']
EVIDENCE['CH03_SC03_REVISE_C'] = EVIDENCE['CH03_SC03_CHOICE_C']
EVIDENCE['CH03_SC03_REVISE_KEEP'] = EVIDENCE['CH03_SC03_CHOICE_B']
CORRECTED_SCORES = {
    'CH04_SC02_A': (1,1,1), 'CH04_SC02_B': (1,1,1),
    'CH04_SC03_A': (1,1,1),
    'CH06_SC02_B': (1,1,1), 'CH06_SC03_A': (1,1,1),
    'CH08_SC04_A': (1,1,1),
}

def main():
    source = Path(sys.argv[1])
    raw = source.read_bytes()
    with source.open(encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        fields = reader.fieldnames
        rows = list(reader)
    assert len(rows) == 98 and len(fields) == 15
    original = [dict(row) for row in rows]
    assert len({(r[fields[1]], r[fields[2]]) for r in rows}) == 98
    kinds = Counter()
    missing = Counter()
    seen_rules = set()
    for r in rows:
        scene, oid = r[fields[1]], r[fields[2]]
        current = tuple(int(r[fields[4+i]] or 0) for i in range(4))
        scores = tuple(int(r[fields[8+i]]) for i in range(3)) if r[fields[8]] != '' else None
        if scores is None:
            missing[r[fields[0]]] += 1
        notes = []
        if oid in RULES:
            stats, basis, note = RULES[oid]
            seen_rules.add(oid)
            if note:
                notes.append(note)
        else:
            assert current == (0,0,0,0), (oid, current)
            stats = (0,0,0,0)
            basis = 'Không có delta trong 2.7.2; chưa thêm thưởng/phạt cho bước này.'
        refs = []
        for stat, value in zip(STATS, stats):
            refs.append(f'{stat}{"+" if value > 0 else "−"}: mục 6, dòng {stat}, “{QUOTES[(stat, 1 if value > 0 else -1)]}”' if value else f'{stat}=0: không đủ căn cứ thêm thay đổi ở bước này')
        r[fields[11]] = '; '.join(refs) + '. Tình huống: ' + basis
        r[fields[12]] = '; '.join(f'{stat}={value:+d} ({ {0:"không đổi",2:"nhỏ",5:"vừa",10:"lớn"}[abs(value)]})' for stat, value in zip(STATS, stats)) + '. Thang chung 0/±2/±5/±10; điểm gameplay, không phải VND.'
        if oid in NEW:
            kind = 'lựa chọn chính bổ sung'
            proposed, rationale = NEW[oid]
            r[fields[13]] = f'I={proposed[0]}; C={proposed[1]}; P={proposed[2]}. ' + rationale
            notes.append('Đề xuất bổ sung evidenceScores sau khi lead duyệt. Cần lưu thao tác/chứng từ thực nếu rubric yêu cầu, không lấy lời thoại tự chạy làm bằng chứng.')
            if oid.startswith('CH04_RECAP_'):
                notes.append('Sửa quyết định cũ trong cùng nhóm: giữ lần đầu trong lịch sử, thay điểm hiệu lực; không cộng lần hai.')
        elif scores is not None:
            kind = 'lựa chọn chính đã có điểm'
            assert oid in EVIDENCE, oid
            proposed = CORRECTED_SCORES.get(oid, scores)
            r[fields[13]] = f'I={proposed[0]}; C={proposed[1]}; P={proposed[2]}. ' + EVIDENCE[oid]
            if oid in CORRECTED_SCORES:
                notes.append(f'Đề xuất đổi I/C/P {scores[0]}/{scores[1]}/{scores[2]} → {proposed[0]}/{proposed[1]}/{proposed[2]} theo bằng chứng hiện có; chỉ nâng lên 2 khi bổ sung thao tác/tính toán/kế hoạch tương ứng.')
        elif '_R1' in scene or '_R2' in scene:
            kind = 'phản tư'
            # Existing reflectionScore is the separate scoring channel.
            level = {'A':2,'B':1,'C':0,'1':2,'2':1,'3':0}[oid.rsplit('_',1)[1]]
            r[fields[13]] = f'Không chấm I/C/P riêng (không phải 0/0/0); giữ reflectionScore={level}/2: ' + {2:'nêu đủ dữ kiện/lập luận hoặc đánh đổi/bước tiếp theo',1:'nêu đúng một phần, còn thiếu kiểm chứng hoặc kế hoạch',0:'bỏ dữ kiện, phép tính hoặc đánh đổi/bước tiếp theo'}[level] + '.'
            notes.append('GDD v3 mục 7: reflection là thành phần riêng; không đưa thêm vào mẫu số điểm lựa chọn.')
        else:
            kind = 'điều hướng/giao dịch bắt buộc/sở thích'
            if 'PAY_MONTH' in oid:
                detail = 'Chỉ xác nhận giao dịch bắt buộc 50.000đ tháng này; không có phương án để so sánh.'
            elif '_CONFIRM_' in oid or '_BACK_' in oid:
                detail = 'Xác nhận hoặc quay lại phương án mua đã chọn; không phát sinh quyết định độc lập để chấm lần hai.'
            elif oid in ('CH06_WANT_HOME','CH06_WANT_WAIT'):
                detail = 'Bày tỏ ưu tiên/lo lắng; cả hai hợp lệ, chưa phải cam kết vay và không có đáp án tài chính đúng/sai.'
            elif oid == 'CH04_RECAP_KEEP' or oid == 'CH05_CONTINUE':
                detail = 'Nút đi tiếp tới phản tư; không cung cấp minh chứng mới.'
            else:
                assert r[fields[0]] == 'CH05', oid
                detail = 'Bước mở/đi tới dữ kiện hoặc chọn nhánh tạm (deferLedger); chấm ở lựa chọn xác nhận kế hoạch/nhà cung cấp sau đó.'
            r[fields[13]] = 'Không chấm I/C/P (không phải 0/0/0). ' + detail
            notes.append('Không thêm evidenceScores, loại bước này khỏi mẫu số choice node; không diễn giải thiếu điểm là năng lực bằng 0.')
        kinds[kind] += 1
        notes.insert(0, 'Phân loại: ' + kind + '.')
        if current != stats:
            notes.append('Delta cũ → đề xuất: ' + ', '.join(f'{s} {a:+d}→{b:+d}' for s,a,b in zip(STATS,current,stats) if a != b) + '.')
        notes.append('Chỉ là đề xuất để lead kiểm/nhập; chưa áp dụng vào Studio và chưa phát hành.')
        r[fields[14]] = ' '.join(notes)
    assert seen_rules == set(RULES), set(RULES)-seen_rules
    assert sum(missing.values()) == 47, missing
    assert kinds['lựa chọn chính bổ sung'] == 8
    assert all(all(r[f] != '' for f in fields[11:]) for r in rows)
    assert all([r[f] for f in fields[:11]] == [o[f] for f in fields[:11]] for r,o in zip(rows,original))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    # Reparse the delivered CSV, including embedded commas and Vietnamese text.
    with OUT.open(encoding='utf-8-sig', newline='') as f:
        assert list(csv.DictReader(f)) == rows
    audit = {'source':source.name, 'sourceSha256':hashlib.sha256(raw).hexdigest(),
             'rows':len(rows), 'columns':len(fields), 'originalColumnsUnchanged':11,
             'filledHAColumns':4, 'missingICPByChapter':dict(sorted(missing.items())),
             'classification':dict(kinds), 'allowedMagnitudes':[0,2,5,10],
             'studioApplied':False, 'published':False,
             'outputSha256':hashlib.sha256(OUT.read_bytes()).hexdigest()}
    (ROOT/'scripts/content-migrations/choice-rules-2026-11-24.audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(audit,ensure_ascii=True,indent=2))

if __name__ == '__main__':
    main()
