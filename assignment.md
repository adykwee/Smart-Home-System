Timeline thực hiện cho các nhóm sinh viên (Tuần 10 - Tuần 24, giữa kỳ: Tuần 14)

# 1) Mục tiêu và nguyên tắc triển khai

Trong học phần Đồ án Đa ngành, mỗi nhóm cần xây dựng prototype một hệ thống MVP có sự kết hợp giữa phần cứng và phần mềm, có khả năng demo các chức năng cốt lõi theo module, đồng thời thể hiện rõ năng lực làm việc nhóm, thiết kế hệ thống, triển khai, kiểm thử và trình bày kết quả bằng tài liệu báo cáo.

Vì đây là một môn học hướng tới khả năng triển khai hệ thống thực tế, nhóm không được làm theo kiểu "làm đến đâu viết đến đó" hay chỉ tập trung code. Thay vào đó, nhóm cần đi theo **quy trình phát triển phần mềm đầy đủ**:

**Requirement Analysis → System Design (UML/Architecture) → Implementation → Testing/Validation → Demo/Report**.

Nếu không làm requirement rõ ràng, nhóm dễ chọn sai phạm vi và "vỡ kế hoạch"; nếu không có thiết kế, nhóm sẽ khó chia việc, khó tích hợp, khó bảo trì; nếu không có kiểm thử, hệ thống sẽ dễ lỗi khi demo, đặc biệt ở phần giao tiếp thiết bị và xử lý dữ liệu theo thời gian thực.

Ngoài ra, vì **tất cả nhóm đều theo hướng CNPM**, nhóm bắt buộc phải thể hiện năng lực **thiết kế phần mềm có cấu trúc**, có phân tách lớp/thành phần rõ ràng, có áp dụng **Design Pattern** phù hợp với nghiệp vụ và kiến trúc, thay vì viết mã theo kiểu chắp vá. Việc này không chỉ nhằm "đúng hướng CNPM", mà còn giúp hệ thống dễ mở rộng, dễ kiểm thử, và giảm rủi ro tích hợp khi dự án bước vào giai đoạn hoàn thiện.

###

# 2) Các cột mốc bắt buộc trong học kỳ

- **Tuần 10 → 13:** Hoàn thiện yêu cầu và thiết kế để sẵn sàng lập trình trong nhóm có kiểm soát.
- **Tuần 14:** **Báo cáo/Demo giữa kỳ** - trọng tâm kiểm tra tài liệu và khả năng giao tiếp thiết bị qua server.

- **Tuần 15 → 22:** Lập trình đầy đủ 5 module, tích hợp và kiểm thử hệ thống.
- **Tuần 23 → 24:** Chốt báo cáo tổng kết và demo cuối kỳ đầy đủ các module theo rubric.

# **3) Kế hoạch chi tiết theo tuần**

## **Tuần 10 - Khởi động lại dự án và định hình phạm vi MVP**

Trong tuần này, nhóm cần thống nhất lại mục tiêu, phạm vi và cách làm việc. Nhóm phải làm rõ "MVP của nhóm sẽ demo được gì", các thành phần hệ thống gồm những gì và trách nhiệm từng thành viên. Việc làm rõ sớm giúp tránh tình trạng tuần sau phải thay đổi lớn do hiểu sai yêu cầu hoặc chọn phạm vi quá rộng.

**Đầu ra bắt buộc:**

(1) Tóm tắt đề tài và mục tiêu MVP, (2) danh sách chức năng dự kiến và mapping sơ bộ vào các module, (3) phân công vai trò, (4) biên bản họp nhóm.

**Tiêu chí hoàn thành:**

Tất cả thành viên phải nắm rõ phạm vi MVP và kế hoạch giao tiếp; phân công không "chung chung", mỗi vai trò gắn với đầu việc cụ thể; nhóm có kênh quản lý công việc (ví dụ: Trello/GitHub Projects/Notion) và quy ước báo cáo.

##

## **Tuần 11 - Requirement Analysis và đặc tả yêu cầu (SRS)**

Tuần 11 tập trung vào **đặc tả yêu cầu**: nhóm cần mô tả đúng nhu cầu người dùng và các ràng buộc hệ thống, chuyển "ý tưởng" thành "yêu cầu có thể kiểm thử". Lý do phải làm SRS là để bảo đảm nhóm có cơ sở rõ ràng cho thiết kế và đánh giá; nếu chỉ nói miệng hoặc mô tả mơ hồ, nhóm rất dễ bỏ sót chức năng hoặc tranh cãi khi tích hợp.

