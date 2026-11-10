# 直接复制使用的描述

以下第一段可以直接复制给图像生成工具。把 `{品牌名}` 换成实际名称；默认青蓝渐变、白底，颜色和背景可按项目要求替换。为了更接近确认稿，建议同时附上 [AppRoute 定稿](assets/approute-approved.png)，明确它只提供风格参考。

## 生成新名称：完整中文句子

<!-- generation-template:start -->
```text
请为品牌「{品牌名}」设计一个圆润、流畅、有弹性的连笔手写艺术字标，准确书写品牌名并保留指定大小写。字体有自然的手写笔势，字母之间顺畅连接，整体略向右倾，基线有轻微起伏。笔画中等偏饱满，下行笔画稍厚，上行与转接笔画稍细，形成自然的粗细变化；保留饱满的手写感，同时让字母内部与连接处有足够留白。收笔圆润，转弯顺滑，末尾只留短而自然的收笔曲线。整体清爽、亲和、有辨识度，避免厚重块状字、膨胀的泡泡字、极细单线字、空心描边字和普通无衬线斜体。采用从左侧青色平滑过渡到右侧明亮蓝色的渐变，纯白背景，横向居中构图，四周留白，边缘干净。画面只出现一次品牌名称，不加入图标、箭头、副标题、装饰框、阴影、发光或立体效果。如果附有 AppRoute 定稿，请只参考它的笔势、粗细关系、留白和视觉重量，为新名称重新设计字母与连接，画面中不要出现 AppRoute。
```
<!-- generation-template:end -->

**已有 AppRoute 且需要保持一致时，不重新生成，直接用定稿文件。** “重新设计”仅用于新名称或明确要求的新版本。

## 在现有稿上略微收细：完整中文句子

```text
请在这张字标现有设计上，把笔画轻轻收细一档，让整体稍微轻盈一些，但仍保持中等偏饱满的手写感。只调整笔画粗细和由此产生的内部留白，保留原来的字母造型、自然连笔、倾斜角度、圆润收笔、粗细变化、整体比例、颜色与构图。不要变成极细线条、等粗单线或空心描边，不新增装饰。准确保留原文字，只输出一个修改版本。
```

使用时附上待修改的原图，并将它标为唯一编辑目标。若当前工具不能精确保留原稿，必须检查变化，不把提示词中的“保留”当成已经实现。

## 指定保留项与改变项

```text
沿用这张确认稿的圆润连笔、粗细变化和略向右倾的笔势，仅把品牌名改为「FlowNest」，渐变颜色和横向构图保持一致。根据新字母自然调整连接，保持拼写清楚，不把旧品牌文字或专属图标带入新稿。
```

改变颜色时可将“仅把品牌名改为”改为“品牌名保持原样，仅把配色改为……”。一次微调优先只改变一个变量。

## 给 Agent 的简短指令

跨电脑推荐使用 GitHub：

```text
从 https://github.com/Yueyuyu/ui-design-lab 的 design-recipes/README.md 读取视觉风格库，固定本次使用的提交 SHA。按 rounded-brush-wordmark 1.0.0 的风格卡、确认稿和反例，为「你的品牌名」设计圆润连笔字标，展示结果并检查实际使用尺寸。
```

已具备本机仓库时可用：

```text
读取 B:/Support/Project/ui-design-lab/design-recipes/README.md，按 rounded-brush-wordmark 1.0.0 的风格卡、确认稿和反例，为「你的品牌名」设计圆润连笔字标。先看图片再生成，展示结果并检查实际使用尺寸。
```

这个短入口依赖可访问的库文件；上面的完整中文描述可独立复制。文字描述能提供方向，附确认稿更容易校准细节。当前复用验证使用“完整中文描述 + 一张确认稿”，没有把它写成纯文字提示已经实测。

## AppRoute 原始成功提示词（历史原文）

下面保留实际使用的两次英文提示词，便于追溯；它们不替代上面的中文通用模板。工具均为内置 `image_gen.imagegen`，没有记录可指定的模型版本或随机种子。

### 第一次确立连笔手写方向

输入为用户提供的 `easy vibe` 截图，仅作为风格参考；`transparent_background: false`。

```text
Use case: logo-brand, reference-guided original lettering. The attached image is a STYLE REFERENCE ONLY: its little blue 'easy vibe' script logo exemplifies the requested artistic lettering. Create a NEW wordmark spelling exactly "AppRoute" (A p p R o u t e), one word, capital A and R. Do NOT reproduce 'easy vibe' or the other cropped material in the reference. Closely match its DESIGN LANGUAGE: cheerful sophisticated custom connected brush script, soft rounded brush terminals, fluid cursive connections, gently bouncy baseline, confident forward slant, lively handwritten rhythm, distinct thick downstrokes and thinner upstrokes. Medium-bold lively brush lettering with visible thick/thin contrast and open counters, not thin monoline cursive and not heavy swollen block letters. This must feel hand-lettered by a skilled branding designer, not ordinary typed italic text. Let the connected lower-case p p and o u t e form natural smooth cursive flows; make the capital A and R stylish, friendly, and clearly readable. Short restrained ending flourish on the e, an elegant curved R leg, no large decorative swashes. Balance the small counters and joins so the word is compact and expressive yet breathable, like the example. Color: a fresh turquoise/cyan blue at the start flowing smoothly into vivid clean royal blue at the end, similar to the reference, with at most a tiny integrated mint-blue accent. No dark navy. Flat clean vector-like shapes, beautiful smooth curves, no fuzzy paint texture. Pure white background. Wide horizontal composition with ONE large centered wordmark, ample white margin on all sides, lettering occupying about 80 percent of the width. Only the AppRoute lettering; no standalone icon, no app tile, no arrows, no routing pictograms, no slogans, no subtitle, no labels, no border, no watermark, no repeated versions, no mockup. No wire-thin lettering, no hollow outline font, no rigid geometric font, no generic sans serif, no 3D, no glow, no drop shadow. Prioritize the warmth, character, and authentic brush-script personality of the provided reference.
```

### 确认稿：小幅收细

输入为 [连笔中间稿](assets/approute-intermediate-brush.png)，唯一编辑目标；`transparent_background: false`。其中 12–15% 是当时的生成意图，未测量实际笔画变化，不作为风格的硬性参数。

```text
Precisely edit the attached AppRoute wordmark. Change ONLY the weight of the lettering: make the existing strokes slightly thinner, approximately 12–15 percent thinner than the source, just one small weight step lighter. The user likes this exact rounded connected brush-script design and emphatically does NOT want thin-line or monoline lettering. Retain a confident medium-bold brush-script weight with thick downstrokes and somewhat thinner upstrokes, soft rounded terminals and smooth flowing connections. Open up the inner counters just subtly as the strokes get slimmer. Preserve the EXACT text "AppRoute", all existing letter shapes and character, capitalization, rightward slant, baseline rhythm, connected joins, the A entry loop, the descending p strokes, the R curved leg and the e ending flourish. Preserve the current overall word size, position, proportions and white margins. Preserve the cyan/turquoise-to-vivid-blue left-to-right gradient and pure white background, with flat clean vector-like edges. No redesign, no extra decoration, no separate icon, no arrows, no additional text, no shadows, no 3D, no outline or hollow letters. Aim for a subtle visible reduction in heaviness while the original handwritten artistic personality remains almost identical. Return one edited version only.
```
