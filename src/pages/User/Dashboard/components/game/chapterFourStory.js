export const chapterFourChoices = [
  {id:'work',label:'Nhận đủ ca, bỏ buổi ôn',time:'Làm 13–17h · Không ôn bài',cash:100000,hint:'Nhận 120.000đ, trừ 20.000đ tiền xe. Bài kiểm tra thứ Hai vẫn đang chờ.',icon:'wallet'},
  {id:'study',label:'Xin nghỉ ca này để ôn bài',time:'Ôn cùng nhóm rồi tự luyện thêm',cash:0,hint:'Không nhận tiền tuần này. Anh Quân đồng ý giữ cơ hội làm vào tuần sau.',icon:'book'},
  {id:'balance',label:'Xin làm nửa ca, sau buổi ôn',time:'Ôn 13–14h30 · Làm 15–17h',cash:40000,hint:'Anh Quân đồng ý trả 60.000đ. Tiền xe vẫn 20.000đ; em tự luyện ít hơn.',icon:'clock'},
];

export const chapterFourEndings = {
  work:{grade:4,firstPay:100000,laterPay:0,total:100000,workAllowed:false,title:'Một trăm nghìn, rồi dừng lại.',flag:'work_over_study',frames:[
    {when:'Thứ Hai · Sau bài kiểm tra',speaker:'Minh',text:'4 điểm… Hai dạng bài này Linh đã ôn cùng nhóm. Hôm đó mình đi làm, tối về lại không mở vở.',prop:'Bài kiểm tra: 4/10'},
    {when:'Tối hôm đó · Phòng khách',speaker:'Mẹ',text:'Mẹ đồng ý cho con thử làm, nhưng con đã bỏ phần ôn tập. Ba tuần còn lại của tháng, con tạm nghỉ làm để học lại nhé.',prop:'Ba ca tiếp theo: hủy'},
    {when:'Cuối tháng · Nhìn lại',speaker:'Minh',text:'Ca đầu mình giữ được 100.000đ. Sau đó không được đi làm tiếp, cả tháng chỉ có đúng 100.000đ. Mình đã nhìn tiền của một buổi mà quên cơ hội phía sau.',prop:'100.000đ + 0đ = 100.000đ'},
  ]},
  study:{grade:8,firstPay:0,laterPay:300000,total:300000,workAllowed:true,title:'Chậm một ca, giữ được đường dài.',flag:'study_first',frames:[
    {when:'Thứ Hai · Sau bài kiểm tra',speaker:'Minh',text:'8 điểm! Mình nhận ra dạng bài đã ôn với Linh. Buổi chiều tự luyện thêm cũng giúp mình làm chắc hơn.',prop:'Bài kiểm tra: 8/10'},
    {when:'Tối hôm đó · Phòng khách',speaker:'Mẹ',text:'Tuần này con chưa kiếm được tiền, nhưng con biết sắp xếp việc học. Ba tuần tới, con có thể nhận ca sau khi đã hoàn thành bài nhé.',prop:'Được tiếp tục làm ngoài giờ học'},
    {when:'Ba tuần sau · Cuối tháng',speaker:'Minh',text:'Mình đã hoàn thành ba ca không trùng lịch học, mỗi ca giữ lại 100.000đ. Tuần đầu không có tiền, nhưng cuối tháng mình vẫn kiếm được 300.000đ.',prop:'0đ + 3 × 100.000đ = 300.000đ'},
  ]},
  balance:{grade:7,firstPay:40000,laterPay:300000,total:340000,workAllowed:true,title:'Hỏi thêm một câu, có thêm một cách.',flag:'negotiated_shift',frames:[
    {when:'Thứ Hai · Sau bài kiểm tra',speaker:'Minh',text:'7 điểm. Mình làm được phần đã ôn với nhóm, nhưng câu cuối còn sai vì chưa luyện thêm. Ca ngắn giúp mình giữ cả việc học lẫn trải nghiệm làm việc.',prop:'Bài kiểm tra: 7/10'},
    {when:'Tối hôm đó · Phòng khách',speaker:'Mẹ',text:'Con đã chủ động xin đổi thời lượng, mẹ đồng ý cho con làm tiếp. Nhớ dành thêm thời gian luyện phần còn yếu trước mỗi ca nhé.',prop:'Được làm tiếp, cần bổ sung lịch tự học'},
    {when:'Ba tuần sau · Cuối tháng',speaker:'Minh',text:'Ca đầu còn 40.000đ sau tiền xe. Ba tuần sau, mình học xong rồi mới nhận ba ca đầy đủ. Tổng cộng 340.000đ, và mình hiểu rằng có thể hỏi để tìm phương án khác.',prop:'40.000đ + 3 × 100.000đ = 340.000đ'},
  ]},
};

export function chapterFourOutcome(choiceId) {
  const ending=chapterFourEndings[choiceId];
  if(!ending)throw new Error('Unknown chapter four choice');
  return {chapterId:4,sceneId:'4.3',nextSceneId:'4.4',choiceId,flags:{F_JOB_ROUTE:'event',F_WORK_STUDY_BALANCE:ending.flag,F_PART_TIME_ALLOWED:ending.workAllowed},grade:ending.grade,firstWeekNet:ending.firstPay,monthNet:ending.total};
}
