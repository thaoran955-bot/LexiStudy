# LexiStudy Theme System V2

## 设计决策与冻结文档（方案二）

> 文档状态：Frozen / Implemented / Final Acceptance Passed
> 适用范围：LexiStudy v0.2.x UI/UX
> 当前阶段：v0.2.0 Final Release Freeze
> 实施状态：已按本文完成代码落地与人工验收；本文继续作为颜色职责的设计依据

---

## 0. 决策摘要

LexiStudy Theme System V2 采用 **Single Accent Theme**，并彻底分离以下语义职责：

- Accent：当前主题的主要交互强调色。
- Success：完成、已记录、Progress 和成功反馈。
- Danger：不认识、删除、错误和危险操作。
- Warning：需要注意但不代表失败的提示。
- Neutral：背景、表面、文字、边框、禁用和非强调信息。

主题 Accent 决策：

| 主题 | 背景方向 | 唯一 Accent |
|---|---|---|
| Dark Mode | Black + Green | Green |
| Light Mode | White + Blue | Blue |

Accent 与 Success 即使在 Dark Mode 中都属于绿色家族，也必须是两个不同的语义角色，不能互换 Token 或组件职责。

本阶段暂停所有新功能开发。未经本文件审核通过，不得进入统一颜色系统重构。

---

## 1. 设计背景

### 1.1 旧系统：Brand Blue + Success Green

当前仓库沿用的是双语义色系统：

- Brand Blue：主按钮、Active、链接和部分重点操作。
- Success Green：认识、完成、Progress 和成功反馈。

该系统在语义上是可解释的，但在长期学习场景中产生了明显的视觉问题：同一页面同时出现蓝色 Primary、绿色 Active 和绿色 Progress，用户会感知到多个竞争性的视觉中心。

Review 4、Word Card V2.2 审核和 Dogfooding 共同确认：

- 学习页需要稳定的单一操作焦点。
- 当前模式、主要操作和 CTA 应属于同一个 Accent 家族。
- Success 只能表达结果，不应再承担主要交互入口。
- 主题应先建立整体气质，再叠加有限的状态色。

### 1.2 为什么放弃旧的双 Accent 表现

放弃的不是“蓝色”和“绿色”本身，而是它们在同一主题中没有严格的职责边界：

1. Primary Button 使用蓝色，Mode Active 使用绿色，Progress 也使用绿色，导致操作色与结果色混杂。
2. 用户无法仅凭视觉快速判断“这是当前可操作项”还是“这是已经完成的结果”。
3. Word Card 的 Display Answer、Current Mode、Known Feedback 和 Progress 缺少稳定的颜色层级。
4. Dark Mode 的 Black + Green 产品气质被 Blue Primary 打断。
5. Light Mode 的 White + Blue 产品气质被大面积 Green Primary 或 Green Active 打断。

### 1.3 采用 Theme System V2 的原因

Theme System V2 采用单 Accent 主题，目的不是减少颜色数量，而是减少颜色职责的重叠：

- Dark Mode 将绿色作为唯一交互 Accent，形成 Black + Green 的稳定气质。
- Light Mode 将蓝色作为唯一交互 Accent，形成 White + Blue 的稳定气质。
- Success 继续保留绿色，但只表达结果和完成，不参与主要交互入口。
- Danger、Warning、Neutral 独立承担各自语义，不参与 Accent 竞争。

---

## 2. 设计理念

LexiStudy 是长期使用的 Windows 桌面学习工具，不是游戏化奖励界面，也不是短时营销页面。

Theme System V2 遵循以下原则：

### 2.1 Single Accent Theme

每个主题只允许一个交互 Accent：

- Dark Mode 的所有主要交互使用 Green Accent。
- Light Mode 的所有主要交互使用 Blue Accent。

这里的“唯一”指组件交互语义的唯一主强调色，不限制 Success、Danger 和 Warning 在其专属状态中出现。

### 2.2 降低认知负担

