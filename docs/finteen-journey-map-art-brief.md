# FinTeen — 4 prompt hoàn chỉnh cho bản đồ hành trình

Mỗi khối bên dưới là **một prompt đầy đủ**, không cần ghép thêm prompt chung. Copy nguyên khối tương ứng để gen một ảnh.

## Cách gen để bốn ảnh liên kết

1. Gen ảnh 1 trước, chọn kết quả có bố cục tốt.
2. Gen ảnh 2: đính kèm ảnh 1 làm tham chiếu.
3. Gen ảnh 3: đính kèm ảnh 1 để giữ phong cách và ảnh 2 để nối cảnh.
4. Gen ảnh 4: đính kèm ảnh 1 để giữ phong cách và ảnh 3 để nối cảnh.

Nếu công cụ chỉ nhận một ảnh tham chiếu, dùng ảnh liền trước. Mỗi lần chỉ gen **một background**, không gen collage bốn ảnh.

Yêu cầu xuyên suốt: cùng camera, tỷ lệ công trình, nắng ấm từ phía trên trái, đường màu cát, dòng suối xanh ngọc và cầu đá sáng. Cuối vùng trước hé lộ địa điểm đầu vùng sau. Hai đầu đường ở cùng độ cao để chuyển vùng liền mạch.

Kích thước: PNG 16:9, ưu tiên 2560 × 1440. Prompt 3–4 mới không dùng tọa độ vì công cụ có thể in thông số lên tranh. Sau khi nhận ảnh sẽ căn điểm tương tác theo vị trí sân thực tế.

## Prompt 1 — Từ mái nhà nhỏ · Chương 1–2

Tên file: **finteen-map-01-home.png**

```text
Create ONE landscape background for a premium Vietnamese teen financial education adventure game. This image is one region of a continuous journey across four connected maps. It is a playable game world background, not a poster, infographic, dashboard or collage.

OUTPUT: 16:9 landscape, preferably 2560 x 1440, full bleed, no border.

ART DIRECTION:
Hand-painted 2.5D adventure game illustration, consistent elevated three-quarter camera, rounded architecture, clean readable shapes, subtle illustrated outlines, warm soft daylight and gentle ambient shadows. Charming but appropriate for teenagers rather than toddlers. Vietnamese places and everyday life. Cream stone, pale sand paths, soft jade foliage, terracotta roofs, restrained turquoise water. Rich yet carefully controlled detail. Avoid photorealism, plastic toy rendering and neon colors.

COMPOSITION IS CRITICAL:
Exactly TWO empty circular stone plazas, elliptical in perspective, integrated into the terrain. Each plaza has a clearly visible raised stone rim, subtle thickness and a ground shadow. The surface is light cream stone, empty and unobstructed. These are physical stopping points, not UI buttons or floating islands.

Plaza A center: x 28%, y 66%.
Plaza B center: x 73%, y 48%.
Coordinates are measured from the top-left corner. Each plaza is approximately 13–15% of the full image width.

ONE broad pale-sand path enters the left edge at y 65%, gently winds through plaza A, then plaza B, and exits the right edge at y 65%. No forks, no crossing paths. Keep the entrance and exit path width, color, elevation and nearby low vegetation visually consistent across all four maps.

Put the main landmark buildings ABOVE or BEHIND each plaza. Never cover either plaza center. Reserve an area approximately 22% of the image width and 12% of its height immediately BELOW each plaza as simple low-detail ground for future chapter labels. Do not place the path, a large tree, an important prop or a building in those label areas.

Reserve the upper-left region x 4–40%, y 4–20% as calm scenery for a future title overlay. Keep important content 5% inside the image edges. Prioritize the two plazas and the continuous route at thumbnail size. Blend the environments naturally using greenery, small streams, terrain and architecture. NO vertical panels, split-screen composition or abrupt color divisions.

DO NOT DRAW:
Text, letters, numbers, chapter labels, sign lettering, interface cards, progress bars, locks, checkmarks, player avatars, arrows on the route, floating icons, sticker outlines, logos, watermarks, giant coins or reward trophies. Do not paint player progress into the scenery. Exactly two plazas, not four.

If a reference map is supplied, match its camera angle, art style, building scale, path material, plaza design and lighting. Create a new region rather than duplicating its buildings.

REGION 1: FROM A SMALL FAMILY HOME.

Near plaza A: a cozy Vietnamese rural family house with a terracotta roof, a vegetable garden, banana trees, a modest rice field and a little pond. The emotional tone is safe, humble and warm. Represents chapter 1: first experiences with money and saving.

Near plaza B: a modest independent home along a small residential lane, a bicycle, laundry in the distance and a few welcoming neighboring houses. Represents chapter 2: learning to manage everyday life independently.

Connect the places with one coherent countryside-to-small-town landscape. Use soft green terrain, a narrow irrigation stream and warm earthy details. Keep the two plazas and path open. The right edge transitions gently toward a town, while the path exits at y 65%.

CONTINUITY — THIS IS THE FIRST SEGMENT OF ONE WORLD:
Establish recurring landmarks: the pale-sand route, a narrow turquoise stream, small cream-stone bridges and terracotta roofs. Keep the stream secondary to the main walking route. Near the RIGHT edge, foreshadow the next region with a small distant cream-colored school building with a terracotta roof, beyond residential greenery. Do not add a third plaza. The road must meet the right boundary at y 65%, approximately 5% of image height wide, with a level surface, low grass and no gate or foreground tree blocking the seam. The next map will continue this same road into the school neighborhood. Keep a calm late-morning warm daylight direction from upper left, which all later maps will share.
```

