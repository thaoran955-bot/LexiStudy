# LexiStudy 学习页 UI Chat 交接文档

> 文档用途：供新的 Learning Page UI Chat 在正确 Git Project 中恢复当前设计上下文并继续工作。
> 文档类型：设计交接与继续开发说明，不是普通项目总结。
> 生成日期：2026-08-09

---

## 0. 新 Chat 开始前必须确认

新的 Chat 读取本文档后，必须先确认：

~~~text
工作目录：C:\Users\ASUS\Desktop\英语词汇学习软件\Project
当前分支：feature/v0.2.0-learning-page
目标版本：LexiStudy v0.2.0-alpha
版本原则：v0.2.0 = UI/UX Enhancement Only
~~~

不要把以下目录当作 LexiStudy 项目工作区：

~~~text
C:\Users\ASUS\Documents\New project
~~~

此前 Codex Desktop 曾因工作区绑定问题进入该空目录；新 Chat 必须绑定桌面上的真实 Git Project。

开始任何后续工作前执行：

~~~powershell
git branch --show-current
git status --short
git log -3 --oneline --decorate
~~~

当前 Git 节点：

- main / v0.1.1：61ac38a，基础稳定版本。
- v0.2.0-dev / v0.2.0-alpha：63d794f，首页 UI 冻结节点。
- 当前分支 feature/v0.2.0-learning-page：HEAD 为 c05e2fd，提交信息为 docs: define v0.2.0 learning page UX。

当前状态中已有多个未追踪设计文档。未经用户明确要求，不得删除、覆盖、清理、commit 或 push 它们。

---

## 1. 学习页 UI 项目定位

### 1.1 学习页在 LexiStudy 中的作用

学习页是 LexiStudy 的核心使用页面，承载用户每日最主要的单词学习动作。它不是统计仪表盘、词库管理页或内容浏览页，而是围绕当前单词建立单一视觉焦点的学习工作区。

学习页必须保持现有业务语义：

- 一次只显示一个单词。
- 保持英译中和中译英两种模式。
- 先让用户独立回忆，再允许查看答案。
- 显示答案后由用户选择“认识”或“不认识”。
- 保持 Space、Left Arrow、Right Arrow、Esc 的现有快捷键语义。
- 保持现有路由、学习进度、记录保存、进度恢复和页面完成状态。

核心学习循环：

~~~text
看题 → 独立回忆 → 显示答案 → 判断认识/不认识 → 保存现有记录 → 下一词
~~~

### 1.2 长期学习场景

典型用户会在固定 Windows 桌面窗口中每天学习数分钟到数十分钟，并连续重复同一套操作。因此学习页不是一次性的展示页，而是长期使用的低干扰生产力工具。

长期场景要求：

- 状态变化稳定、可预测。
- 用户不需要寻找当前阶段和下一步操作。
- 英文单词、中文释义、答案和按钮在不同字号下始终可读。
- 920×620 紧凑窗口、1180×760 标准窗口、宽屏和全屏均可用。
- 100%、125%、150%、175% 字体缩放不会裁剪、重叠或横向溢出。
- 动效只确认状态，不制造游戏化刺激、不延迟操作。
- 深色和浅色主题的层级、语义和可读性一致。

### 1.3 用户使用流程

~~~text
进入学习页
    ↓
读取 startIndex 和 mode
    ↓
显示当前单词或中文提示
    ↓
用户独立回忆
    ↓
Space / 点击“显示答案”
    ↓
显示答案
    ↓
Left Arrow / Right Arrow / 点击“不认识/认识”
    ↓
调用现有 onAnswer 保存记录
    ↓
清除答案，进入下一个词
    ↓
调用现有 onIndexChange 保存进度
    ↓
队列结束后显示现有完成状态
~~~

快捷键语义不可变：