用户看到 Accent 时，可以预期它代表当前可操作、当前选择或下一步行动；看到 Success 时，可以预期它代表已完成、已记录或积极结果。

### 2.3 提高视觉一致性

同一主题中的以下组件必须共享 Accent 语义：

- Primary Button
- Navigation Active
- Current Selection
- Current Mode
- Display Answer
- Focus Ring
- CTA

这些组件不得分别选择 Brand、Success、Info 或其他状态色。

### 2.4 结果色不参与操作色

Success、Danger、Warning 只在状态已经发生后表达结果或风险，不用于模拟主要操作入口。

---

## 3. 颜色职责

### 3.1 Accent

Accent 是当前主题唯一的交互强调色，表示：

- 可执行的主要操作。
- 当前导航位置。
- 当前选中项。
- 当前学习模式。
- 当前 CTA。
- 键盘焦点。

Accent 不表示“答对”“完成”或“认识”。

### 3.2 Success

Success 始终使用 Green 家族，只表示：

- 完成。
- 已记录。
- Progress。
- Known Feedback。
- 成功状态。
- 完成状态。
- 学习统计中的积极结果。

Success 不得用于：

- Primary Button。
- Current Mode。
- Navigation Active。
- Display Answer。
- CTA。

### 3.3 Danger

Danger 始终使用 Red 家族，只表示：

- Unknown。
- Delete。
- Error。
- Danger Feedback。
- 危险操作。

Danger 不得承担 Accent 职责，也不得作为普通 CTA 或一般 Active 状态。

### 3.4 Warning

Warning 使用 Yellow 家族，只表示：

- 需要注意但不代表失败的提示。
- 风险说明。
- 非阻塞警告。

Warning 不得用于 Primary、Current Mode 或 Progress。

### 3.5 Neutral

Neutral 使用 Gray、黑灰或白灰表面，只表示：

- 页面背景。
- 卡片和面板表面。
- 普通文字。
- 辅助文字。
- 普通边框。
- 未选中控件。
- Disabled 状态。
- 非交互信息。

Neutral 不应抢占 Accent、Success 或 Danger 的视觉层级。

---

## 4. Token 架构原则

Theme System V2 采用三层 Token 结构：

```text
Primitive Token
    ↓
Semantic Theme Token
    ↓
Component Token
```

本文件定义的是设计层 Semantic Mapping，不在本阶段新增或修改实际 CSS 变量。

### 4.1 Semantic Token 角色

建议后续实现阶段建立或映射以下语义角色：

```text
--theme-background
--theme-surface
--theme-surface-elevated
--theme-accent
--theme-accent-hover
--theme-accent-contrast
--theme-success
--theme-success-strong
--theme-success-surface
--theme-danger
--theme-danger-strong
--theme-danger-surface
--theme-warning
--theme-warning-surface
--theme-text
--theme-text-muted
--theme-text-subtle
--theme-border
--theme-border-strong
--theme-focus
--theme-shadow
```

实现时不得让 `--theme-accent` 直接等同于 `--theme-success`。即使两者使用相同色相，也必须保持独立的语义 Token 和组件映射。

---

## 5. Dark Mode Token Mapping

### 5.1 主题方向

Dark Mode：**Black + Green**。

- 背景以黑色、石墨色和午夜黑为主。
- Green 是唯一交互 Accent。
- Success 仍然是 Green，但使用独立 Success Token，不能替代 Accent Token。
- Blue 不得作为 Primary、Active、CTA、Display Answer 或 Focus Accent。

### 5.2 Token Mapping