## Prompt 2 — Những bước đi mới · Chương 3–4

Tên file: **finteen-map-02-new-steps.png**

```text
Create ONE landscape background for a premium Vietnamese teen financial education adventure game. This image is one region of a continuous journey across four connected maps. It is a playable game world background, not a poster, infographic, dashboard or collage.

OUTPUT: 16:9 landscape, preferably 2560 x 1440, full bleed, no border.

ART DIRECTION:
Hand-painted 2.5D adventure game illustration, consistent elevated three-quarter camera, rounded architecture, clean readable shapes, subtle illustrated outlines, warm soft daylight and gentle ambient shadows. Charming but appropriate for teenagers rather than toddlers. Vietnamese places and everyday life. Cream stone, pale sand paths, soft jade foliage, terracotta roofs, restrained turquoise water. Rich yet carefully controlled detail. Avoid photorealism, plastic toy rendering and neon colors.

COMPOSITION IS CRITICAL:
Exactly TWO empty circular stone plazas, elliptical in perspective, integrated into the terrain. Each plaza has a clearly visible raised stone rim, subtle thickness and a ground shadow. The surface is light cream stone, empty and unobstructed. These are physical stopping points, not UI buttons or floating islands.

Plaza A center: x 28%, y 66%.
Plaza B center: x 73%, y 48%.
Coordinates are measured from the top-left corner. Each plaza is approximately 13–15% of the full image width.

ONE broad pale-sand path enters the left edge at y 65%, gently winds through plaza A, then plaza B, and exits the right edge at y 65%. No forks, no crossing paths. Keep the entrance and exit path width, color, elevation and nearby low vegetation visually consistent across all four maps.

Put the main landmark buildings ABOVE or BEHIND each plaza. Never cover either plaza center. Reserve an area approximately 22% of the image width and 12% of its height immediately BELOW each plaza as simple low-detail ground for future chapter labels. Do not place the path, a large tree, an important prop or a building in those label areas.

Reserve the upper-left region x 4–40%, y 4–20% as calm scenery for a future title overlay. Keep important content 5% inside the image edges. Prioritize the two plazas and the continuous route at thumbnail size. Blend the environments naturally using greenery, small streams, terrain and architecture. NO vertical panels, split-screen composition or abrupt color divisions.

DO NOT DRAW:
Text, letters, numbers, chapter labels, sign lettering, interface cards, progress bars, locks, checkmarks, player avatars, arrows on the route, floating icons, sticker outlines, logos, watermarks, giant coins or reward trophies. Do not paint player progress into the scenery. Exactly two plazas, not four.

If a reference map is supplied, match its camera angle, art style, building scale, path material, plaza design and lighting. Create a new region rather than duplicating its buildings.

REGION 2: NEW STEPS INTO THE WORLD.

Near plaza A: a friendly Vietnamese university or college campus, shaded courtyard, simple school buildings and a small parked bus set well behind the plaza. Represents chapter 3: student life and managing new expenses.

Near plaza B: a small contemporary workplace with a welcoming entrance and an adjacent neighborhood café. A few human-scale town buildings, not a wall of skyscrapers. Represents chapter 4: first work experience and first income.

Blend the campus and workplace into the same walkable town using trees, a small bridge and gentle slopes. The left edge connects visually to a residential town; the right edge continues to a neighborhood business area. Match the reference map's daylight, plaza design and path endpoints. No readable signs.

CONTINUITY — THIS IS THE SECOND SEGMENT OF THE SAME WORLD:
Use map 1 as both style and continuity reference. At the LEFT edge, continue its pale-sand route at y 65%, approximately 5% of image height wide, with matching elevation, low grass and cream stones. Show a few familiar terracotta residential roofs behind the entrance, and bring the distant school foreshadowed in map 1 into the school landmark near plaza A. Carry forward the narrow turquoise stream and occasional small cream-stone bridge, without creating another playable route. Toward the RIGHT edge, transition from the workplace into a quieter neighborhood. Foreshadow a modest cream-colored savings office with a terracotta canopy and young trees in the distance, which will become the first landmark of map 3. No third plaza. Road exit: right edge y 65%, same width and level surface, no gate or tree covering the seam. Preserve map 1's late-morning lighting from upper left.
```