| 快捷键 | 现有语义 |
|---|---|
| Space | 显示答案；不直接提交判断 |
| Left Arrow | 答案已显示时触发“不认识” |
| Right Arrow | 答案已显示时触发“认识” |
| Esc | 返回首页 |

### 1.4 UI 设计目标

学习页 UI 目标是“低干扰、稳定节奏、单词优先”：

1. 用户进入页面后能立即识别当前提示、模式、进度和下一步。
2. 答案隐藏与答案显示状态有清晰差异，但不改变布局结构。
3. Word Card 是页面唯一主要视觉中心。
4. Action 区域的判断按钮保持固定位置和稳定点击区域。
5. 答案出现和下一词切换有轻量反馈，但不阻塞学习流程。
6. 所有视觉调整都服务于可读性、操作效率、长期舒适度和窗口适配。

---

## 2. 当前学习页设计阶段

### 2.1 当前版本

- 产品目标版本：LexiStudy v0.2.0-alpha。
- 当前 Git 分支：feature/v0.2.0-learning-page。
- 当前 HEAD：c05e2fd。
- package.json 版本仍为 0.1.1；不要把 alpha 设计节点误认为已发布安装包版本。

### 2.2 已完成阶段

已完成：

- v0.1.1 Stable 功能基线。
- v0.2.0 视觉系统、Theme、Typography、Layout、Radius、Shadow、Animation Token 设计。
- 首页 UI 重构、响应式适配和 Review 3 通过。
- v0.2.0-alpha 首页 UI 冻结节点。
- 学习页设计任务书。
- 学习页 Design System。
- 学习页 UX/UI 方案。
- Word Card 设计计划。
- Word Card 视觉规格。
- 当前 Chat 的设计交接准备。

### 2.3 当前阶段状态

Review 4 最终 UI 冻结验收已完成：

- Word Card Visual Design V2.2 已冻结。
- StudyPage UI 表现层已实现并完成 UI Review 与 Micro Adjustment。
- Final Visual Verification 已完成。
- P0 Feedback 残留问题已修复：反馈结束后才进入下一词，并阻止反馈期间重复提交。
- 当前进入 Review 4 文档同步阶段。

尚未进入本阶段的后续工作：

- v0.2.0 Release Candidate 的功能回归和安装版验证。
- 统计、设置、词库管理页面的后续 UI 统一设计。

### 2.4 与 UI-only 原则的关系

v0.2.0 的定义是：

~~~text
v0.2.0 = UI/UX Enhancement Only
~~~

本阶段允许调整表现层，不允许借视觉实现之名改变业务。所有后续设计和实现必须保持：

- 学习算法不变。
- 学习队列、掌握等级和错词逻辑不变。
- SQLite 表结构、字段、保存时机和记录模型不变。
- IPC、preload、Electron 数据通信和文件访问不变。
- resources/vocabulary_final.json 和词库数据流程不变。
- 页面路由、props、回调和快捷键语义不变。
- 不新增音频、评分、收藏、AI、例句数据、复习模式或统计功能。

---

## 3. 已完成设计工作

### 3.1 学习页设计任务书

文件：docs/v0.2.0-learning-page-design-task.md

作用：

- 定义学习页作为核心学习页面的职责。
- 明确“看题 → 显示答案 → 判断 → 下一词”的现有流程。
- 记录当前 StudyPage 组件、props、状态和交互流程。
- 分析单词卡比例、操作层级、顶部信息密度、反馈表现和视觉疲劳风险。
- 规定标准窗口、紧凑窗口、宽屏、全屏、深色/浅色和字体缩放适配。
- 明确允许修改与禁止修改范围。
- 提供学习页 UI 验收标准。

### 3.2 学习页 Design System

文件：docs/v0.2.0-learning-page-design-system.md

作用：

