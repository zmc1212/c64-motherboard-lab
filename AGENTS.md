# COMMODORE 64（ASSY 250425，PAL）装配模拟实验室

蓝图风 C64 主板装配（ASSY 250425 真实位号）：8× 4164 DRAM（U9-U12 + U21-U24）、
VIC-II 6569（U19）、SID 6581（U18）、PLA 906114（U17）、6510（U7）、2× CIA 6526（U15/U16）、
BASIC/KERNAL 2364 ROM（U3/U4）、CHAR 2332（U5）、2114 色彩 SRAM（U6）、8701 时钟芯片（U31，
17.734476 MHz ÷18 → CPU 0.985 MHz）、RF 盒（UHF 36）与 CRT 监视器。32 个零件分 8 阶段装配，
BOOT 阶段出 BASIC V2 READY，SID 阶段三声部 JAM。

## 启动方式
- HTTP：`python3 tools/serve.py 8080`（禁缓存）→ http://127.0.0.1:8080
- 双击 index.html：经典 `<script>`、无 fetch、贴图程序化生成，file:// 行为一致。

## 交互
拖动旋转 / 滚轮缩放 / 点击零件 / 空格暂停 / R 重播 / 1-8 跳阶段
（pcb → dram → custom → cpu → rom → conn → boot → sid）；
BOOT 之后按 A S D F G H J K 用 SID 弹音符（Pulse/Saw/Tri 三声部）。

## 验收
按 7（boot）：CRT 蓝屏、内存映射填充、READY 标签；按 8（sid）并按键弹音，
SID 面板 V1/V2/V3 有输出。控制台无错误。

音效：首次点击/按键自动启用（合成音，零素材），右上角 🔊/🔇 可切换；零件落座、阶段切换、打字均配音。