## Prompt 3 — Khu phố vun đắp · Chương 5–6

Tên file: **finteen-map-03-build.png**

Đính kèm một ảnh vùng 1 hoặc 2 đã ưng ý và không có chữ làm tham chiếu phong cách. Không dùng ảnh bị in tọa độ hoặc ảnh nhà đè đế làm tham chiếu bố cục. Hai đế phải độc lập với nền móng công trình và nhìn trọn vẹn cả mặt lẫn vành. Prompt này thay thế toàn bộ prompt 3 cũ; không ghép thêm phần tọa độ cũ.

```text
Paint a finished background for a charming story-driven adventure game: a warm Vietnamese neighborhood where a young person starts saving and building a small business. A beautiful playable journey, not an architectural plan or an instructional diagram.

Wide landscape composition, 16:9, high resolution. Use the attached clean reference image ONLY to match its illustrated art style, elevated three-quarter camera, soft warm daylight, rounded buildings, subtle outlines and harmonious colors. Create a new place in the same world. The final image must be entirely pictorial, with no writing anywhere.

The main visual idea is ONE narrow, inviting sandy footpath winding through a lush little neighborhood. The route enters from the lower left, curves past a quiet garden on the left, crosses ONE small stone bridge over a slim turquoise stream, then curves uphill toward a lively shop on the right and continues out near the lower-right edge. The player should immediately understand the route from left to right. No road junctions, no forks and no broad urban road network.

The most important requirement is TWO FREESTANDING, COMPLETELY EMPTY round stone stepping platforms on the walking route. These are independent game stopping points, NEVER building foundations, entrance terraces, porches or steps attached to a house.

Place the left platform in open ground in the lower-left half. Place the right platform in open ground in the middle-right half. Show the entire elliptical top surface and the complete rim of BOTH platforms, with no occlusion whatsoever. Each has a low cream-stone edge, visible thickness and a soft shadow. Keep both platforms similar in size. Their centers and edges must remain bare.

SEPARATE BUILDINGS FROM PLATFORMS IN THE VISIBLE IMAGE: put the savings office farther back in the upper-left area and the shop farther back in the upper-right area. Leave a clearly visible strip of grass or sandy ground between the closest building edge and each platform, at least half a platform's depth. This gap must be visible in the final camera view, not merely implied in the ground plan. No roof, wall, staircase, porch, planter, shrub, tree canopy, shadow or prop may cross either platform's silhouette. If space is tight, make the buildings smaller and move them farther back; never place them on a platform. Both buildings stand on their own separate rectangular footprints.

The main walking route touches the two empty platforms and continues past them. Do not extend a building doorstep onto a platform. Do not add extra circular building bases. Exactly two complete empty circular platforms must be visible at a glance.

The LEFT destination feels calm and cared for: a modest neighborhood savings office resembling a welcoming small townhouse, with a terracotta porch roof, a shaded bench and a flourishing garden with a few young fruit trees. No signboard. Saving is suggested through patient care and growth, not through giant financial symbols.

The RIGHT destination feels lively and personal: one charming small bakery and produce shop, with a warm striped fabric awning, bread baskets, a few fruit crates, potted plants and a parked bicycle. Group the props neatly around the storefront. No lettering on the awning or packaging. This is one readable shop landmark, not a dense shopping district.

Tie the whole scene together with rich but controlled greenery, rounded shrubs, patches of flowers, terracotta roofs and warm cream stone. The narrow turquoise stream is a secondary detail; it must not split the picture into two unrelated halves. Keep some quiet grassy ground below each stepping platform so a small chapter label can later be added by the game interface. Keep the upper-left sky and distant greenery soft and simple. Do not draw placeholders for labels.

Continuity with the previous region: near the far left, include a subtle distant glimpse of the residential and workplace neighborhood already visited. Near the far right, beyond the shop, show only a couple of small blue-gray town buildings peeking through trees, suggesting the next region. The outgoing sandy path remains visible and unobstructed. Maintain the reference image's path material, warm light and building scale.

Make this feel like a lovingly painted adventure-game world: clear focal landmarks, an easy-to-follow winding route, appealing depth and generous breathing room. Avoid a flat technical layout, a symmetrical plan, washed-out empty paving or excessively tiny details.

The artwork contains NO text of any kind: no labels, letters, numbers, coordinates, percentages, captions, street signs, maps within the image or annotations. Also no UI, arrows, locks, progress bars, avatars, floating icons, watermarks, collage panels or outer border. Exactly two small empty stepping platforms connected by one winding route.
```