| Semantic Token | Dark Mode Mapping | 职责 |
|---|---|---|
| `--theme-background` | Black / Graphite `#0B111B` | 页面和应用背景 |
| `--theme-surface` | Deep Graphite `#151F2D` | 普通卡片、面板和侧栏表面 |
| `--theme-surface-elevated` | Elevated Graphite `#1B293A` | Word Card、重点面板 |
| `--theme-accent` | Green Accent `#A8D94A` | Primary、Active、CTA、Display Answer |
| `--theme-accent-hover` | Bright Green `#C9F36B` | Accent Hover 和强调态 |
| `--theme-accent-contrast` | Near Black `#0B111B` | Accent 实心控件上的文字 |
| `--theme-success` | Success Green `#9BBD55` | Progress、Known、完成和已记录 |
| `--theme-success-strong` | Deep Success Green | Success 高强调状态 |
| `--theme-success-surface` | Dark Green Surface `#203514` | Success 低填充背景 |
| `--theme-danger` | Soft Red `#FF9A91` | Unknown、Error、Delete |
| `--theme-danger-strong` | Strong Red | Danger 高强调状态 |
| `--theme-danger-surface` | Dark Red Surface `#49282B` | Danger 低填充背景 |
| `--theme-warning` | Warm Yellow `#F5C56B` | Warning 和注意提示 |
| `--theme-warning-surface` | Dark Yellow Surface | Warning 低填充背景 |
| `--theme-text` | Cool White `#F1F6FB` | 主文字和标题 |
| `--theme-text-muted` | Blue Gray `#A4B2C2` | 辅助文字、计数和说明 |
| `--theme-text-subtle` | Slate Gray `#718095` | 元数据和低优先级文字 |
| `--theme-border` | Low Contrast Border | 普通边框和分隔线 |
| `--theme-border-strong` | Stronger Graphite Border | 当前组件边界 |
| `--theme-focus` | Green Accent | Focus Ring，必须属于 Accent |
| `--theme-shadow` | Black Soft Shadow | 卡片和面板层级 |

### 5.3 Dark Mode 关键规则

- `Primary Button` 使用 Green Accent，不使用 Blue。
- `Navigation Active` 使用 Green Accent，不使用 Success Green 的结果语义。
- `Current Mode` 使用 Green Accent，不使用 Success Token。
- `Display Answer` 使用 Green Accent，不使用 Success Token。
- `Progress`、`Known` 和完成状态使用独立 Success Token。
- Blue 不得出现在 Dark Mode 的 Accent-bearing 组件中。

---

## 6. Light Mode Token Mapping

### 6.1 主题方向

Light Mode：**White + Blue**。

- 背景以白色、冷白和浅蓝灰为主。
- Blue 是唯一交互 Accent。
- Success 仍然是 Green，但只用于完成和成功结果。
- Green 不得作为 Primary、Active、CTA、Display Answer 或 Focus Accent。

### 6.2 Token Mapping

| Semantic Token | Light Mode Mapping | 职责 |
|---|---|---|
| `--theme-background` | Cool White `#F4F8FC` | 页面和应用背景 |
| `--theme-surface` | White `#FFFFFF` | 普通卡片、面板和侧栏表面 |
| `--theme-surface-elevated` | Soft White `#F8FBFF` | Word Card、重点面板 |
| `--theme-accent` | Blue `#0877D1` | Primary、Active、CTA、Display Answer |
| `--theme-accent-hover` | Deep Blue `#075CA6` | Accent Hover 和强调态 |
| `--theme-accent-contrast` | White `#FFFFFF` | Accent 实心控件上的文字 |
| `--theme-success` | Success Green `#4B7A16` | Progress、Known、完成和已记录 |
| `--theme-success-strong` | Deep Success Green `#355D0E` | Success 高强调状态 |
| `--theme-success-surface` | Light Green Surface `#E8F3D9` | Success 低填充背景 |
| `--theme-danger` | Red `#B7443F` | Unknown、Error、Delete |
| `--theme-danger-strong` | Strong Red | Danger 高强调状态 |
| `--theme-danger-surface` | Light Red Surface `#FBE8E6` | Danger 低填充背景 |
| `--theme-warning` | Warm Yellow `#9A6500` | Warning 和注意提示 |
| `--theme-warning-surface` | Light Yellow Surface | Warning 低填充背景 |
| `--theme-text` | Deep Navy Gray `#122033` | 主文字和标题 |
| `--theme-text-muted` | Slate Blue Gray `#5E7085` | 辅助文字、计数和说明 |
| `--theme-text-subtle` | Soft Slate `#5A6B7D` | 元数据和低优先级文字 |
| `--theme-border` | Cool Gray Border `#D6E1EC` | 普通边框和分隔线 |
| `--theme-border-strong` | Strong Cool Gray Border `#B8C9DA` | 当前组件边界 |
| `--theme-focus` | Blue Accent | Focus Ring，必须属于 Accent |
| `--theme-shadow` | Cool Soft Shadow | 卡片和面板层级 |

