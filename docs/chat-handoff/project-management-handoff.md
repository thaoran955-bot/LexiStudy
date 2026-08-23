# LexiStudy 项目交接文档

> 用途：供新的 Codex Chat 在正确的 Git Project 中恢复上下文并继续开发。
> 类型：项目管理与开发交接，不是普通阶段总结。
> 生成时间：2026-08-09

新 Chat 开始工作前，必须先阅读本文档，并确认工作区路径、Git 分支和工作区状态。

## 1. 项目背景

### 1.1 项目名称

LexiStudy（英语词汇学习软件）。项目目录为 `C:\Users\ASUS\Desktop\英语词汇学习软件\Project`。

### 1.2 项目目标

创建一款仅运行于 Windows 的本地英语词汇学习桌面应用，帮助用户按照固定顺序完成每日新词学习、答案判断、学习记录保存、进度查看和基础统计。

应用使用固定内置词库 `resources/vocabulary_final.json`，词库文件保持只读。所有学习进度、答题记录、设置和词库扩展数据独立保存到本地 SQLite，不写回词库 JSON。

### 1.3 软件定位

- Windows 本地桌面应用。
- Electron + React 的低干扰、长期使用型学习工具。
- 深色模式优先，同时保留浅色主题设计基础。
- 视觉方向接近 Anki/桌面生产力工具：信息清晰、操作直接、避免游戏化干扰。
- 不联网、不登录、不云同步、不依赖远程服务。

### 1.4 用户场景

用户每天可以继续昨日进度或开始今日学习，选择 35/50 个新词，按原始顺序逐词学习，在英译中与中译英之间切换，显示答案后判断“认识/不认识”，并查看首页、统计、设置和词库管理页面。

核心学习循环是：看题 → 显示答案 → 判断认识/不认识 → 保存现有记录 → 下一词。

### 1.5 长期发展方向

- v0.2.x：完成 UI/UX、响应式布局、主题、字体、可访问性和页面一致性优化。
- v0.3.0：单独评估 Stats Dashboard、复习体验和更复杂的学习能力。
- 更长期：评估本地数据管理、备份恢复和 AI 特供版方向，但必须单独立项，不能破坏离线、本地、无账号原则。

## 2. 技术与开发环境

### 2.1 技术栈

- Electron：Windows 窗口、主进程、菜单和本地能力。
- React + TypeScript：渲染进程页面、组件和类型约束。
- Vite：前端开发服务器和生产构建。
- SQLite：本地学习记录、设置、词库和单词关联数据。
- React Router：生产环境使用 `HashRouter`，兼容 Electron `file://` 加载。
- Vitest：测试工具；electron-builder：Windows NSIS 安装包。

### 2.2 目录职责

- `electron/`：Electron 主进程、preload、IPC、SQLite 和本地能力。
- `src/`：React 页面、组件、类型、服务和样式。
- `resources/`：固定词库等随应用发布的资源。
- `assets/`：应用图标等发布资源。
- `docs/`：产品、设计、开发和交接文档。
- `dist/`、`dist-electron/`、`release/`：构建或打包输出，不提交临时产物。

### 2.3 开发工具和命令

PowerShell 环境优先使用 `npm.cmd`，不要使用可能被执行策略拦截的 `npm`。常用命令为：`npm.cmd install`、`npm.cmd run dev`、`npm.cmd test -- --run`、`npm.cmd run build`、`npm.cmd run package:win`。

运行时 SQLite 使用 Electron 用户数据目录，不应写入源码目录或 `vocabulary_final.json`。

### 2.4 Codex 使用方式

- 新 Chat 必须绑定 `C:\Users\ASUS\Desktop\英语词汇学习软件\Project`。
- 不要把 `C:\Users\ASUS\Documents\New project` 当作本项目工作区；此前该路径造成过 Codex Desktop 工作区绑定混乱。
- 开发前执行 `git branch --show-current`、`git status --short`、`git log -3 --oneline --decorate`。
- 设计阶段先阅读相关文档，再说明方案和修改范围。
- 用户要求阶段性停止时，完成该阶段后报告文件、作用、验证结果并等待确认。
- 代码修改使用 `apply_patch`，不使用临时脚本覆盖文件。
- 不擅自删除未追踪文档、测试数据或用户数据。

### 2.5 Git 管理方式与分支结构

未经明确要求，不执行 `git push`、不创建 Pull Request、不删除分支、不覆盖稳定标签，也不擅自 commit 文档或代码。

当前节点关系：

- `main`：v0.1.1 基础节点，commit `61ac38a`。
- `v0.2.0-dev`：本地首页 UI 冻结节点，commit `63d794f`。
- tag `v0.1.1`：稳定版本标签。
- tag `v0.2.0-alpha`：首页 UI alpha 标签，指向 `63d794f`。
- `feature/v0.2.0-learning-page`：当前学习页分支，当前 HEAD 为 `c05e2fd`。

远程分支可能未同步本地 alpha 提交，未经明确要求不得 push。