- 采用 Token-first + Component State Matrix。
- 继承项目已有 Theme、Typography、Layout、Radius、Shadow、Animation Token。
- 定义 Learning Page Token 的语义映射。
- 规定 Word Card、Action Button、Progress Indicator、Feedback State 的状态表达。
- 定义 920×620、1180×760、宽屏、全屏、主题和字体缩放规则。
- 定义 120–180ms 微交互、180–240ms 状态过渡和 reduced-motion 规则。
- 规定学习页不能建立独立的颜色、字体或间距体系。

### 3.3 学习页 UX 设计文档

文件：docs/v0.2.0-learning-page-ux-design.md

作用：

- 定义 Header、Word Stage、Word Card、Action、Feedback 五个区域。
- 确认“节奏卡片”方案：单词卡负责提示和答案，判断按钮固定在卡片下方。
- 建立答案隐藏、答案显示、下一词三个阶段的状态矩阵。
- 要求答案区域预留稳定空间，避免答案出现后布局跳动。
- 要求鼠标和键盘共享同一套视觉反馈。
- 规定深色/浅色主题继承现有 Token，不新增视觉体系。
- 建立实现边界和验收场景。

### 3.4 视觉系统与 UI 设计规范

相关文件：

- docs/v0.2.0-visual-system-design.md
- docs/v0.2.0-ui-design-spec.md

关键内容：

- 深色模式优先，同时维护浅色主题映射。
- 颜色语义：品牌色用于行动和进度，成功色用于认识/完成，错误色用于不认识/错误提示。
- 字体栈优先使用系统字体：Segoe UI Variable、Segoe UI、Microsoft YaHei UI、Microsoft YaHei、system-ui、sans-serif。
- 4px 基础间距，主要间距使用 8 / 12 / 16 / 24 / 32 / 48 / 64px。
- 页面最大宽度、侧栏宽度、圆角、边框、阴影和动效均使用 Token。
- 不使用复杂渐变、持续动画、装饰性插画或游戏化视觉。
- 所有可点击元素必须有 hover、active、focus-visible 和 disabled 状态。

### 3.5 Word Card 设计计划

文件：docs/v0.2.0-word-card-design-plan.md

作用：

- 将 Word Card 定位为低干扰、可预测、以回忆为中心的桌面学习卡片。
- 分析 qwerty-learner、闪卡工具和现代桌面学习软件的设计思路。
- 设计 Primary Layer、Interaction Layer、Secondary Layer、Future Extension。
- 定义单词、音标、中文释义、英文解释、例句和未来扩展的层级关系。
- 定义答案隐藏、答案显示、判断反馈三种核心状态。
- 比较三种结构：方案 A 大卡片中心式、方案 B 信息卡片式、方案 C 渐进展开式。
- 最终推荐方案 A，并有限借用方案 C 的渐进信息层级。
- 记录 Taste Skill 的视觉审查重点和人工审核节点。
- 规划后续 Word Card 整体图、Dark Mode、Light Mode 和多方案对比图。

### 3.6 Word Card 视觉规格

文件：docs/v0.2.0-word-card-visual-spec.md

关键内容：

- Word Card 是学习页唯一主要视觉焦点。
- 内容结构为 word-meta → word-prompt → answer-reserve → answer-content → answer-reveal-action。
- 判断操作位于卡片下方，不嵌入答案正文。
- 内容最大宽度约 min(100%, 1080px)，Word Card 阅读宽度约 min(100%, 760px)。
- 卡片内边距使用 clamp(var(--space-6), 4vw, var(--space-12))。
- 卡片使用 var(--radius-card)、var(--color-surface-elevated)、低对比边框和一层 var(--shadow-card)。
- 答案预留最小高度约 calc(24px * var(--font-scale))。
- 答案隐藏、答案已显示、Known/Unknown 判断反馈、Focus-visible、Disabled 状态均已定义。
- 长文本不能使用裁剪、固定高度或 overflow: hidden 隐藏关键内容。

### 3.7 Superpowers 设计规格

已完成的 Superpowers 设计规格：