**Đầu ra bắt buộc:**

SRS v1.0 gồm functional requirements, non-functional requirements, constraints/assumptions; Use case list và Use case diagram; mô tả use case quan trọng (ít nhất các luồng chính liên quan tới nhận dữ liệu, kiểm tra ngưỡng, điều khiển, lưu lịch sử, và giao diện ứng dụng).

**Tiêu chí hoàn thành:**

Các yêu cầu của đề tài phải "đo được" và "kiểm thử được"; không viết theo kiểu khẩu hiệu; tối thiểu phải xác định rõ các module hệ thống cần demo, tương ứng với định hướng MVP của môn học.

##

## **Tuần 12 - Thiết kế kiến trúc tổng thể và dữ liệu**

Sau khi có yêu cầu, nhóm cần chuyển sang thiết kế kiến trúc và dữ liệu. Đây là bước quan trọng vì hệ thống đa ngành thường có nhiều thành phần: thiết bị, server giao tiếp, backend, database, web/app. Nếu không có kiến trúc rõ ràng, nhóm sẽ khó phân chia nhiệm vụ, khó kiểm soát giao tiếp giữa các module và khó đảm bảo hệ thống chạy ổn định.

**Đầu ra bắt buộc:**

Tài liệu kiến trúc (Architecture Doc) mô tả các thành phần và luồng dữ liệu; sơ đồ triển khai (Deployment Diagram) và sơ đồ thành phần (Component Diagram); ERD hoặc database schema; lựa chọn công nghệ và lý do lựa chọn. **Vì thời gian có hạn nên nhóm chỉ cần thiết kế cho phiên bản MVP.**

**Tiêu chí hoàn thành:**

Các thành phần chính phải đầy đủ và có quan hệ rõ ràng; mô tả được dữ liệu đi từ thiết bị đến backend và lên UI; database thiết kế phù hợp với lịch sử hoạt động và truy vấn.

## **Tuần 13 - Thiết kế chi tiết (UML), API contract và áp dụng CNPM**

Tuần 13 nhằm "khóa" thiết kế ở mức đủ chi tiết để bước sang implementation mà không phải suy đoán. Đặc biệt với hướng CNPM, nhóm cần thể hiện tư duy thiết kế qua UML và áp dụng Design Pattern hợp lý. Lý do của bước này là: nếu nhóm vào code quá sớm mà không có contract API và sequence rõ ràng, việc ghép hệ thống sẽ phát sinh xung đột, chậm tiến độ và khó debug.

**Đầu ra bắt buộc:**

Sequence diagram cho các luồng chính; API specification (endpoint, request/response, error codes); wireframe UI; tài liệu đề xuất Design Pattern sẽ dùng (ví dụ: MVC/MVVM, Repository, Factory, Strategy, Observer, State, Adapter…) và cách áp dụng trong kiến trúc.

**Tiêu chí hoàn thành:**

Có "hợp đồng" giao tiếp giữa các thành phần (API contract) rõ ràng; mỗi module có sequence/luồng xử lý; Design Pattern không nêu tên cho có mà phải gắn với vấn đề cụ thể trong hệ thống.

## **Tuần 14 - Báo cáo/Demo giữa kỳ (milestone bắt buộc)**

Giữa kỳ chủ yếu kiểm tra các công việc đã làm và khả năng hệ thống **giao tiếp được với thiết bị qua server** bằng việc demo gửi - nhận dữ liệu. Đây là cột mốc giúp "khóa rủi ro" sớm: nếu đến giai đoạn sau mới phát hiện không kết nối được, nhóm sẽ không kịp hoàn thiện các module còn lại.

**Đầu ra bắt buộc:**

Demo giao tiếp thiết bị; nộp bộ tài liệu requirement + thiết kế đã chốt; biên bản/slide giữa kỳ.

**Tiêu chí hoàn thành:**

Mức tốt nhất là hệ thống giao tiếp thiết bị ổn định (mục tiêu 10 điểm giữa kỳ theo hướng dẫn).