## 3. 项目版本演进

### 3.1 v0.1.1 Stable

这是功能稳定基线，已完成安装版、干净环境和用户模拟测试。包含 Electron + React Windows 桌面应用、固定内置词库、JSON 词库导入、多词库管理与切换、SQLite 学习记录、每日目标、学习模式、掌握等级、错词复习、统计、设置、快捷键和 Windows 安装包。

重要修复包括：生产环境 `file://` 路由黑屏改用 HashRouter、生产资源加载、快捷键监听与默认行为、Space 页面滚动，以及页面和顶部菜单的词库导入入口。

v0.1.1 的业务逻辑、SQLite 结构、词库内容和学习算法是 v0.2.0 UI 回归基线。

### 3.2 v0.2.0 UI 版本

v0.2.0 明确定位为 `v0.2.0 = UI/UX Enhancement Only`。

已完成：Theme Token、Dark/Light 主题变量、Typography、`--font-scale`、Layout/spacing/radius/shadow/animation Token、HomePage 信息层级与响应式布局、首页视觉细化和轻量动效、`v0.2.0-alpha` 冻结节点，以及学习页 UX 设计任务与方案。

尚未完成：StudyPage UI、Word Card UI、学习页最终验收、统计/设置/词库管理页面 UI 优化、Review 4 和 Release Candidate 回归验收。

v0.2.0 禁止修改学习算法、SQLite、IPC、词库、数据流程、现有快捷键语义和业务路由行为。

## 4. 已完成的重要工作

### 4.1 功能开发

v0.1.1 已形成基础闭环：首次启动读取默认词库、首页查看进度、逐词学习、答案判断、SQLite 恢复、目标/模式持久化、错词复习、统计、多词库导入与切换，以及生产安装包验证。

### 4.2 UI/UX 设计与文档

已建立的主要设计文档包括：

- `docs/v0.2.0-ui-design-spec.md`
- `docs/v0.2.0-visual-system-design.md`
- `docs/v0.2.0-homepage-redesign-plan.md`
- `docs/v0.2.0-homepage-visual-spec.md`
- `docs/v0.2.0-learning-page-design-task.md`
- `docs/v0.2.0-learning-page-design-system.md`
- `docs/v0.2.0-learning-page-ux-design.md`
- `docs/v0.2.0-word-card-design-plan.md`
- `docs/v0.2.0-word-card-visual-spec.md`
- `docs/v0.2.0-roadmap.md`

学习页已确定：单词卡是唯一视觉主焦点；流程保持“看题 → 显示答案 → 判断 → 下一词”；答案前后按钮状态不同；适配 `920×620`、`1180×760`、宽屏、全屏、Dark/Light、字体缩放和 reduced-motion。

### 4.3 Git 冻结节点

- `v0.2.0-alpha`：`63d794f`，commit message 为 `feat(ui): complete v0.2.0 homepage redesign`。
- 当前分支最新提交：`c05e2fd`，commit message 为 `docs: define v0.2.0 learning page UX`。
- `c05e2fd` 只增加学习页 UX 设计规格，不包含业务代码修改。

### 4.4 重要决策

- 固定词库 JSON 永久只读，学习数据与词库分离。
- v0.2.0 只改 UI/UX，不借 UI 重构修改数据层或业务逻辑。
- 学习页先完成 UX、Design System、Word Card 规格，再进入代码实现。
- Electron 生产环境使用 HashRouter，不恢复 BrowserRouter。
- 页面规范优先使用已有 Token，不重复硬编码视觉值。

## 5. 当前项目状态

### 5.1 当前版本与分支

- 产品开发目标：`LexiStudy v0.2.0-alpha` 学习页设计阶段。
- 稳定功能版本：`LexiStudy v0.1.1`。
- `package.json` 版本仍为 `0.1.1`，不能把 v0.2.0-alpha 当成已发布安装包版本。
- 当前分支：`feature/v0.2.0-learning-page`。
- 当前 HEAD：`c05e2fd docs: define v0.2.0 learning page UX`。

### 5.2 已完成阶段

- v0.1.1 Stable 功能与发布。
- v0.2.0 Phase 1 视觉系统文档。
- v0.2.0 Phase 3.1 UI 基础系统实现与审查。
- v0.2.0 首页布局、视觉细化和 Review 3 冻结。
- v0.2.0 Phase 4.2.1 学习页设计任务与 UX 方案。
- 学习页 Design System 文档已创建，但尚未进入 StudyPage 代码实现。

### 5.3 当前进行阶段

当前是学习页 UX/UI 设计准备阶段。下一步应先审阅学习页 UX、Design System、Word Card 文档，确认最终视觉方案，再制定小范围实现计划。

当前工作区有以下未追踪文档，不得直接删除或覆盖：

- `docs/design-skill-evaluation.md`
- `docs/v0.2.0-learning-page-design-system.md`
- `docs/v0.2.0-learning-page-design-task.md`
- `docs/v0.2.0-learning-page-ux-design.md`
- `docs/v0.2.0-word-card-design-plan.md`
- `docs/v0.2.0-word-card-visual-spec.md`