- docs/superpowers/specs/2026-08-06-learning-page-ux-design.md

该文档作为已确认 UX 设计的补充规格，核心方向与 docs/v0.2.0-learning-page-ux-design.md 一致。后续 Chat 应将两者视为同一学习页 UX 设计决策的不同沉淀位置，不要重复创建互相冲突的方案。

### 3.8 相关项目交接文档

文件：docs/chat-handoff/project-management-handoff.md

作用：

- 记录整个 LexiStudy 项目背景、技术栈、分支、版本节点、Git 管理和开发环境。
- 记录工作区绑定问题和 PowerShell/npm 注意事项。
- 记录 v0.2.0 设计与开发路线。
- 记录通用的 Git、测试、代码修改和 UI-only 规则。

本文档专门补充“学习页 UI Chat”上下文；两个交接文档应一起阅读。

---

## 4. 已确定的重要 UI/UX 决策

### 4.1 页面信息架构

页面结构固定为：

~~~text
study-page
├── Header
├── Word Stage
│   └── Word Card
├── Action
│   ├── 不认识
│   └── 认识
└── Feedback
~~~

视觉优先级固定为：

~~~text
单词/当前提示
    ↓
当前可执行操作
    ↓
答案与判断
    ↓
模式与进度
    ↓
编号、快捷键和保存说明
~~~

### 4.2 Header 设计方向

Header 继续使用现有 compact-header 方向，包含：

- 学习中 / 新词练习。
- 英译中 / 中译英模式按钮。
- 当前计数，例如 12 / 35。

Header 的视觉层级低于 Word Card，但必须保持可见。标准窗口可保持一行；紧凑窗口允许自然换行，不能因为空间不足隐藏模式或进度。

### 4.3 Word Stage 设计方向

Word Stage 不是新的业务组件，而是学习内容的主舞台容器：

- 为 Word Card 提供居中、稳定、低干扰的阅读空间。
- 多出的窗口高度转换为呼吸感，不转换为新信息模块。
- 不新增统计、计时器、激励文案、奖励或辅助面板。

### 4.4 Word Card 定位

Word Card 采用方案 A“大卡片中心式”：

- 单词或中文提示保持卡片视觉中心。
- 答案区域预留稳定空间。
- 显示答案位于卡片内，是答案隐藏阶段的 primary action。
- 认识 / 不认识固定在卡片下方。
- 答案出现时只增加信息，不改变整体学习结构。
- 方案 C 的渐进展开只作为信息层级参考，不新增业务阶段。

### 4.5 Action 区域设计方向

- 判断按钮不放在底部固定栏中，避免遮挡紧凑窗口或字体放大后的内容。
- 不认识和认识等宽、相邻、同等可见。
- 答案隐藏时按钮可见但 disabled，位置不变化。
- 答案显示后两个按钮同时启用。
- 颜色表达 success/danger 语义，但文字、位置和焦点共同传达含义，不能只靠颜色。
- 最小点击区域约 44×44px。

### 4.6 Feedback 设计方向

Feedback 只用于确认状态，不新增 toast、弹窗、分数、连击、音效或游戏奖励：

- 提示阶段：准备好后查看答案。
- 答案阶段：请选择你的判断。
- 判断后：按钮短暂 active，随后进入下一词。
- 下一词出现时旧答案和旧反馈必须清除。

### 4.7 Dark / Light 主题

主题继续继承现有语义 Token：

- 背景：--color-bg。
- 卡片：--color-surface-elevated。
- 正文：--color-text。
- 辅助文字：--color-text-muted / --color-text-subtle。
- 主行动：--color-brand / --color-brand-strong。
- 认识/完成：--color-success / --color-success-surface。
- 不认识/错误：--color-danger / --color-danger-soft。
- 焦点：--color-focus / --shadow-focus。

深浅主题只改变 Token 映射，不改变内容顺序、按钮位置、交互语义或快捷键。

