# icons

界面符号、应用图像、交互入口分为三层。界面符号使用 Phosphor React，通过 OrchardSymbol 和 orchardSymbols 提供 24 个稳定语义 ID；常规 20px、工具栏 18px、图标选择预览 25–28px。允许本套内部按明确用途使用 regular、duotone 或 fill，不把它们标为 Apple SF Symbols。

应用图像由 OrchardAppIcon 承载，默认 64px；src 可接入业务自己的图像，加载失败回退到 symbol。套内提供两个原创生成的资料/音乐 PNG，可从 ui-design-lab/orchard-ui/assets/orchard-files.png 与 orchard-music.png 子路径导入；图像不内联进组件 JS。它们是本项目资产，不是第三方软件标识。彩色仅表达应用身份，不替代状态文字。

OrchardIconPicker 按中文名称、语义 ID 或用途搜索，value/onChange 受控。OrchardAppLauncher 负责应用搜索与选择，通过 onLaunch 交给业务路由。OrchardCommandMenu 提供搜索、上下键和 Enter；组合进 Dialog 后才构成模态命令面板，不自动注册全局快捷键。

纯装饰图标 aria-hidden；有意义的独立图像提供 label，按钮的名称来自入口。不要让图像本身获得焦点。图标与中文基线通过 inline-flex 对齐；长名称允许换行，放大后不裁切。候选操作最小高度 44px，加载与禁用时不可执行，错误保留搜索和选择。
