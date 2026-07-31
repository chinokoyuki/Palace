---
title: PyECharts 数据可视化
description: 完整的 PyECharts 开发文档，涵盖安装、图表类型、配置项、主题、交互、导出、Web 集成及论文插图案例
order: 1
---

# PyECharts 数据可视化

PyECharts 是百度开源的 ECharts 图表库在 Python 生态中的封装。它让研究者、开发者和数据分析师能够使用纯 Python 代码生成高质量、可交互的 Web 图表，并将结果渲染为 HTML 文件、Jupyter Notebook 输出或静态图片。对于需要撰写论文、报告或技术文档的用户，PyECharts 可以快速生成符合学术规范的折线图、柱状图、散点图、热力图、雷达图等可视化结果。

## PyECharts 是什么

ECharts 是百度开源的一个基于 JavaScript 的数据可视化库，支持 20 余种常见图表类型，以及丰富的交互组件。PyECharts 将 ECharts 的配置能力映射为 Python API，用户无需编写 JavaScript 即可完成：

- 折线图、柱状图、饼图、散点图、雷达图、热力图、地图、K 线图、关系图、树图、桑基图、漏斗图、仪表盘、词云等。
- 多坐标系、多图联动、数据缩放、视觉映射、时间轴、区域缩放等高级交互。
- 主题切换、自定义主题、响应式布局。
- 导出为 HTML、PNG、JPG、PDF 等格式。

PyECharts 的核心优势在于：

1. **声明式 API**：通过链式调用描述图表，代码结构清晰。
2. **与 ECharts 完全同步**：PyECharts 生成的配置对象可以直接交给 ECharts 渲染。
3. **生态丰富**：支持 Jupyter、Flask、Django、Streamlit 等多种环境。
4. **适合论文场景**：可通过 `snapshot` 插件导出高分辨率静态图片，方便插入 LaTeX、Word 或 PDF 论文。

## 环境安装与版本说明

### 安装 PyECharts

```bash
pip install pyecharts
```

截至本文撰写时，PyECharts 1.x 版本与 ECharts 5.x 对应。建议使用虚拟环境管理依赖：

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
pip install pyecharts
```

### 安装地图扩展

如果需要绘制中国地图或世界地图，需要额外安装地图资源包：

```bash
pip install echarts-countries-pypkg      # 世界地图
pip install echarts-china-provinces-pypkg  # 中国省级地图
pip install echarts-china-cities-pypkg     # 中国市级地图
pip install echarts-china-counties-pypkg   # 中国县级地图
```

### 安装图片导出依赖

论文中通常需要插入静态图片。PyECharts 生成的是 HTML，导出图片需要安装 `snapshot` 系列插件之一：

```bash
# 使用 Selenium（需要安装浏览器驱动）
pip install snapshot-selenium

# 使用 Playwright（推荐，安装更简便）
pip install snapshot-playwright

# 或使用 PhantomJS（已停止维护，不推荐新项目使用）
pip install snapshot-phantomjs
```

### 验证安装

```python
import pyecharts
print(pyecharts.__version__)
```

## 第一个可运行示例

下面创建一个最基础的柱状图，并渲染为 HTML 文件：

```python
from pyecharts.charts import Bar
from pyecharts import options as opts

bar = (
    Bar()
    .add_xaxis(["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"])
    .add_yaxis("商家A", [5, 20, 36, 10, 75, 90])
    .add_yaxis("商家B", [15, 6, 45, 20, 35, 66])
    .set_global_opts(
        title_opts=opts.TitleOpts(title="2024 年季度销售统计", subtitle="单位：件"),
        toolbox_opts=opts.ToolboxOpts(),
    )
)
bar.render("first_bar_chart.html")
```

<EChartsDemo :option="firstBarOption" />

运行后，当前目录会生成 `first_bar_chart.html`。用浏览器打开即可查看交互式图表。

## 核心对象与设计思想

PyECharts 的代码结构通常遵循以下模式：

1. **导入图表类**：`from pyecharts.charts import Bar, Line, Pie`。
2. **实例化图表对象**：`bar = Bar(init_opts=...)`。
3. **添加数据**：`.add_xaxis(...)` 和 `.add_yaxis(...)`。
4. **配置全局选项**：`.set_global_opts(...)`。
5. **配置系列选项**：`.set_series_opts(...)`。
6. **渲染或导出**：`.render()`、`.render_notebook()`、`make_snapshot(...)`。

### InitOpts：初始化配置

`InitOpts` 控制图表的整体初始化属性：

```python
from pyecharts.globals import ThemeType

bar = Bar(
    init_opts=opts.InitOpts(
        width="900px",
        height="500px",
        theme=ThemeType.LIGHT,
        bg_color="white",
        chart_id="my_chart",
        renderer="canvas",  # 或 "svg"
        page_title="论文图表",
    )
)
```

常用属性说明：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `width` | str | 图表宽度，如 `"900px"` |
| `height` | str | 图表高度，如 `"500px"` |
| `theme` | str/ThemeType | 主题名称 |
| `bg_color` | str | 背景颜色 |
| `renderer` | str | 渲染器，`canvas` 或 `svg` |
| `animation_opts` | AnimationOpts | 动画配置 |

## 基础图表类型

### 柱状图 Bar

柱状图用于比较不同类别的数据大小。PyECharts 支持分组柱状图、堆叠柱状图、水平柱状图等。

#### 分组柱状图

```python
from pyecharts.charts import Bar
from pyecharts import options as opts