### 4.8 动效规范

LexiStudy 动效是“quiet kinetic”：轻、短、可预测。

- 微交互约 120–180ms。
- 答案出现约 160–220ms。
- 下一词过渡约 160–240ms。
- 优先只动画 opacity 和 transform。
- 不动画卡片高度、padding、按钮位置或页面整体布局。
- 不使用大幅滑屏、旋转、翻牌、持续发光或循环动画。
- prefers-reduced-motion: reduce 下取消位移、模糊、连续动画和非必要淡入，仅保留静态状态变化。

---

## 5. Word Card 相关上下文

### 5.1 Word Card 结构

当前冻结的结构方向：

~~~text
word-card
├── word-meta
│   └── 当前词编号 / 可选音标
├── word-prompt
│   └── 当前单词或中文释义
├── answer-reserve
│   └── 稳定的答案预留区
├── answer-content
│   └── 已显示的答案 / 解释 / 例句
└── answer-reveal-action
    └── 显示答案 · Space
~~~

判断操作在卡片外部的 answer-actions 区域：

~~~text
answer-actions
├── 不认识 · ←
└── 认识 · →
~~~

### 5.2 三种核心状态

#### State 1：答案隐藏

显示：

- 当前单词或中文提示。
- 单词编号。
- 音标仅在现有数据可用且不削弱回忆时显示。
- 稳定答案预留区。
- 准备好后查看答案。
- 显示答案 · Space。

用户目标是独立回忆。视觉重点：

~~~text
当前提示 > 显示答案 > 模式/进度 > metadata/辅助说明
~~~

判断按钮保持可见但 disabled，不显示答案、例句、分数、倒计时或自动揭示提示。

#### State 2：答案显示

答案进入预留区域，按“答案 → 解释 → 例句”层级排列；只有已有数据才展示解释或例句。

冻结规则：

- 卡片整体不发生明显跳动。
- 答案显示不改变卡片主结构。
- 显示答案进入 disabled。
- 认识 / 不认识同时启用。
- 长文本自然换行，不能裁剪关键内容。
- 答案显示不等于答对，不提前使用完成状态视觉。

#### State 3：判断反馈

这是短暂的视觉反馈，不是新增业务状态：

- 被点击按钮显示 active。
- 认识使用 success 语义，不认识使用 danger 语义。
- 颜色必须和文字、位置、焦点共同表达。
- 旧答案和旧反馈清除。
- 新词成为唯一主焦点。
- 不显示分数、连击、奖励、音效或弹窗。

### 5.3 已冻结参数与规则

以下是当前设计规格中的冻结方向，后续视觉设计可以微调表现，但不能改变语义：

| 项目 | 冻结方向 |
|---|---|
| 页面内容最大宽度 | min(100%, 1080px) 左右 |
| Word Card 阅读宽度 | 约 min(100%, 760px)；外层可根据容器适度扩展 |
| 卡片内边距 | clamp(var(--space-6), 4vw, var(--space-12)) |
| 卡片圆角 | var(--radius-card) |
| 卡片表面 | var(--color-surface-elevated) |
| 卡片边框 | 低对比 var(--color-border-strong) |
| 卡片阴影 | 一层 var(--shadow-card) |
| 答案预留最小高度 | calc(24px * var(--font-scale)) 方向 |
| Action 按钮 | 等宽、相邻、最小点击区域约 44×44px |
| 答案显示动效 | 约 160–220ms，优先 opacity/transform |
| 下一词动效 | 约 160–240ms，不能阻塞操作 |
| reduced-motion | 取消非必要位移和过渡 |
| 现有代码的固定 min-height: 430px | 已识别为视觉问题，后续实现需按响应式设计重新评估，不应机械保留 |

### 5.4 与后续视觉设计的关系

Word Card 视觉设计下一步不是立即改代码，而是先完成视觉探索和人工选择：