## Prompt 4 — Con đường lên đồi · Chương 7–8

Tên file: **finteen-map-04-horizon.png**

Đính kèm ảnh vùng 3 đã chọn để nối môi trường; có thể thêm ảnh vùng 1 làm chuẩn phong cách. Prompt này thay thế toàn bộ prompt 4 cũ. Vùng 4 phải khác vùng 3: một hành trình từ phố lên đồi, không lặp lại cảnh ngân hàng và cửa hàng.

```text
Paint the final region of a charming story-driven adventure-game journey: a continuous scenic path from a leafy Vietnamese town to a peaceful hilltop overlooking the places the player has explored. This is a finished illustrated game background, not an urban plan, diagram or infographic.

Wide landscape composition, 16:9, high resolution. Match the attached previous map's hand-painted illustration style, elevated three-quarter camera, clean rounded shapes, subtle outlines, building scale, cream stone and soft warm daylight. Keep the same time of day and coherent color palette. Do not copy the previous map's shop-and-garden arrangement. Create a distinctly new region with a memorable open view.

Build a clear diagonal journey: ONE sandy walking path enters from the lower left, passes a small leafy town landmark on the left, winds gently up a green slope toward a pavilion on the upper right, then continues quietly toward the right edge. Keep the climb gentle and the route fully visible. No branching paths, road junctions, highway network, dramatic cliffs or staircase maze.

Place exactly TWO small round cream-stone stepping platforms along this route. The first is in the lower-left half near the town landmark. The second is higher in the right half, directly in front of the hilltop pavilion. Each platform is a modest physical stop along the path, not a giant plaza: an empty light stone top, low rounded rim, visible thickness and a soft grounding shadow. The tops appear elliptical from the camera angle. Leave simple grassy ground immediately below each platform for a future game label, but paint no labels or placeholders.

The LEFT destination is a welcoming modern financial neighborhood at a human scale: two or three tasteful mid-rise buildings behind trees, one small cream-colored public-facing office and planted courtyards. Restrained blue-gray accents blend with the terracotta and cream town. No enormous skyscrapers, stock-exchange screens or giant financial symbols. The platform and route remain the visual focus.

The RIGHT destination is a charming open-sided pavilion with a terracotta roof, on a gentle green hill surrounded by flowers and a small community garden. Place the pavilion behind the second platform, never on top of it. It represents confidence, perspective and a balanced future. No castle, luxury mansion, trophy, crown or pile of money.

Between and behind these two destinations, open a beautiful distant valley view. A slender turquoise stream threads through the town below. Include subtle tiny echoes of the previous journey: a rural terracotta house, a school roof, a small workplace and a shop awning nestled among trees. These must be natural distant scenery, not framed pictures or extra playable destinations. Do not add more stepping platforms.

Continuity with the preceding map: a small glimpse of its shop street sits near the far-left entrance; the blue-gray buildings foreshadowed there now become the left-side town landmark. Use the exact same sandy path and cream-stone materials. The recurring stream flows onward into the valley. Let the route continue unobstructed toward the right edge after the pavilion, suggesting that life continues beyond this chapter.

Keep the upper-left region visually calm with pale sky and soft distant foliage. Compose an inviting, readable game journey with depth and a sense of arrival. The emphasis is on the winding path and two destinations, with lush green slopes and a spacious view. Avoid huge blank paved areas, a flat city blueprint, panel divisions and excessive detail.

The final artwork is entirely pictorial. Absolutely NO text, letters, chapter numbers, coordinates, percentages, labels, captions, annotation marks, signs with writing, UI cards, arrows, locks, progress bars, player avatars, floating symbols, watermarks or outer borders. Exactly two modest empty stepping platforms, one continuous route, one coherent world.
```