bar = (
    Bar()
    .add_xaxis(["Q1", "Q2", "Q3", "Q4"])
    .add_yaxis("产品A", [120, 132, 101, 134])
    .add_yaxis("产品B", [220, 182, 191, 234])
    .add_yaxis("产品C", [150, 232, 201, 154])
    .set_global_opts(
        title_opts=opts.TitleOpts(title="季度销量对比"),
        legend_opts=opts.LegendOpts(pos_top="5%"),
        xaxis_opts=opts.AxisOpts(name="季度"),
        yaxis_opts=opts.AxisOpts(name="销量（件）"),
    )
)
bar.render("grouped_bar.html")
```

<EChartsDemo :option="barOption" />

#### 堆叠柱状图

通过为每个系列设置相同的 `stack` 值实现堆叠：

```python
bar = (
    Bar()
    .add_xaxis(["Q1", "Q2", "Q3", "Q4"])
    .add_yaxis("直接访问", [320, 302, 301, 334], stack="总量")
    .add_yaxis("邮件营销", [120, 132, 101, 134], stack="总量")
    .add_yaxis("联盟广告", [220, 182, 191, 234], stack="总量")
    .set_global_opts(
        title_opts=opts.TitleOpts(title="流量来源堆叠图"),
        xaxis_opts=opts.AxisOpts(name="季度"),
        yaxis_opts=opts.AxisOpts(name="访问量"),
    )
)
bar.render("stacked_bar.html")
```

<EChartsDemo :option="stackedBarOption" />

#### 水平柱状图

通过 `reversal_axis()` 将坐标轴反转：

```python
bar = (
    Bar()
    .add_xaxis(["Python", "Java", "C++", "Go", "Rust"])
    .add_yaxis("2023", [90, 80, 70, 60, 50])
    .reversal_axis()
    .set_series_opts(label_opts=opts.LabelOpts(position="right"))
    .set_global_opts(title_opts=opts.TitleOpts(title="编程语言流行度"))
)
bar.render("horizontal_bar.html")
```

<EChartsDemo :option="horizontalBarOption" />

### 折线图 Line

折线图适合展示数据随时间变化的趋势，支持平滑曲线、面积图、阶梯线等。

#### 基础折线图

```python
from pyecharts.charts import Line

line = (
    Line()
    .add_xaxis(["1月", "2月", "3月", "4月", "5月", "6月"])
    .add_yaxis("销售额", [120, 200, 150, 80, 70, 110])
    .add_yaxis("利润", [30, 50, 40, 20, 15, 35])
    .set_global_opts(
        title_opts=opts.TitleOpts(title="月度业绩趋势"),
        xaxis_opts=opts.AxisOpts(name="月份", boundary_gap=False),
        yaxis_opts=opts.AxisOpts(name="金额（万元）"),
    )
)
line.render("line_chart.html")
```

<EChartsDemo :option="lineOption" />

#### 平滑曲线与面积图

```python
line = (
    Line()
    .add_xaxis(["1月", "2月", "3月", "4月", "5月", "6月"])
    .add_yaxis(
        "销售额",
        [120, 200, 150, 80, 70, 110],
        is_smooth=True,
        areastyle_opts=opts.AreaStyleOpts(opacity=0.3),
        symbol="circle",
        symbol_size=8,
    )
    .set_global_opts(title_opts=opts.TitleOpts(title="平滑面积图"))
)
line.render("smooth_area_line.html")
```

<EChartsDemo :option="smoothAreaLineOption" />

#### 阶梯图

```python
line = (
    Line()
    .add_xaxis(["1月", "2月", "3月", "4月", "5月", "6月"])
    .add_yaxis("温度", [5, 8, 12, 18, 24, 28], is_step=True)
    .set_global_opts(title_opts=opts.TitleOpts(title="月度平均气温"))
)
line.render("step_line.html")
```

<EChartsDemo :option="stepLineOption" />

### 饼图 Pie

饼图展示各部分占总体的比例，支持基础饼图、环形图、玫瑰图等。

#### 基础饼图

```python
from pyecharts.charts import Pie

pie = (
    Pie()
    .add(
        "",
        [
            ("直接访问", 335),
            ("邮件营销", 310),
            ("联盟广告", 234),
            ("视频广告", 135),
            ("搜索引擎", 1548),
        ],
    )
    .set_global_opts(title_opts=opts.TitleOpts(title="访问来源分布"))
    .set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {c} ({d}%)"))
)
pie.render("pie_chart.html")
```

<EChartsDemo :option="pieOption" />

#### 环形图

通过 `radius` 参数设置内外半径：

```python
pie = (
    Pie()
    .add(
        "",
        [("A", 30), ("B", 25), ("C", 20), ("D", 15), ("E", 10)],
        radius=["40%", "75%"],
    )
    .set_global_opts(title_opts=opts.TitleOpts(title="环形图"))
    .set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {d}%"))
)
pie.render("donut_chart.html")
```

<EChartsDemo :option="donutPieOption" />

#### 南丁格尔玫瑰图

```python
pie = (
    Pie()
    .add(
        "",
        [("A", 10), ("B", 20), ("C", 30), ("D", 40), ("E", 50)],
        rosetype="radius",
        radius=["30%", "75%"],
    )
    .set_global_opts(title_opts=opts.TitleOpts(title="玫瑰图"))
)
pie.render("rose_chart.html")
```

<EChartsDemo :option="rosePieOption" />

### 散点图 Scatter

散点图用于展示两个变量之间的关系，支持气泡大小映射第三维度。

```python
from pyecharts.charts import Scatter
import random