1. Word Card 整体概念图。
2. Dark Mode 版本。
3. Light Mode 版本。
4. 方案 A/B/C 多方案对比图。

图片只用于选择卡片比例、单词字号、留白、答案展开、主题层级和信息密度，不直接作为最终实现，也不授权新增功能。

音标、英文解释和例句目前只做表现层结构预留：

- 当前数据没有对应字段时不得创建空占位。
- 不新增词库字段、SQLite 字段、IPC 或数据流。
- 不生成假数据。
- 不新增音频、发音、AI、词源、易混词或收藏功能。

---

## 6. 已使用的 Skill 和设计方法

### 6.1 Superpowers

已使用：

- superpowers:using-superpowers：确认技能优先级和任务边界。
- superpowers:brainstorming：建立上下文探索、方案比较、设计确认、文档沉淀和评审门流程。
- 证据优先的完成检查：在报告完成前核对文件、章节和工作区状态。

Superpowers 在本项目中的使用方式：

1. 先读现有文档和代码结构。
2. 先确定学习页核心目标和 UI-only 边界。
3. 提出并比较多个视觉/结构方向。
4. 分段确认学习页骨架、状态矩阵、响应式与实现边界。
5. 设计获确认后再写文档。
6. 文档自审，检查范围、占位项、矛盾和歧义。

后续 Chat 不应跳过设计审批，直接把视觉概念图转成代码。

### 6.2 Taste Skill

已使用 Taste Skill 的高端视觉评估方法，用于：

- 评估 Word Card 是否有明确的单词视觉主角。
- 评估卡片比例、留白和层级是否适合长期重复使用。
- 检查深色主题中的光晕、阴影、对比度和视觉疲劳风险。
- 检查浅色主题中的边框、阴影、灰字和可读性风险。
- 检查动效是否提供“触感”而不是游戏化刺激。
- 检查是否出现通用模板、卡片堆叠、装饰性渐变和信息面板泛滥。

重要取舍：Taste Skill 的通用高端视觉建议不能覆盖项目现有 Design System。LexiStudy 仍然使用现有系统字体栈、语义 Token、卡片圆角、低对比边框和单层阴影；不强行引入新的字体、玻璃风格、双层 bezel 或大幅装饰。

### 6.3 UI/UX 设计流程

当前采用的流程：

~~~text
项目上下文
    ↓
学习流程与问题分析
    ↓
页面信息架构
    ↓
Word Card 结构方案
    ↓
状态矩阵与响应式规则
    ↓
视觉质量评估
    ↓
人工审核节点
    ↓
视觉概念探索
    ↓
实现计划
    ↓
UI-only 实现与回归验收
~~~

---

## 7. 当前问题

### 7.1 当前已知风险

- v0.2.0 Release Candidate 功能回归和安装版验证尚未开始。
- 统计、设置、词库管理页面的统一 UI 优化尚未进入当前阶段。
- `package.json` 版本仍为 `0.1.1`，不能将当前 alpha UI 冻结状态视为正式发布版本。
- 当前工作区仍有未追踪设计与交接文档，尚未执行 commit；不得擅自清理或覆盖。
- P0 Feedback 残留问题已关闭，当前没有已知的 Review 4 P0 阻塞项。

### 7.2 环境问题

- Codex Desktop 历史上存在错误工作区绑定问题。
- 正确项目路径是 C:\Users\ASUS\Desktop\英语词汇学习软件\Project。
- C:\Users\ASUS\Documents\New project 不是 LexiStudy 项目。
- PowerShell 中 npm 可能受执行策略影响，运行项目命令时优先使用 npm.cmd。
- 读取中文 Markdown 时优先指定 UTF-8，避免因为终端乱码而重写文件。
- SQLite 数据位于 Electron 用户数据目录，不应复制到源码目录或交接文档。

### 7.3 Chat 迁移问题

