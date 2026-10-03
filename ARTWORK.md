# Рисунки мультфильма v02

Дата: 03.10.2026. Способ создания: встроенный image_gen, затем оптимизация в WebP и программная анимация. Оригинальные PNG сохранены в локальном проекте в `90_Технические_материалы/animation-v02/originals`. Фотографии из аналитической записки использованы как визуальные референсы, а не кадры фильма.

Ниже сохранён набор производственных запросов: предмет, стиль и ключевые ограничения каждого изображения.

## truck.webp

Reference: Evocargo N1 at Rusclimat, photo from the supplier's case. Animation-ready sprite on genuinely transparent alpha background. Professional hand-painted 2.5D editorial cartoon of a compact autonomous covered delivery truck, recognizable tall cream rectangular enclosed cargo box and low rounded dark graphite driverless cab with small orange accent. Full side profile facing right, both visible wheels on the same horizontal baseline. Entire truck, generous transparent margins, clean dark ink outlines, subtle gouache texture, soft dimensional shading. No human driver, labels, text, logos, snow, ground, scenery, background or cast shadow.

## yard.webp

Wide 16:9 eye-level slightly elevated side-on animation background. Maintained older factory campus, not futuristic. Three distinct buildings across upper half: red brick receiving warehouse at left, cream corrugated storage building in middle, older brick workshop at right. Wide open loading doors at ground level. Subtle pipes, chimney silhouettes, trees, blue morning sky. Lower 45 percent is clear horizontal asphalt service road. Clean ink and gouache, muted sage, warm brick and ivory. No vehicles, people, boxes, text, labels, logos, arrows or diagram elements.

## tug.webp

References: EZTow at BMW for silhouette; generated truck for drawing style. One transparent sprite of autonomous tow tractor with TWO coupled low cargo trailers. Tractor faces right at the right end, trailers extend left with neatly stacked tan cartons. Squat cream body, glazed driverless cab, rooftop lidar and muted yellow accents. Full side profile, wheels on one ground line, full train visible. Clean ink and gouache shading. No branding, text, scenery, floor or shadow.

## robot.webp

References: Ronavi H1500 for low dark rectangular chassis, small green light and cream stripe; generated truck for drawing style. One transparent sprite: mobile platform under a four-legged sage transfer table carrying a pallet of tan cartons. Plausible center lifting support, table legs around robot. Side profile with slight front view, facing right. Clean dark outlines, soft shading, no text, logos, floor or background.

## hall.webp

Reference: generated factory exterior for matching architecture, ink-and-gouache style and palette. Wide 16:9 interior of a maintained older brick workshop. Tall windows, sage columns, roof beams and soft daylight. Large open doorway at left, clear robot path in center, short horizontal roller conveyor and muted green production machine at far right. Lower 35 percent clear floor. No vehicles, robots, people, boxes, text, logos, arrows or diagram elements.

## forklift.webp

Reference: generated truck for drawing style only. One transparent sprite of a conventional compact forklift in muted ochre yellow, graphite mast, seated operator in blue workwear and hard hat within overhead guard. Facing right, side profile, entire machine and empty low horizontal forks visible. Both wheels on one baseline. Clean ink and gouache, soft dimensional shading. No cargo, labels, logos, floor, cast shadow or background. This is a generic loading vehicle, not a selected procurement model.

## poster.webp

Кадр на 12-й секунде готовой анимации, создан общим рендерером. Отдельная генерация не применялась.

## Источники фотографий

- https://evocargo.com/implementations/detail/proizvodstvennyy-biznes-vnedryaet-avtonomnyy-transport/
- https://tracteasy.com/use-cases/bmw/
- https://ronavi-robotics.ru/catalogue/h1500


## Версия 03 — фуры, приёмка и склад

Четыре новых рисунка созданы встроенным инструментом image_gen. Фуры — собирательные образы российских КАМАЗов, не точные изображения конкретных моделей. Для стилевого согласования использован прежний рисунок внутреннего грузовика.

### semiRed

Use case: illustration-story. Create a transparent-background isolated sprite for a Russian factory logistics animated film. Full articulated semitrailer truck facing RIGHT, strict side view slightly showing front. Russian KAMAZ-inspired modern tall cab, red cab and long light grey curtain-sided semitrailer with three rear axles. Recognizable Russian cab-over heavy truck silhouette, no foreign brand logos, no text. Entire tractor and trailer visible, wheels aligned on same baseline. Warm hand-painted storybook gouache, fine dark outlines, muted industrial palette, realistic proportions. Landscape very wide 3:1. Genuine alpha transparency, no ground, no scenery, no decorative elements. Match supporting reference's illustration style only; vehicle must be a much longer articulated supplier semi, not the reference's compact internal van.

### semiBlue

Use case: illustration-story. Transparent isolated full articulated supplier semi-truck sprite facing RIGHT. Russian older KAMAZ 54115-inspired boxy blue cab, flat nearly upright windshield, small orange roof lights, long beige curtain semitrailer, three trailer axles. Entire vehicle with generous margins, all wheels same baseline. Side view, tiny glimpse front. Warm hand-painted gouache storybook style with dark fine outlines matching reference's style only. Different older Russian cab silhouette, no logos, lettering or license plate text. Wide 3:1 composition, genuine alpha transparent backdrop, no road or ground.

### receiving

Use case illustration-story. Background for side-view animated logistics movie, warm painted gouache, muted sage green and brick ochre, thin handdrawn outlines. Existing older Russian factory receiving yard, widescreen16:9. Eye-level view perpendicular to building facade. Left background factory entrance with small guardhouse and open gate, center long open-sided covered receiving canopy with three empty bays, right old brick warehouse with large open loading door. Buildings confined mostly upper half. Foreground entire lower half wide flat asphalt apron empty for later animated trucks, no perspective markings that constrain vehicles. Daylight, trees behind perimeter. No vehicles, no people, no goods, no text, no logos. Quiet clear legible scene, not diagram, no aerial view.

### warehouse

Use case illustration-story. Wide16:9 handpainted gouache background for logistics movie, old Russian factory warehouse interior, warm brick walls industrial tall windows roof steel trusses. Side-on level view. Left wide open receiving doorway, center and right industrial low pallet racks containing some tan boxes, empty clearly separated shelf bays. Lower half entirely clear concrete floor for later composited forklift sprites. Gentle daylight muted sage ochre palette fine outlines. Warehouse storage not production line. No text no people no vehicles no logos. Avoid deep perspective, keep racks at back.