x_data = [random.randint(0, 100) for _ in range(50)]
y_data = [random.randint(0, 100) for _ in range(50)]
sizes = [random.randint(10, 50) for _ in range(50)]

data = [[x, y, s] for x, y, s in zip(x_data, y_data, sizes)]

scatter = (
    Scatter()
    .add_xaxis(x_data)
    .add_yaxis(
        "样本",
        data,
        symbol_size=lambda x: x[2] / 2,
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(title="气泡散点图"),
        xaxis_opts=opts.AxisOpts(name="X 变量", type_="value"),
        yaxis_opts=opts.AxisOpts(name="Y 变量", type_="value"),
        visualmap_opts=opts.VisualMapOpts(min_=10, max_=50),
    )
)
scatter.render("scatter_chart.html")
```

<EChartsDemo :option="scatterOption" />

### 雷达图 Radar

雷达图用于展示多维数据：

```python
from pyecharts.charts import Radar

radar = (
    Radar()
    .add_schema(
        schema=[
            opts.RadarIndicatorItem(name="进攻", max_=100),
            opts.RadarIndicatorItem(name="防守", max_=100),
            opts.RadarIndicatorItem(name="速度", max_=100),
            opts.RadarIndicatorItem(name="技巧", max_=100),
            opts.RadarIndicatorItem(name="体能", max_=100),
        ]
    )
    .add("球员A", [[85, 70, 90, 80, 75]])
    .add("球员B", [[70, 90, 75, 85, 80]])
    .set_global_opts(title_opts=opts.TitleOpts(title="能力雷达图"))
)
radar.render("radar_chart.html")
```

<EChartsDemo :option="radarOption" />

### 热力图 Heatmap

热力图展示矩阵数据的强度分布：

```python
from pyecharts.charts import HeatMap

hours = ["12a", "1a", "2a", "3a", "4a", "5a", "6a"]
days = ["周六", "周五", "周四", "周三", "周二", "周一", "周日"]

data = [
    [0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0],
    [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0],
    [2, 0, 3], [2, 1, 1], [2, 2, 0], [2, 3, 0],
]

heatmap = (
    HeatMap()
    .add_xaxis(hours)
    .add_yaxis("活跃度", days, data)
    .set_global_opts(
        title_opts=opts.TitleOpts(title="用户活跃热力图"),
        visualmap_opts=opts.VisualMapOpts(min_=0, max_=10),
    )
)
heatmap.render("heatmap_chart.html")
```

<EChartsDemo :option="heatmapOption" />

### 地图 Map

地图适合展示地理分布数据：

```python
from pyecharts.charts import Map

map_chart = (
    Map()
    .add(
        "GDP",
        [("广东", 124369), ("江苏", 116364), ("山东", 83095), ("浙江", 73516)],
        "china",
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(title="2022 年各省 GDP（亿元）"),
        visualmap_opts=opts.VisualMapOpts(min_=50000, max_=130000),
    )
)
map_chart.render("map_chart.html")
```

<EChartsDemo v-if="mapReady" :option="mapOption" height="500px" />

### 其他常用图表

| 图表类 | 用途 | 关键类 |
| --- | --- | --- |
| `Kline` | 金融 K 线图 | `pyecharts.charts.Kline` |
| `Boxplot` | 箱线图 | `pyecharts.charts.Boxplot` |
| `Funnel` | 漏斗图 | `pyecharts.charts.Funnel` |
| `Gauge` | 仪表盘 | `pyecharts.charts.Gauge` |
| `Graph` | 关系图 | `pyecharts.charts.Graph` |
| `Tree` | 树图 | `pyecharts.charts.Tree` |
| `Treemap` | 矩形树图 | `pyecharts.charts.TreeMap` |
| `WordCloud` | 词云 | `pyecharts.charts.WordCloud` |
| `Liquid` | 水球图 | `pyecharts.charts.Liquid` |
| `Sunburst` | 旭日图 | `pyecharts.charts.Sunburst` |

## 坐标系与多图布局

### 直角坐标系 Grid

大多数图表默认使用直角坐标系。可以通过 `Grid` 实现多图组合：

```python
from pyecharts.charts import Grid, Line, Bar

bar = (
    Bar()
    .add_xaxis(["1月", "2月", "3月", "4月", "5月", "6月"])
    .add_yaxis("销售额", [120, 200, 150, 80, 70, 110])
)

line = (
    Line()
    .add_xaxis(["1月", "2月", "3月", "4月", "5月", "6月"])
    .add_yaxis("增长率", [10, 20, 15, -5, -8, 12])
)

grid = (
    Grid()
    .add(bar, grid_opts=opts.GridOpts(pos_left="5%", pos_right="55%"))
    .add(line, grid_opts=opts.GridOpts(pos_left="60%", pos_right="5%"))
)
grid.render("grid_chart.html")
```

<EChartsDemo :option="gridOption" />

### 多子图 Page

`Page` 可以将多个独立图表按顺序排列在一个 HTML 页面中：

```python
from pyecharts.charts import Page