当前 Chat 不再作为后续开发 Chat 使用。原因是 Codex Desktop 历史 Chat 的工作区绑定不稳定，可能把新 Chat 放入错误目录。

新 Chat 的恢复方式：

1. 在正确的 Git Project 中打开新的 Chat。
2. 首先阅读 docs/chat-handoff/project-management-handoff.md。
3. 再阅读本文档。
4. 阅读当前任务相关的学习页设计文档。
5. 核对 branch/status/log。
6. 继续设计或实现，不从零重复询问产品背景。

### 7.4 仍需要人工确认的设计决策

以下内容仍不能由新 Chat 自行假设：

- Word Card 在 1180×760 中的最终占屏比例。
- 英文单词、中文提示和长单词的最终字号。
- 音标是否在当前视觉稿中显示，以及显示位置和权重。
- 答案展开是纯淡入、轻微位移，还是静态出现。
- 答案区预留高度如何兼容长释义和字体放大。
- 例句在当前数据条件下是否仅做结构预留，还是已有字段可以展示。
- 方案 A/B/C 的视觉对比结果，以及是否仍然采用方案 A。
- 深色/浅色主题的卡片表面、边界和 success/danger 状态强度。
- 信息密度是否适合连续学习数十个单词。

如果视觉选择会改变结构、状态或操作顺序，必须先停下来向用户确认。

---

## 8. 后续开发计划

### 8.1 近期：学习页视觉设计

目标：完成 Word Card 的人工选择和最终视觉方向。

建议顺序：

1. 阅读本文档和 Word Card 相关规格。
2. 生成 Word Card 整体概念图。
3. 生成 Dark Mode 版本。
4. 生成 Light Mode 版本。
5. 生成方案 A/B/C 对比图。
6. 人工确认卡片比例、字号、音标、答案展开、例句策略和信息密度。
7. 必要时更新 docs/v0.2.0-word-card-visual-spec.md，记录最终选择和取舍。

视觉图只是人工选择依据，不直接作为实现代码，也不能扩大 v0.2.0 范围。

### 8.2 中期：StudyPage UI 实现

确认视觉方向后，才进入 StudyPage 表现层实现。

允许调整：

- src/pages/StudyPage.tsx 的展示层 class、布局包裹和可访问性属性。
- 学习页相关 CSS、Token 映射、响应式布局、主题样式和状态 class。
- Word Card、Action、Feedback 的展示层状态和轻量动效。
- prefers-reduced-motion 适配。
- 必要的 aria、focus-visible 和语义 HTML 表现层调整。

禁止调整：

- getFrontText、getAnswerText、handleStudyKeyDown 的语义。
- onAnswer、onIndexChange、onModeChange 的调用时机和数据含义。
- index、showAnswer、entry 的业务意义。
- 学习算法、学习队列、掌握等级、错词逻辑和进度计算。
- SQLite、IPC、preload、Electron、本地文件访问和词库 JSON。
- 业务数据结构、新字段、新功能和新快捷键。

实现前必须说明：修改原因、修改文件、明确不修改的文件、是否影响业务逻辑、验证命令和回滚范围。

### 8.3 后续：其他页面统一设计

学习页完成并通过 Review 4 后，再考虑：

- 统计页 UI 统一。
- 设置页 UI 统一。
- 词库管理页 UI 统一。
- 全局主题、Typography、Layout、Focus 和 Motion 的一致性验收。
- v0.2.0 Release Candidate 回归与安装版验证。

这些页面不应反过来改变已经确认的学习页核心焦点和学习流程。

### 8.4 Review 4 最终验证结果

以下验证已完成：

~~~powershell
npm.cmd test -- --run
npm.cmd run build
~~~

并手动验证：

- 920×620。
- 1180×760。
- 宽屏与全屏。
- Dark / Light。
- 100% / 125% / 150% / 175% 字体缩放。
- 答案隐藏、答案显示、认识、不认识、下一词和完成状态。
- Space、Left Arrow、Right Arrow、Esc。
- prefers-reduced-motion: reduce。
- 长英文单词、长中文释义、长答案和多行内容。