## **Tuần 15 - Implement Module 1 & 2 (Input và kiểm tra ngưỡng)**

Sau giữa kỳ, nhóm bắt đầu hiện thực các module một cách có hệ thống. Module 1 và 2 là nền tảng vì dữ liệu đầu vào và logic kiểm tra điều kiện sẽ chi phối phần lớn behavior của hệ thống. Làm chắc giai đoạn này giúp nhóm giảm lỗi lan truyền sang các module khác.

**Đầu ra bắt buộc:**

Nhận dữ liệu input và hiển thị; logic kiểm tra ngưỡng; logging cơ bản.

**Tiêu chí hoàn thành:**

Dữ liệu hiển thị đúng và cập nhật ổn định; ngưỡng không hard-code cứng nhắc (có cấu hình hoặc quản trị); có log để truy vết lỗi.

##

## **Tuần 16 - Implement Module 3 (Điều khiển output)**

Module 3 kiểm tra khả năng hệ thống phát lệnh điều khiển và phản hồi trạng thái. Đây là phần dễ phát sinh lỗi do liên quan đến đồng bộ trạng thái, xử lý lỗi mất kết nối và an toàn.

**Đầu ra bắt buộc:**

Giao diện điều khiển trên web/app; backend nhận lệnh; thiết bị phản hồi trạng thái.

**Tiêu chí hoàn thành:**

Điều khiển được tối thiểu 2 output; có phản hồi trạng thái (không chỉ "bấm cho có"); có xử lý lỗi cơ bản.

## **Tuần 17 - Implement Module 4 (Lưu lịch sử hoạt động)**

Module 4 thường chiếm nhiều công sức vì liên quan đến thiết kế dữ liệu, truy vấn và hiển thị lịch sử. Mục tiêu không chỉ lưu raw data mà cần thể hiện giá trị sử dụng: người dùng xem được lịch sử thiết bị/nhật ký hoạt động, lọc theo thời gian và theo loại sự kiện.

**Đầu ra bắt buộc:**

Bảng dữ liệu lịch sử; trang hiển thị lịch sử; API truy vấn lịch sử.

**Tiêu chí hoàn thành:**

Lưu đúng sự kiện input/output; truy vấn được; giao diện hiển thị rõ ràng.

## **Tuần 18 - Implement Module 5 (Ứng dụng Web/Mobile hoàn chỉnh)**

Module 5 là "mặt tiền" của hệ thống và đóng tỷ trọng lớn trong demo theo rubric. Do đó nhóm cần hoàn thiện luồng trải nghiệm, quản lý người dùng (nếu có), dashboard, và kết nối đầy đủ với các module.

**Đầu ra bắt buộc:**

Web/app chạy ổn; dashboard; tích hợp API; các màn hình chính theo use case.

**Tiêu chí hoàn thành:**

Không phải chỉ có vài màn hình tĩnh; dữ liệu và thao tác phải thực sự đi qua hệ thống; UI đủ rõ để demo.

## **Tuần 19 - Hoàn thiện yêu cầu CNPM: Design Pattern và kiến trúc có thể mở rộng**

Vì tất cả nhóm theo hướng CNPM, nên tuần 19 sẽ yêu cầu các nhóm "nâng cấp chất lượng thiết kế" thay vì chỉ thêm tính năng. Nhóm phải rà lại kiến trúc code, tách lớp đúng trách nhiệm, áp dụng Design Pattern đã đề xuất và chứng minh nó giải quyết vấn đề thực sự (mở rộng, thay đổi yêu cầu, thay đổi thiết bị, thay đổi nguồn dữ liệu…).

**Đầu ra bắt buộc:**

Tài liệu mở rộng theo yêu cầu hướng CNPM: pattern đã dùng, vị trí áp dụng, lý do, lợi ích, minh họa trước/sau; refactor code tương ứng.

**Tiêu chí hoàn thành:**

Pattern áp dụng đúng ngữ cảnh; code dễ đọc, tách lớp rõ; có mô tả kiến trúc phần mềm và khả năng mở rộng.

## **Tuần 20 - Integration Testing và Test Plan**

Khi hệ thống đã có đủ module, rủi ro lớn nhất là "mỗi phần chạy riêng nhưng ghép lại lỗi". Tuần 20 yêu cầu nhóm lập kế hoạch kiểm thử tích hợp và thực thi kiểm thử theo kịch bản end-to-end.