page = Page(layout=Page.DraggablePageLayout)
page.add(bar, line, pie)
page.render("dashboard.html")
```

### 时间轴 Timeline

`Timeline` 可以按时间维度切换多个图表：

```python
from pyecharts.charts import Timeline

timeline = Timeline()
timeline.add(bar_2022, "2022")
timeline.add(bar_2023, "2023")
timeline.add(bar_2024, "2024")
timeline.render("timeline_chart.html")
```

## 全局配置项详解

全局配置通过 `set_global_opts` 设置，影响整个图表。

### 标题 TitleOpts

```python
.set_global_opts(
    title_opts=opts.TitleOpts(
        title="论文实验结果",
        subtitle="方法 A 与方法 B 对比",
        title_textstyle_opts=opts.TextStyleOpts(font_size=18, font_weight="bold"),
        subtitle_textstyle_opts=opts.TextStyleOpts(font_size=12, color="#666"),
        pos_left="center",
        pos_top="10",
    )
)
```

### 图例 LegendOpts

```python
.set_global_opts(
    legend_opts=opts.LegendOpts(
        orient="vertical",
        pos_right="5%",
        pos_top="center",
        item_width=20,
        item_height=14,
    )
)
```

### 坐标轴 AxisOpts

```python
.set_global_opts(
    xaxis_opts=opts.AxisOpts(
        name="迭代次数",
        type_="category",
        axislabel_opts=opts.LabelOpts(rotate=30),
        splitline_opts=opts.SplitLineOpts(is_show=True),
    ),
    yaxis_opts=opts.AxisOpts(
        name="准确率（%）",
        type_="value",
        min_=0,
        max_=100,
    ),
)
```

### 提示框 TooltipOpts

```python
.set_global_opts(
    tooltip_opts=opts.TooltipOpts(
        trigger="axis",
        axis_pointer_type="cross",
        formatter="{a} <br/>{b}: {c}",
    )
)
```

### 工具箱 ToolboxOpts

```python
.set_global_opts(
    toolbox_opts=opts.ToolboxOpts(
        orient="horizontal",
        pos_left="right",
        feature=opts.ToolBoxFeatureOpts(
            save_as_image=opts.ToolBoxFeatureSaveAsImageOpts(
                title="保存图片",
                pixel_ratio=2,
            ),
            data_zoom=opts.ToolBoxFeatureDataZoomOpts(zoom_title="区域缩放"),
            restore=opts.ToolBoxFeatureRestoreOpts(),
            magic_type=opts.ToolBoxFeatureMagicTypeOpts(
                line_title="切换为折线",
                bar_title="切换为柱状",
            ),
        ),
    )
)
```

## 系列配置项详解

系列配置通过 `set_series_opts` 设置，影响单个数据系列。

### 标签 LabelOpts

```python
.set_series_opts(
    label_opts=opts.LabelOpts(
        is_show=True,
        position="top",
        font_size=10,
        color="black",
        formatter="{c}",
    )
)
```

### 标记点与标记线

```python
.set_series_opts(
    markpoint_opts=opts.MarkPointOpts(
        data=[
            opts.MarkPointItem(type_="max", name="最大值"),
            opts.MarkPointItem(type_="min", name="最小值"),
        ]
    ),
    markline_opts=opts.MarkLineOpts(
        data=[opts.MarkLineItem(type_="average", name="平均值")]
    ),
)
```

### 折线样式 LineStyleOpts

```python
.add_yaxis(
    "系列1",
    [120, 200, 150, 80, 70, 110],
    linestyle_opts=opts.LineStyleOpts(width=3, type_="dashed", color="#ff7f50"),
    itemstyle_opts=opts.ItemStyleOpts(color="#ff7f50"),
)
```

## 交互组件

### 数据缩放 DataZoom

```python
.set_global_opts(
    datazoom_opts=[
        opts.DataZoomOpts(type_="inside", range_start=0, range_end=100),
        opts.DataZoomOpts(type_="slider", range_start=0, range_end=100),
    ]
)
```

### 视觉映射 VisualMap

```python
.set_global_opts(
    visualmap_opts=opts.VisualMapOpts(
        min_=0,
        max_=100,
        range_color=["#50a3ba", "#eac736", "#d94e5d"],
        pos_left="left",
        pos_bottom="10%",
    )
)
```

### 区域缩放 Brush

```python
.set_global_opts(
    brush_opts=opts.BrushOpts(tool_box=["rect", "polygon", "clear"])
)
```

## 主题与样式定制

### 内置主题

```python
from pyecharts.globals import ThemeType

bar = Bar(init_opts=opts.InitOpts(theme=ThemeType.MACARONS))
```

常用内置主题：

| 主题 | 风格 |
| --- | --- |
| `ThemeType.LIGHT` | 默认明亮 |
| `ThemeType.DARK` | 深色 |
| `ThemeType.MACARONS` | 柔和马卡龙 |
| `ThemeType.VINTAGE` | 复古 |
| `ThemeType.SHINE` | 高亮 |
| `ThemeType.WALDEN` | 清新 |
| `ThemeType.PURPLE_PASSION` | 紫色 |

### 自定义主题

可以通过 ECharts 主题编辑器生成 JSON 主题文件，然后在 PyECharts 中加载：

```python
with open("my_theme.json", "r", encoding="utf-8") as f:
    theme_config = f.read()