自动化验证结果：

- `npm.cmd test -- --run`：9 个测试文件通过，31/31 tests 通过。
- `npm.cmd run build`：renderer 与 Electron TypeScript 构建通过。

---

## 9. 新 Chat 工作规则

### 9.1 阅读顺序

新的 Learning Page UI Chat 必须按以下顺序阅读：

1. docs/chat-handoff/project-management-handoff.md。
2. docs/chat-handoff/learning-page-ui-handoff.md。
3. docs/v0.2.0-learning-page-design-task.md。
4. docs/v0.2.0-learning-page-design-system.md。
5. docs/v0.2.0-learning-page-ux-design.md。
6. docs/v0.2.0-word-card-design-plan.md。
7. docs/v0.2.0-word-card-visual-spec.md。
8. 当前任务要求指定的其他视觉系统文档。

阅读完成后直接基于现有决策继续，不重复询问已经确定的产品背景、技术栈、分支、快捷键和 UI-only 约束。

### 9.2 修改方案前说明原因

如果需要修改任何设计方案，必须先说明：

- 为什么现有方案不足。
- 需要修改哪个文档或哪个设计决策。
- 修改会影响哪些区域、状态或验收标准。
- 是否影响现有 Token、组件状态矩阵或页面信息架构。
- 是否会扩大 v0.2.0 的范围。

没有用户确认时，不得把“视觉偏好”直接改成新的已冻结规范。

### 9.3 v0.2.0 UI-only 规则

v0.2.0 阶段禁止：

- 修改业务逻辑。
- 修改学习算法。
- 修改学习队列、掌握等级或错词逻辑。
- 修改 SQLite 表结构、字段、保存时机或数据模型。
- 修改 IPC、preload、Electron 数据通信或本地文件访问逻辑。
- 修改词库 JSON、词库内容、格式或导入流程。
- 修改现有学习数据流程、进度恢复和记录保存语义。
- 修改 Space、Left Arrow、Right Arrow、Esc 的快捷键语义。
- 增加音频、发音、收藏、评分、例句数据、AI、词源、易混词或其他新功能。

允许的内容仅限：

- UI 结构设计。
- 展示层布局。
- CSS、Token 映射、颜色、字体、间距、圆角和阴影。
- 状态 class、可访问性属性和轻量动效。
- 响应式、深浅主题、字体缩放和 reduced-motion 表现层适配。
- 设计文档、视觉概念图和人工审核记录。

### 9.4 Git 与文件规则

- 不自动创建分支。
- 不自动 commit。
- 不 push。
- 不删除或清理未追踪设计文档。
- 不覆盖用户已有文档，除非用户明确要求修改指定文件。
- 当前 Chat 的交接文件只允许新增本文档。
- 任何代码变更必须先获得明确实现授权；设计阶段不得修改 src/、electron/、resources/ 或数据库。

### 9.5 交接结论

新的 Learning Page UI Chat 应从当前 Review 4 冻结结果继续：

~~~text
已完成学习页 UX、Word Card V2.2 与 StudyPage UI
        ↓
Review 4 Final UI Freeze 通过
        ↓
文档同步完成
        ↓
Release Candidate 功能回归与安装版验证
~~~

不要从项目背景重新开始，不要把 Word Card 设计成新的业务系统，也不要因为视觉需求而修改学习逻辑。

## 10. Review 4 最终 UI 冻结状态

- Word Card Visual Design V2.2：已冻结。
- StudyPage UI：已实现并完成 UI Review、Micro Adjustment 和 Final Visual Verification。
- P0 Feedback 残留：已修复并验证。
- Review 4：最终 UI 冻结通过，当前仅进行文档同步。
- 后续阶段：v0.2.0 Release Candidate 功能回归与安装版验证。