## Gửi ảnh lại

Có thể gửi ảnh 1 trước để kiểm tra bố cục, sau đó mới gen ba ảnh còn lại. Gửi ảnh trực tiếp hoặc đặt vào:

```text
public/images/map/journey-v2/
  finteen-map-01-home.png
  finteen-map-02-new-steps.png
  finteen-map-03-build.png
  finteen-map-04-horizon.png
```

Kiểm tra mỗi ảnh có đúng hai sân, đường nối rõ, đế không bị che, có khoảng trống dưới sân và không có chữ giả. Kiểm tra cặp ảnh liền nhau có cùng độ rộng đường, vật liệu và cảnh chuyển tiếp; prompt hướng dẫn sự liên tục nhưng không bảo đảm công cụ gen tự nối khớp từng pixel.

## Phần sẽ dựng bằng code

- Huy hiệu số chương ở tâm sân, để lộ vành đế.
- Vòng sáng và con trỏ cho chương đang chơi, nhãn tiến độ rõ ràng.
- Dấu hoàn thành và thẻ tên giấy kem dưới sân.
- Dải hành trình 8 chương, bốn tab vùng, nút tiếp tục hành trình.
- Giữ cả tám chương bấm được; không vẽ khóa hoặc tiến độ vào background.

Tiến độ hiện tại trong dự án là dữ liệu mẫu. Cần nối với dữ liệu chơi được lưu để vị trí “Bạn đang ở đây” phản ánh đúng tiến trình thực tế.