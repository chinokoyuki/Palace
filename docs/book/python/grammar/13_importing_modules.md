---
title: Python 引入模块
description: import 多种方式、from...import、别名与常用标准库模块
order: 13
---

# Python 引入模块

模块（Module）就是一个以 `.py` 结尾的 Python 文件，里面可以定义函数、类和变量。Python 拥有庞大的"标准库"，把常用功能（数学、时间、随机等）都打包好了，**引入模块**就能直接使用，不必重复造轮子。

## 基本引入

最基础的写法是用 `import 模块名`，之后通过 `模块名.函数名()` 调用：

```python
import statistics
print(statistics.median([69, 124, -39, 0, 55]))
```

运行结果：

```text
34.5
```

这里 `statistics` 是标准库模块，`median` 是它的函数。引入后必须写成 `statistics.median(...)`。

## from ... import

如果只想用模块里的某个函数，可以把它单独引入，这样调用时就**不用再写模块名前缀**：

```python
from statistics import median
print(median([69, 124, -39, 0, 55]))
```

也可以一次引入多个：

```python
from math import sqrt, pi
print(sqrt(16))     # 4.0
print(pi)           # 3.141592653589793
```

## from ... import *

用星号 `*` 把模块里**所有**公开内容都引入到当前命名空间，调用时一律不用加前缀：

```python
from math import *
print(sqrt(9))      # 3.0
print(ceil(2.1))    # 3
```

:::warning 不推荐
这种方式不推荐在大型项目中使用，因为会一次性引入大量名字，容易造成命名冲突、难以排查来源。
:::

## 给模块起别名 as

模块名太长时，可以用 `as` 起个别名，通常 `import numpy as np` 就是这种惯例：

```python
import statistics as st
print(st.median([1, 2, 3]))    # 2
```

`from ... import ... as ...` 也可以给引入的对象起别名：

```python
from math import pi as 圆周率
print(圆周率)     # 3.141592653589793
```

## 常见标准库模块

| 模块 | 用途 |
| --- | --- |
| `math` | 数学运算（sqrt、floor、pi 等） |
| `statistics` | 统计（mean、median、variance 等） |
| `random` | 随机数（random、randint、choice） |
| `datetime` | 日期与时间 |
| `os` / `sys` | 操作系统与解释器交互 |
| `json` | JSON 数据的解析与生成 |
| `time` | 时间相关（sleep、时间戳） |

```python
import random
print(random.randint(1, 10))     # 1~10 的随机整数

import time
print("Start")
time.sleep(1)                    # 暂停 1 秒
print("Stop")
```

## 完整示例

```python
import statistics as st
from math import sqrt

data = [69, 124, -39, 0, 55]

print("中位数：", st.median(data))
print("最大值的平方根：", sqrt(max(data)))
```

运行结果：

```text
中位数： 34.5
最大值的平方根： 11.135528725660043
```
