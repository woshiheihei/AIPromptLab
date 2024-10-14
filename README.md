# PromptCraft - 提示词收集平台

PromptCraft 是一个用于创建、管理和使用 AI 提示词的web应用程序。它允许用户浏览、创建、编辑和使用各种提示词模板，适用于写作、编程、创意等多个领域。

## 功能特点

- 浏览和搜索提示词
- 按类别筛选提示词
- 创建和编辑提示词模板
- 自定义提示词并生成最终结果
- 管理提示词类别
- 本地数据持久化存储

## 技术栈

- HTML5
- CSS (Tailwind CSS)
- JavaScript (原生)
- 本地存储 (localStorage)

## 项目结构

- `index.html`: 首页
- `browse.html`: 浏览提示词页面
- `prompt.html`: 提示词详情页面
- `edit.html`: 创建/编辑提示词页面
- `admin.html`: 管理页面
- `script.js`: 主要的 JavaScript 文件，包含所有功能逻辑

## 安装和运行

1. 克隆仓库到本地：
   ```
   git clone https://github.com/yourusername/promptcraft.git
   ```

2. 进入项目目录：
   ```
   cd promptcraft
   ```

3. 使用本地服务器运行项目，例如使用 Python 的 http.server：
   ```
   python -m http.server 8000
   ```

4. 在浏览器中访问 `http://localhost:8000` 即可使用应用。

## 使用说明

1. 在首页可以浏览热门提示词和按类别查看提示词。
2. 使用搜索框可以快速找到特定提示词。
3. 点击"创建提示词"可以创建新的提示词模板。
4. 在提示词详情页面可以自定义提示词并生成结果。
5. 管理页面允许管理提示词和类别。

## 贡献

欢迎提交 Pull Requests 来改进这个项目。对于重大更改，请先开 issue 讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)