bar = Bar(init_opts=opts.InitOpts(theme="my_theme"))
```

:::tip
自定义主题需要确保主题 JSON 文件可被 ECharts 正确解析，通常需要注册主题名称。
:::

## 数据与格式处理

### 数据格式

PyECharts 通常接受以下数据格式：

- **X 轴数据**：字符串列表，如 `["1月", "2月", "3月"]`。
- **Y 轴数据**：数值列表，如 `[10, 20, 30]`。
- **饼图数据**：元组列表，如 `[("A", 10), ("B", 20)]`。
- **地图数据**：`[("省份", 值), ...]`。

### 从 Pandas 读取数据

```python
import pandas as pd
from pyecharts.charts import Bar

df = pd.read_csv("sales.csv")

bar = (
    Bar()
    .add_xaxis(df["month"].tolist())
    .add_yaxis("销售额", df["sales"].tolist())
    .set_global_opts(title_opts=opts.TitleOpts(title="销售数据"))
)
bar.render("sales_chart.html")
```

### 从 NumPy 读取数据

```python
import numpy as np

x = np.linspace(0, 10, 50)
y = np.sin(x)

line = (
    Line()
    .add_xaxis(x.tolist())
    .add_yaxis("sin(x)", y.tolist())
)
line.render("numpy_line.html")
```

<EChartsDemo :option="numpyLineOption" />

## 渲染与导出

### 渲染为 HTML

```python
chart.render("output.html")
```

可以通过 `render_embed()` 获取嵌入到网页中的 HTML 片段：

```python
html = chart.render_embed()
```

### 在 Jupyter Notebook 中渲染

```python
chart.render_notebook()
```

### 导出为图片

#### 使用 snapshot-selenium

```python
from pyecharts.render import make_snapshot
from snapshot_selenium import snapshot as selenium_snapshot

make_snapshot(selenium_snapshot, chart.render(), "chart.png")
```

#### 使用 snapshot-playwright（推荐）

```python
from pyecharts.render import make_snapshot
from snapshot_playwright import snapshot as playwright_snapshot

make_snapshot(playwright_snapshot, chart.render(), "chart.png")
```

#### 调整导出图片分辨率

```python
make_snapshot(
    playwright_snapshot,
    chart.render(),
    "chart.png",
    pixel_ratio=2,  # 2 倍分辨率，适合论文高清插图
)
```

### 导出为 PDF

PyECharts 本身不直接支持 PDF 导出。可以先生成 PNG，再转换为 PDF：

```python
from PIL import Image

img = Image.open("chart.png")
img.save("chart.pdf", "PDF", resolution=300.0)
```

## 与 Web 框架集成

### Flask

```python
from flask import Flask, render_template_string
from pyecharts.charts import Bar

app = Flask(__name__)

@app.route("/")
def index():
    bar = (
        Bar()
        .add_xaxis(["A", "B", "C"])
        .add_yaxis("系列", [1, 2, 3])
    )
    return render_template_string("{{ chart|safe }}", chart=bar.render_embed())

if __name__ == "__main__":
    app.run()
```

### Django

在视图函数中生成图表并传递到模板：

```python
from django.shortcuts import render
from pyecharts.charts import Bar

def chart_view(request):
    bar = (
        Bar()
        .add_xaxis(["A", "B", "C"])
        .add_yaxis("系列", [1, 2, 3])
    )
    return render(request, "chart.html", {"chart": bar.render_embed()})
```

模板中使用 `{{ chart|safe }}` 渲染。

### Streamlit

```python
import streamlit as st
from pyecharts.charts import Bar
from streamlit_echarts import st_pyecharts

bar = (
    Bar()
    .add_xaxis(["A", "B", "C"])
    .add_yaxis("系列", [1, 2, 3])
)
st_pyecharts(bar)
```

## 论文插图实战案例

### 案例一：实验对比折线图

论文中经常需要对比多种方法在不同指标下的表现：

```python
from pyecharts.charts import Line

epochs = list(range(1, 21))
method_a = [0.65, 0.72, 0.78, 0.82, 0.85, 0.87, 0.89, 0.90, 0.91, 0.92,
            0.92, 0.93, 0.93, 0.94, 0.94, 0.95, 0.95, 0.95, 0.96, 0.96]
method_b = [0.60, 0.68, 0.74, 0.79, 0.82, 0.84, 0.86, 0.87, 0.88, 0.89,
            0.89, 0.90, 0.90, 0.91, 0.91, 0.92, 0.92, 0.92, 0.93, 0.93]
method_c = [0.55, 0.62, 0.68, 0.73, 0.77, 0.80, 0.82, 0.84, 0.85, 0.86,
            0.86, 0.87, 0.87, 0.88, 0.88, 0.89, 0.89, 0.89, 0.90, 0.90]

line = (
    Line(init_opts=opts.InitOpts(width="800px", height="450px"))
    .add_xaxis(epochs)
    .add_yaxis("方法 A", method_a, is_smooth=True, symbol_size=6)
    .add_yaxis("方法 B", method_b, is_smooth=True, symbol_size=6)
    .add_yaxis("方法 C", method_c, is_smooth=True, symbol_size=6)
    .set_global_opts(
        title_opts=opts.TitleOpts(title="不同方法的准确率收敛曲线"),
        xaxis_opts=opts.AxisOpts(name="训练轮次", type_="value"),
        yaxis_opts=opts.AxisOpts(name="准确率", min_=0.5, max_=1.0),
        legend_opts=opts.LegendOpts(pos_top="8%"),
        toolbox_opts=opts.ToolboxOpts(
            feature=opts.ToolBoxFeatureOpts(
                save_as_image=opts.ToolBoxFeatureSaveAsImageOpts(pixel_ratio=2)
            )
        ),
    )
)
line.render("accuracy_comparison.html")
```

<EChartsDemo :option="accuracyLineOption" />

### 案例二：消融实验柱状图

```python
from pyecharts.charts import Bar