新 Chat 应先确认这些文件的归属和是否需要单独提交。

## 6. 当前存在的问题

### 6.1 Codex Chat 绑定问题

当前 Chat 曾因 Codex Desktop 工作区绑定错误无法继续作为正确项目的开发 Chat。新 Chat 必须绑定 `C:\Users\ASUS\Desktop\英语词汇学习软件\Project`，不要在 `C:\Users\ASUS\Documents\New project` 中修改本项目。

### 6.2 项目环境问题

- PowerShell 中 `npm` 可能被执行策略或包装脚本拦截，使用 `npm.cmd`。
- `node_modules`、`dist`、`dist-electron`、`release` 和 SQLite 用户数据不应提交。
- SQLite 用户数据位于 Electron 本地用户数据目录，不应复制到 Git Project 或重置。
- PowerShell 终端对部分中文历史文件可能显示编码异常；读取 Markdown 时优先使用 UTF-8，不要因终端乱码擅自重写文档。
- 远程分支可能未同步本地 alpha 提交；未经明确要求不得 push。

### 6.3 未完成任务

- 学习页 Word Card、操作区和进度视觉实现。
- 学习页响应式、主题、字体缩放、reduced-motion 和快捷键回归验收。
- Review 4：核心页面 UI 审查。
- v0.2.0 Release Candidate 功能回归与安装版验证。
- 统计、设置、词库管理页面 UI 优化。
- v0.2.0 正式版本号、CHANGELOG 和发布包整理。

## 7. 后续开发路线

### 7.1 近期：完成 v0.2.0 UI

建议顺序：确认学习页 UX；按 Design System 实现 Word Card、Action Button、Progress Indicator 和 Feedback State 的展示层；完成 StudyPage 响应式适配；验证 Dark/Light、100%/125%/150%/175% 字体缩放和 reduced-motion；再优化统计、设置、词库管理页；最后完成 Review 4、Release Candidate 和安装版回归。

成功标准：视觉和桌面体验升级，但原有数据、学习流程和快捷键行为不变。

### 7.2 中期：v0.2.x

仅考虑 UI/UX 细化：主题与可访问性、字体/对比度/键盘焦点、学习卡片和进度反馈微交互。不得因 UI 版本引入新的学习算法或数据字段。

### 7.3 长期：v0.3.0 功能版本

可单独评估 Stats Dashboard、复习计划、历史趋势、本地备份恢复和更丰富的词库管理。这些内容可能需要修改 SQLite、学习算法、数据模型或业务流程，不能并入 v0.2.0 UI 分支。

### 7.4 AI 特供版方向

AI 特供版是长期探索方向，不是当前版本工作内容。后续必须先确认是否完全本地运行、是否引入网络/账号、是否新增数据表以及是否独立分支维护。未确认前，不要在 v0.2.0 加入 AI、联网或占位业务功能。

## 8. 新 Chat 使用说明

### 8.1 开始工作前

1. 确认工作目录为 `C:\Users\ASUS\Desktop\英语词汇学习软件\Project`。
2. 读取本文档和当前任务对应的设计文档。
3. 执行 `git branch --show-current`、`git status --short`、`git log -3 --oneline --decorate`。
4. 确认没有误切到 `main`、错误工作区或错误项目。

### 8.2 不要重复询问的已确定信息

除非用户明确改变要求，不要重复询问：技术栈是 Electron + React + TypeScript + Vite + SQLite；目标平台是 Windows 本地桌面应用；不联网、不登录、不云同步；`resources/vocabulary_final.json` 固定且只读；学习数据独立保存在 SQLite；v0.2.0 只做 UI/UX；当前分支是 `feature/v0.2.0-learning-page`；alpha 节点是 `63d794f`。

### 8.3 修改前说明要求

任何修改前先说明：修改原因、修改文件、明确不修改的文件、是否影响业务逻辑/数据库/IPC/词库/数据流程，以及验证命令。如果用户要求“只分析”或“只创建文档”，不得顺手修改代码、配置、数据库或词库。

### 8.4 阶段性交付要求

每完成一个阶段，列出新增和修改文件及其作用，报告测试或构建结果，明确未运行的验证，不擅自进入下一阶段，不擅自 commit、tag、push 或清理未追踪文件。

### 8.5 学习页实现特别约束

StudyPage 实现必须保持现有 props、回调、状态含义、`getFrontText`/`getAnswerText`、`onAnswer`/`onIndexChange`、快捷键语义、答案前后按钮启用顺序和 SQLite 保存恢复时机不变。允许修改展示层级、class、CSS、布局、动画和可访问性属性；不允许拆改业务服务或数据模型。

### 8.6 交接结论

新 Chat 不需要重新从项目背景开始提问。请从 `feature/v0.2.0-learning-page` 分支读取本文档和学习页设计文档，先完成学习页方案审阅，再进入实现计划和阶段性开发。
