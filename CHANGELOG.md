# 更新日志

## v0.2.0 — Final Release Freeze (2026-08-24)

### Added

- UI design system foundation。
- Homepage redesign。
- Dark/light theme foundation。
- Typography scaling。
- Animation feedback。
- Appearance > Theme controls with persisted Light/Dark selection。
- Shared integer percentage formatting for Home and Statistics daily progress。

### Improved

- Homepage information hierarchy。
- Card visual hierarchy。
- Responsive layout。
- Compact window experience。

### Fixed

- Homepage layout overflow issues。
- UI consistency issues。
- Theme System V2 color-role separation: Dark = Black + Green Accent; Light = White + Blue Accent。
- Light Mode Home learning-progress accent mapping。
- Light Mode Sidebar current-progress accent mapping。
- Statistics dashboard Accent mapping for Today Target, Total Study Count, Total Accuracy, and Mastery Distribution。
- Home and Statistics daily-learning data unified through `todayCompleted`。
- Home and Statistics percentage precision unified with integer rounding。

### Verification

- Automated tests: 13 test files, 46 tests passed。
- Renderer Build and Electron TypeScript Build: PASS。
- Final installed-app manual acceptance: PASS。
- P0: 0；P1: 0。

### Release status

- FINAL ACCEPTANCE PASSED。
- FINAL RELEASE FREEZE。
- Git commit、tag、push remain pending separate AAA authorization。

## LexiStudy v0.1.1 Stable

### 新增

- SQLite学习状态保存。
- 多词库管理。
- JSON词库导入。
- 学习统计系统。
- 设置持久化。

### 修复

- 修复 Electron 生产环境黑屏问题。
- 修复快捷键稳定性问题。
- 修复 Space 导致页面滚动问题。
- 完善词库导入入口。

### 版本保持

- SQLite 数据结构不变。
- 学习记录兼容。
- 词库数据不变。
- 学习算法不变。

### 验收

- 完成功能开发、安装测试、干净环境测试、Computer Use 用户模拟测试和人工最终复查。

## v0.1.0

### 包含功能

- Electron + React桌面应用
- Windows安装包
- 内置词库
- JSON词库导入
- 多词库管理
- 词库切换
- SQLite学习记录
- 掌握等级算法
- 错词复习
- 学习统计
- 设置系统