categories = ["基线", "+ 模块 A", "+ 模块 B", "+ 模块 A+B"]
accuracy = [0.82, 0.86, 0.88, 0.91]

bar = (
    Bar(init_opts=opts.InitOpts(width="700px", height="420px"))
    .add_xaxis(categories)
    .add_yaxis("准确率", [round(a * 100, 2) for a in accuracy])
    .set_global_opts(
        title_opts=opts.TitleOpts(title="消融实验结果"),
        yaxis_opts=opts.AxisOpts(name="准确率（%）", min_=75, max_=95),
        xaxis_opts=opts.AxisOpts(name="模型配置"),
    )
    .set_series_opts(
        label_opts=opts.LabelOpts(is_show=True, position="top", formatter="{c}%")
    )
)
bar.render("ablation_study.html")
```

<EChartsDemo :option="ablationBarOption" />

### 案例三：双 Y 轴组合图

当两组数据的量级差异较大时，可以使用双 Y 轴：

```python
from pyecharts.charts import Bar, Line
from pyecharts.charts import Grid

months = ["1月", "2月", "3月", "4月", "5月", "6月"]
sales = [120, 200, 150, 80, 70, 110]
growth_rate = [10, 66, -25, -47, -12, 57]

bar = (
    Bar()
    .add_xaxis(months)
    .add_yaxis("销售额", sales, yaxis_index=0)
)

line = (
    Line()
    .add_xaxis(months)
    .add_yaxis("增长率", growth_rate, yaxis_index=1)
)

bar.extend_axis(
    yaxis=opts.AxisOpts(
        name="增长率（%）",
        type_="value",
        position="right",
    )
)

