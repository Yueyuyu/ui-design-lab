# 公共层中文字体

Noto Sans SC，SIL Open Font License 1.1，许可证见 `OFL.txt`。供公共页头、设计系统目录、使用方式、同场景对比，以及套内应用示例的说明层使用；套系字体不变。

- 官方来源：Google Fonts 的 `Noto Sans SC`，https://fonts.google.com/noto/specimen/Noto+Sans+SC 。
- 2026-09-23 经 Google Fonts CSS API 下载 400–700 可变字重的 WOFF2 子集，193,708 字节，无外部运行时请求。
- `subset.txt` 保存 713 个覆盖字符：ASCII、公共页头/目录文案、已注册套系名称/简介/场景信息，以及示例用途/操作说明、Agent 交接、接入步骤、下载/复制、本机反馈与比较工具栏文案。字体文件的实际字符范围由该清单决定。
- 字体排在 Segoe UI 之后、微软雅黑 UI 之前：英文沿用系统无衬线，中文使用该本地字体；清单之外的输入按系统中文字体回退。
- 新增公共文案或套系后，如需要新增字形，合并字符到清单，再用官方 CSS API `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400..700&display=swap&text=<URL 编码的字符清单>` 取得 WOFF2。下载时使用现代浏览器 User-Agent，并保留许可证。
