# DESIGN SYSTEM

正式试卷/旧式仪表风格：浅米色纸张、深蓝黑边框与正文、深蓝选中、暗红错误、低圆角、2px 边框、实体按键阴影、编号式分区和等宽统计数字。避免大面积渐变、玻璃态和游戏化大圆角卡片。

基础 token 位于 `src/styles/tokens.css`。触控目标至少 48px；正文行高不低于 1.65；桌面内容居中且最大 720px；底部导航预留安全区；正确/错误同时提供图标/文字而非只靠颜色。


## Learning content hierarchy

学習本文の major title 数、見出し階層、conceptual chunk、bridge sentence については:

`docs/INFORMATION_ARCHITECTURE_RULES.md`

を project-wide authority とする。

重要:
**source unit 数と learner-facing major title 数を同一視しない。**