### 6.3 Light Mode 关键规则

- `Primary Button` 使用 Blue Accent，不使用 Green。
- `Navigation Active` 使用 Blue Accent，不使用 Success Green。
- `Current Mode` 使用 Blue Accent，不使用 Success Token。
- `Display Answer` 使用 Blue Accent，不使用 Success Token。
- `Progress`、`Known` 和完成状态使用独立 Success Token。
- Green 只能在 Success 语义组件中出现，不能作为 Light Mode Accent。

---

## 7. 组件颜色规范

| 组件/状态 | Dark Mode | Light Mode | 允许语义 | 禁止语义 |
|---|---|---|---|---|
| Primary Button | Green Accent | Blue Accent | Accent | Success、Danger |
| CTA | Green Accent | Blue Accent | Accent | Success、Danger |
| Navigation Active | Green Accent | Blue Accent | Accent | Success |
| Navigation Inactive | Neutral | Neutral | Neutral | Accent、Success |
| Display Answer | Green Accent | Blue Accent | Accent | Success |
| Current Mode | Green Accent | Blue Accent | Accent | Success |
| Mode Button Inactive | Neutral | Neutral | Neutral | Success |
| Current Selection | Green Accent | Blue Accent | Accent | Success |
| Known | Success Green | Success Green | Success | Accent、Danger |
| Unknown | Danger Red | Danger Red | Danger | Accent、Success |
| Progress | Success Green | Success Green | Success | Accent |
| Completion Feedback | Success Green | Success Green | Success | Accent |
| Sidebar Surface | Neutral Surface | Neutral Surface | Neutral | Accent 大面积铺底 |
| Sidebar Active Item | Green Accent | Blue Accent | Accent | Success |
| Statistics Labels | Neutral | Neutral | Neutral | Accent 大面积使用 |
| Statistics Progress | Success Green | Success Green | Success | Accent |
| Statistics Positive Result | Success Green | Success Green | Success | Accent |
| Interactive Statistics Link | Green Accent | Blue Accent | Accent | Success |
| Success Badge | Success Green | Success Green | Success | Accent |
| Danger Badge | Danger Red | Danger Red | Danger | Accent |
| Neutral Badge | Neutral Gray | Neutral Gray | Neutral | Accent、Success |
| Setting Selected | Green Accent | Blue Accent | Accent | Success |
| Setting Valid Status | Success Green | Success Green | Success | Accent |
| Destructive Setting | Danger Red | Danger Red | Danger | Accent |
| Focus Ring | Green Accent | Blue Accent | Accent | Success、Danger |
| Accent Hover | Accent Hover | Accent Hover | Accent | Success |
| Success Hover | Success Strong | Success Strong | Success | Accent substitution |
| Disabled Control | Neutral Muted | Neutral Muted | Neutral | Accent、Success、Danger |
| Header Text | Neutral | Neutral | Neutral | Accent as body text |
| Header CTA | Green Accent | Blue Accent | Accent | Success |
| Toggle On / Current | Green Accent | Blue Accent | Accent | Success |
| Toggle Off | Neutral | Neutral | Neutral | Success |

### 7.1 组件状态补充