bar.overlap(line)
bar.set_global_opts(
    title_opts=opts.TitleOpts(title="销售额与增长率"),
    yaxis_opts=opts.AxisOpts(name="销售额（万元）"),
    legend_opts=opts.LegendOpts(pos_top="8%"),
)
bar.render("dual_axis_chart.html")
```

<EChartsDemo :option="dualAxisOption" />

## 渲染实现说明

本文所有代码示例下方均通过自定义 `<EChartsDemo>` 组件，使用 ECharts 在前端直接渲染出与 PyECharts 配置等价的图表。这些图表仅在浏览器中运行，不需要 Python 后端。

<script setup>
import { ref, onMounted } from 'vue'

// 第一个可运行示例
const firstBarOption = {
  title: { text: '2024 年季度销售统计', subtext: '单位：件', left: 'center' },
  tooltip: { trigger: 'axis' },
  toolbox: { show: true },
  legend: { top: 45 },
  grid: { top: 80 },
  xAxis: { type: 'category', data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'] },
  yAxis: { type: 'value' },
  series: [
    { name: '商家A', type: 'bar', data: [5, 20, 36, 10, 75, 90] },
    { name: '商家B', type: 'bar', data: [15, 6, 45, 20, 35, 66] },
  ],
}

// 分组柱状图
const barOption = {
  title: { text: '季度销量对比', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { top: 45 },
  grid: { top: 80 },
  xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'], name: '季度' },
  yAxis: { type: 'value', name: '销量（件）' },
  series: [
    { name: '产品A', type: 'bar', data: [120, 132, 101, 134] },
    { name: '产品B', type: 'bar', data: [220, 182, 191, 234] },
    { name: '产品C', type: 'bar', data: [150, 232, 201, 154] },
  ],
}

// 堆叠柱状图
const stackedBarOption = {
  title: { text: '流量来源堆叠图', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { top: 45 },
  grid: { top: 80 },
  xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'], name: '季度' },
  yAxis: { type: 'value', name: '访问量' },
  series: [
    { name: '直接访问', type: 'bar', stack: '总量', data: [320, 302, 301, 334] },
    { name: '邮件营销', type: 'bar', stack: '总量', data: [120, 132, 101, 134] },
    { name: '联盟广告', type: 'bar', stack: '总量', data: [220, 182, 191, 234] },
  ],
}

// 水平柱状图
const horizontalBarOption = {
  title: { text: '编程语言流行度', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { top: 45 },
  grid: { top: 80 },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: ['Python', 'Java', 'C++', 'Go', 'Rust'] },
  series: [
    { name: '2023', type: 'bar', data: [90, 80, 70, 60, 50], label: { show: true, position: 'right' } },
  ],
}

// 基础折线图
const lineOption = {
  title: { text: '月度业绩趋势', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { top: 45 },
  grid: { top: 80 },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], name: '月份', boundaryGap: false },
  yAxis: { type: 'value', name: '金额（万元）' },
  series: [
    { name: '销售额', type: 'line', data: [120, 200, 150, 80, 70, 110], smooth: true },
    { name: '利润', type: 'line', data: [30, 50, 40, 20, 15, 35], smooth: true },
  ],
}

// 平滑曲线与面积图
const smoothAreaLineOption = {
  title: { text: '平滑面积图', left: 'center' },
  tooltip: { trigger: 'axis' },
  grid: { top: 50 },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: { type: 'value' },
  series: [
    {
      name: '销售额',
      type: 'line',
      data: [120, 200, 150, 80, 70, 110],
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      areaStyle: { opacity: 0.3 },
    },
  ],
}

// 阶梯图
const stepLineOption = {
  title: { text: '月度平均气温', left: 'center' },
  tooltip: { trigger: 'axis' },
  grid: { top: 50 },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: { type: 'value' },
  series: [
    { name: '温度', type: 'line', data: [5, 8, 12, 18, 24, 28], step: true },
  ],
}

// 基础饼图
const pieOption = {
  title: { text: '访问来源分布', left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [
    {
      type: 'pie',
      radius: '60%',
      center: ['50%', '55%'],
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' },
      ],
    },
  ],
}

// 环形图
const donutPieOption = {
  title: { text: '环形图', left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
  series: [
    {
      type: 'pie',
      radius: ['40%', '75%'],
      center: ['50%', '55%'],
      data: [
        { value: 30, name: 'A' },
        { value: 25, name: 'B' },
        { value: 20, name: 'C' },
        { value: 15, name: 'D' },
        { value: 10, name: 'E' },
      ],
      label: { formatter: '{b}: {d}%' },
    },
  ],
}

// 南丁格尔玫瑰图
const rosePieOption = {
  title: { text: '玫瑰图', left: 'center' },
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'pie',
      roseType: 'radius',
      radius: ['30%', '75%'],
      center: ['50%', '55%'],
      data: [
        { value: 10, name: 'A' },
        { value: 20, name: 'B' },
        { value: 30, name: 'C' },
        { value: 40, name: 'D' },
        { value: 50, name: 'E' },
      ],
    },
  ],
}

// 散点图（使用固定随机数据模拟 Python random）
const scatterData = Array.from({ length: 50 }, () => {
  const x = Math.floor(Math.random() * 100)
  const y = Math.floor(Math.random() * 100)
  const s = Math.floor(Math.random() * 40 + 10)
  return [x, y, s]
})

const scatterOption = {
  title: { text: '气泡散点图', left: 'center' },
  tooltip: { trigger: 'item' },
  grid: { top: 50 },
  xAxis: { type: 'value', name: 'X 变量' },
  yAxis: { type: 'value', name: 'Y 变量' },
  visualMap: {
    min: 10,
    max: 50,
    dimension: 2,
    inRange: { color: ['#50a3ba', '#eac736', '#d94e5d'] },
  },
  series: [
    {
      name: '样本',
      type: 'scatter',
      data: scatterData,
      symbolSize: (data) => data[2] / 2,
    },
  ],
}

// 雷达图
const radarOption = {
  title: { text: '能力雷达图', left: 'center' },
  tooltip: {},
  legend: { top: 45 },
  grid: { top: 80 },
  radar: {
    center: ['50%', '55%'],
    indicator: [
      { name: '进攻', max: 100 },
      { name: '防守', max: 100 },
      { name: '速度', max: 100 },
      { name: '技巧', max: 100 },
      { name: '体能', max: 100 },
    ],
  },
  series: [
    {
      type: 'radar',
      data: [
        { value: [85, 70, 90, 80, 75], name: '球员A' },
        { value: [70, 90, 75, 85, 80], name: '球员B' },
      ],
    },
  ],
}

// 热力图
const heatmapOption = {
  title: { text: '用户活跃热力图', left: 'center' },
  tooltip: {},
  grid: { top: 50 },
  visualMap: { min: 0, max: 10 },
  xAxis: { type: 'category', data: ['12a', '1a', '2a', '3a', '4a', '5a', '6a'] },
  yAxis: { type: 'category', data: ['周六', '周五', '周四', '周三', '周二', '周一', '周日'] },
  series: [
    {
      name: '活跃度',
      type: 'heatmap',
      data: [
        [0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0],
        [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0],
        [2, 0, 3], [2, 1, 1], [2, 2, 0], [2, 3, 0],
      ],
      label: { show: true },
    },
  ],
}

// 地图（需要异步注册中国地图数据）
const mapReady = ref(false)
const mapOption = {
  title: { text: '2022 年各省 GDP（亿元）', left: 'center' },
  tooltip: { trigger: 'item' },
  visualMap: { min: 50000, max: 130000 },
  series: [
    {
      name: 'GDP',
      type: 'map',
      map: 'china',
      data: [
        { name: '广东', value: 124369 },
        { name: '江苏', value: 116364 },
        { name: '山东', value: 83095 },
        { name: '浙江', value: 73516 },
      ],
    },
  ],
}

onMounted(async () => {
  const echarts = await import('echarts')
  try {
    const res = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    const json = await res.json()
    echarts.registerMap('china', json)
    mapReady.value = true
  } catch (e) {
    console.error('加载中国地图数据失败', e)
  }
})

// 直角坐标系 Grid（左右双图）
const gridOption = {
  tooltip: { trigger: 'axis' },
  grid: [
    { left: '5%', right: '55%', top: 50 },
    { left: '60%', right: '5%', top: 50 },
  ],
  xAxis: [
    { gridIndex: 0, type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    { gridIndex: 1, type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  ],
  yAxis: [
    { gridIndex: 0, type: 'value' },
    { gridIndex: 1, type: 'value' },
  ],
  series: [
    { name: '销售额', type: 'bar', xAxisIndex: 0, yAxisIndex: 0, data: [120, 200, 150, 80, 70, 110] },
    { name: '增长率', type: 'line', xAxisIndex: 1, yAxisIndex: 1, data: [10, 20, 15, -5, -8, 12] },
  ],
}

// 从 NumPy 读取数据（模拟 np.linspace + np.sin）
const numpyX = Array.from({ length: 50 }, (_, i) => (10 * i) / 49)
const numpyY = numpyX.map((x) => Math.sin(x))
const numpyLineOption = {
  tooltip: { trigger: 'axis' },
  grid: { top: 50 },
  xAxis: { type: 'category', data: numpyX.map((v) => v.toFixed(2)) },
  yAxis: { type: 'value' },
  series: [{ name: 'sin(x)', type: 'line', data: numpyY, showSymbol: false }],
}

// 案例一：实验对比折线图
const epochsArr = Array.from({ length: 20 }, (_, i) => i + 1)
const methodAArr = [0.65, 0.72, 0.78, 0.82, 0.85, 0.87, 0.89, 0.90, 0.91, 0.92, 0.92, 0.93, 0.93, 0.94, 0.94, 0.95, 0.95, 0.95, 0.96, 0.96]
const methodBArr = [0.60, 0.68, 0.74, 0.79, 0.82, 0.84, 0.86, 0.87, 0.88, 0.89, 0.89, 0.90, 0.90, 0.91, 0.91, 0.92, 0.92, 0.92, 0.93, 0.93]
const methodCArr = [0.55, 0.62, 0.68, 0.73, 0.77, 0.80, 0.82, 0.84, 0.85, 0.86, 0.86, 0.87, 0.87, 0.88, 0.88, 0.89, 0.89, 0.89, 0.90, 0.90]
const accuracyLineOption = {
  title: { text: '不同方法的准确率收敛曲线', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { top: 45 },
  grid: { top: 80 },
  toolbox: { feature: { saveAsImage: { pixelRatio: 2 } } },
  xAxis: { type: 'value', name: '训练轮次' },
  yAxis: { type: 'value', name: '准确率', min: 0.5, max: 1.0 },
  series: [
    { name: '方法 A', type: 'line', smooth: true, symbolSize: 6, data: epochsArr.map((x, i) => [x, methodAArr[i]]) },
    { name: '方法 B', type: 'line', smooth: true, symbolSize: 6, data: epochsArr.map((x, i) => [x, methodBArr[i]]) },
    { name: '方法 C', type: 'line', smooth: true, symbolSize: 6, data: epochsArr.map((x, i) => [x, methodCArr[i]]) },
  ],
}

// 案例二：消融实验柱状图
const ablationBarOption = {
  title: { text: '消融实验结果', left: 'center' },
  tooltip: { trigger: 'axis' },
  grid: { top: 50 },
  xAxis: { type: 'category', data: ['基线', '+ 模块 A', '+ 模块 B', '+ 模块 A+B'], name: '模型配置' },
  yAxis: { type: 'value', name: '准确率（%）', min: 75, max: 95 },
  series: [
    {
      name: '准确率',
      type: 'bar',
      data: [82, 86, 88, 91],
      label: { show: true, position: 'top', formatter: '{c}%' },
    },
  ],
}

// 案例三：双 Y 轴组合图
const dualAxisOption = {
  title: { text: '销售额与增长率', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { top: 45 },
  grid: { top: 80 },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: [
    { type: 'value', name: '销售额（万元）' },
    { type: 'value', name: '增长率（%）', position: 'right' },
  ],
  series: [
    { name: '销售额', type: 'bar', data: [120, 200, 150, 80, 70, 110], yAxisIndex: 0 },
    { name: '增长率', type: 'line', data: [10, 66, -25, -47, -12, 57], yAxisIndex: 1 },
  ],
}
</script>

:::tip
本文所有代码示例下方的图表均由自定义 `<EChartsDemo>` 组件通过 ECharts 在前端实时渲染。你可以悬停查看数据、点击图例隐藏系列，体验与 PyECharts 生成的 HTML 文件一致的交互效果。
:::

## 常见问题与排查

### 图表渲染后空白

- 检查是否正确调用了 `.render()`。
- 检查浏览器是否支持 ECharts 所需的 JavaScript。
- 对于地图，确认已安装对应的地图扩展包。

### 中文乱码

PyECharts 默认使用 UTF-8 编码。如果 HTML 中中文显示乱码，确保文件以 UTF-8 保存并在浏览器中正确解析。

### 导出图片失败

- `snapshot-selenium` 需要安装对应浏览器的 WebDriver。
- `snapshot-playwright` 需要执行 `playwright install` 下载浏览器。
- 确保系统可以无头运行浏览器。

### 地图不显示

- 确认安装了正确的地图扩展包。
- 确认地区名称与地图资源包中的名称一致。

## 本章小结

PyECharts 是一个功能强大的 Python 可视化库，能够满足从简单图表到复杂交互可视化的多种需求。对于论文写作场景，重点掌握以下内容：

- 基础图表（折线图、柱状图、饼图、散点图）的绘制。
- 全局配置和系列配置，用于调整标题、坐标轴、图例、标签等样式。
- 使用 `snapshot` 插件导出高分辨率静态图片。
- 使用 `Grid`、`Page`、`Timeline` 实现多图组合和时间轴展示。
- 结合 Pandas/NumPy 处理实验数据。