**Đầu ra bắt buộc:**

Test Plan, Test Cases; kết quả test tích hợp; checklist kịch bản demo.

**Tiêu chí hoàn thành:**

Có test case cho các tình huống lỗi phổ biến (mất mạng, dữ liệu bất thường, thiết bị không phản hồi); có log và cách tái hiện lỗi.

## **Tuần 21 - System Testing, bug fixing và cải thiện độ ổn định**

Tuần 21 tập trung ổn định hệ thống, vì demo cuối kỳ đánh giá cao khả năng hoạt động trơn tru.Nhóm nên theo hướng "fix triệt để" thay vì vá tạm.

**Đầu ra bắt buộc:**

Bug list (ưu tiên theo mức độ); bản build ổn định; báo cáo cải tiến.

**Tiêu chí hoàn thành:**

Các bug nghiêm trọng (blocker) phải được xử lý; hệ thống chạy ổn với kịch bản demo chuẩn; không còn lỗi cơ bản gây crash.

## **Tuần 22 - User Testing và hoàn thiện trải nghiệm demo**

Tuần 22 giúp nhóm kiểm tra hệ thống dưới góc nhìn người dùng và chuẩn bị câu chuyện demo. Đây là bước thường bị xem nhẹ nhưng lại ảnh hưởng trực tiếp đến chất lượng trình bày: người dùng thử giúp nhóm phát hiện UI khó hiểu, luồng thao tác rối hoặc thiếu thông tin trên màn hình.

**Đầu ra bắt buộc:**

Biên bản user test; danh sách feedback; điều chỉnh UI/flow; kịch bản demo cuối kỳ.

**Tiêu chí hoàn thành:**

Có tối thiểu vài lượt dùng thử thực tế; nhóm có cải tiến cụ thể dựa trên feedback; kịch bản demo mạch lạc.

##

## **Tuần 23 - Viết báo cáo tổng kết và chốt tài liệu**

Báo cáo tổng kết chiếm tỷ trọng lớn, với cấu trúc rõ ràng gồm giới thiệu đề tài, phân tích chức năng, phân công, công nghệ, thiết kế và mô tả chi tiết. Nhóm cần viết báo cáo theo tinh thần "giải thích được hệ thống" thay vì chỉ liệt kê.

**Đầu ra bắt buộc:**

Final report bản gần hoàn chỉnh; phụ lục tài liệu (SRS, UML, Test Plan, HDSD/HDCN); phân công và đóng góp.

**Tiêu chí hoàn thành:**

Đủ các phần theo rubric; có hình minh họa (UML, kiến trúc, giao diện); phần phân công cụ thể, hợp lý.

## **Tuần 24 - Demo cuối kỳ và hoàn tất nộp bài**

Demo cuối kỳ yêu cầu nhóm demo đủ 5 module và thể hiện rõ tính năng hướng CNPM. Nhóm cần chuẩn bị kỹ về môi trường chạy, dữ liệu, thiết bị và phương án dự phòng.

**Đầu ra bắt buộc:**

Demo hệ thống hoàn chỉnh; final report; mã nguồn; hướng dẫn cài đặt và vận hành.

**Tiêu chí hoàn thành:**

Demo được đầy đủ module theo yêu cầu; hệ thống vận hành ổn định; tài liệu đủ để người khác có thể hiểu và chạy lại.

# **4) Yêu cầu quản trị dự án tối thiểu (áp dụng xuyên suốt)**

Để đảm bảo tiến độ và điểm quá trình, nhóm cần duy trì các hoạt động nền tảng sau:  
(1) Họp định kỳ và có biên bản (meeting minutes), (2) quản lý công việc theo task và có minh chứng đóng góp trên công cụ quản lý, với quy trình áp dụng theo Scrum/Agile (Sprint ~ 2 tuần) (3) quản lý mã nguồn qua Git, có pull request/review cơ bản, (4) có checklist milestone theo tuần.

Điều này liên quan trực tiếp tới cách đánh giá điểm quá trình và tính chuyên nghiệp của nhóm.

Mỗi nhóm tạo một Folder chia sẻ trên Google Drive và upload các tài liệu của từng tuần trên đó, sau đó thông báo cho Giảng viên để review trên Telegram.