- Accent 组件的 hover、active、focus-visible 必须继续留在 Accent 家族内。
- Success 组件的 hover、active、focus-visible 可以使用 Success Strong，但不得转成 Accent。
- Danger 组件的 hover、active、focus-visible 可以使用 Danger Strong，但不得转成 Accent。
- Disabled 只降低可用性表达，不表达成功或失败。
- 颜色不能是唯一状态信息；必须同时保留文字、位置、边框、图标或可访问性语义。

---

## 8. 禁止事项

### 8.1 Theme Accent 禁止事项

- Dark Mode 禁止出现 Blue Primary。
- Dark Mode 禁止使用 Blue 作为 Navigation Active、Current Mode、Display Answer、CTA 或 Focus Ring。
- Light Mode 禁止出现 Green Primary。
- Light Mode 禁止使用 Green 作为 Navigation Active、Current Mode、Display Answer、CTA 或 Focus Ring。
- 不得让同一主题同时存在两个竞争性的 Accent。

### 8.2 Semantic Token 禁止事项

- Accent 不承担 Success。
- Success 不承担 Primary。
- Success 不承担 Current Mode。
- Success 不承担 Navigation。
- Success 不承担 Display Answer。
- Danger 不承担 Accent。
- Danger 不承担普通 Active 或 CTA。
- Warning 不承担 Progress 或 Primary。
- Neutral 不得被高对比度强化为伪 Accent。

### 8.3 实现边界禁止事项

- 不在组件 CSS 中直接写新的主题色。
- 不通过局部 class 覆盖 Theme System V2 的语义映射。
- 不在 Dark Mode 中保留旧的 Blue Brand Primary。
- 不在 Light Mode 中把 Success Green 误用为 Primary 或 Active。
- 不修改学习算法、SQLite、IPC、数据模型、词库或快捷键语义来实现主题调整。

---

## 9. 后续需要 Codex 修改的文件清单

本节只列出后续统一颜色系统重构可能涉及的文件，本轮不修改。

### 9.1 全局 Theme 与 Token

- `src/styles/global.css`

### 9.2 学习页

- `src/pages/StudyPage.tsx`

### 9.3 首页与进度

- `src/pages/HomePage.tsx`
- `src/components/ProgressCard.tsx`

### 9.4 全局壳层与导航

- `src/components/AppShell.tsx`
- `src/App.tsx`（仅在主题入口或主题状态接线需要时）

### 9.5 统计、设置和词库管理

- `src/pages/StatsPage.tsx`
- `src/pages/SettingsPage.tsx`
- `src/pages/DictionaryManagementPage.tsx`
- `src/pages/KeyboardShortcutsPage.tsx`

### 9.6 相关设计与验收文档

- `docs/v0.2.0-visual-system-design.md`
- `docs/v0.2.0-ui-design-spec.md`
- `docs/v0.2.0-learning-page-design-system.md`
- `docs/v0.2.0-learning-page-ux-design.md`
- `docs/v0.2.0-word-card-visual-spec.md`
- `docs/chat-handoff/learning-page-ui-handoff.md`
- `docs/chat-handoff/word-card-visual-handoff.md`
- `docs/v0.2.0-learning-page-final-verification-record.md`

---

## 10. 冻结审核门

Theme System V2 在用户审核通过前属于设计提案，不进入实现阶段。

审核通过后，下一阶段才可以：

1. 将本文件中的 Semantic Mapping 转换为实际 Theme Token。
2. 更新全局组件 Token 和页面表现层映射。
3. 按 Dark / Light、Primary / Success / Danger / Warning / Neutral 状态矩阵进行回归验收。
4. 重新执行 StudyPage、Home、Statistics、Settings、Dictionary 和 Sidebar 的视觉验证。

在用户明确批准前：

- 不修改代码。
- 不修改 CSS。
- 不修改 Token。
- 不修改 `global.css`。
- 不修改组件。
- 不 commit。
- 不 push。
