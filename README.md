# RoboDojo Dynamic Interference Benchmark

研究计划与交互式任务展示网页。基于 RoboDojo 环境与既有干净示范数据、适配权重，研究机器人应对执行中动态干扰的能力。

## 范围

- 项目：8 个基线任务、4 类动态干扰。
- 本页：A–D 分组（分类、扔瓶、倒水、叠积木），对应 16 项干扰任务。
- 四段视频为原始基线任务演示，不是动态干扰实验结果。
- 模型表来自既有材料引用的外部无干扰成绩，尚未在本项目复现；A–D 均值不代表全部 8 个基线任务。
- YAM Ultra2 实机验证属于计划。

## 访问

网站：https://wanglin-he.github.io/robodojo-dynamic-benchmark/

点击类别放大分支，点击任务查看说明与视频。Esc 返回上一级，方向键切换同级分支。网站无需后端。

## 本地编辑

1. 修改 `src/explorer.html`、`src/explorer.css`、`src/fastwam-theme.css` 或 `src/explorer.js`。
2. 使用 Node.js 运行 `node build.mjs`，生成根目录的 `index.html`。
3. 推送到 `main`，GitHub Pages 从根目录发布。

离线查看时，下载仓库后打开 `index.html`，并保留旁边的 `media/` 文件夹。

## 资料与样式

- RoboDojo：https://github.com/RoboDojo-Benchmark/RoboDojo
- 配色：白色与 Columbia Blue `#B9D9EB`。仅借用配色，不表示哥伦比亚大学背书；未使用其标志。
- 视频与第三方资料的权利归各自权利人所有。本仓库未额外授予媒体使用许可。
