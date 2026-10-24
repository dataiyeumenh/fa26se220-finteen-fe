// Ảnh chụp nội dung bản phát hành từ BE (GET /api/content/releases/{version}/chapters/{code}) làm dữ liệu test — FE không còn file chương tĩnh
// (Hưng 24/10: một nguồn). Chụp lại khi phát hành bản mới: xem ops/finteen-assets (bản đang chụp ghi trong JSON: releaseVersion).
import ch1 from "./CH01.json" with { type: "json" };
import ch2 from "./CH02.json" with { type: "json" };
import ch3 from "./CH03.json" with { type: "json" };
import ch4 from "./CH04.json" with { type: "json" };
import ch5 from "./CH05.json" with { type: "json" };
import ch6 from "./CH06.json" with { type: "json" };
import ch7 from "./CH07.json" with { type: "json" };
import ch8 from "./CH08.json" with { type: "json" };
export const chapter1V2GameData = ch1;
export const chapter2V2GameData = ch2;
export const chapter3V2GameData = ch3;
export const chapter4V2GameData = ch4;
export const chapter5V2GameData = ch5;
export const chapter6V2GameData = ch6;
export const chapter7V2GameData = ch7;
export const chapter8V2GameData = ch8;
