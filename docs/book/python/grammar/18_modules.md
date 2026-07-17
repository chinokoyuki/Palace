---
title: Python 模块
description: 模块的创建、import 多种方式、__all__ 与别名
order: 18
---

# Python 模块

**模块（Module）** 就是一个以 `.py` 结尾的文件，里面可以定义函数、类和变量。把代码拆分到不同模块，既便于复用，也让项目结构更清晰。

引入模块的几种写法回顾：

- `import module`
- `from module import variable`
- `from module import *`
- `import module as name`
- `from module import function as name`

## 一个简单模块

**my_module.py**

```python
__all__ = ['test1']     # 控制 import * 时暴露哪些名字

def test1(a, b):
    print(a + b)

def test2(a, b):
    print(a + b)
```

`__all__` 是一个列表，规定当别的文件用 `from my_module import *` 时，**只引入列表里的名字**（这里只有 `test1`）。没列出来的 `test2` 不会被 `*` 引入，但仍可用 `from my_module import test2` 显式引入。

## 使用模块

**main.py**

```python
import my_module

my_module.test1(10, 20)    # 30
```

其他引入方式：

```python
from my_module import test1          # 直接用 test1(10, 20)
from my_module import test1 as t1    # 用别名 t1(10, 20)
import my_module as mm               # 用别名 mm.test1(10, 20)
```

## 模块即命名空间

每个模块都有自己的命名空间，所以不同模块里可以有同名函数而互不干扰：

```python
import module_a
import module_b

module_a.do()    # 调用 module_a 的 do
module_b.do()    # 调用 module_b 的 do
```

## 标准库中的模块

前面"引入模块"章节提到的 `statistics`、`math`、`random` 等，本质上都是别人写好的 `.py` 模块，被收纳进 Python 标准库：

```python
import time
print("Start")
time.sleep(1)
print("Stop")
```

## 完整示例

**my_module.py**

```python
__all__ = ['add']

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b
```

**main.py**

```python
from my_module import *

print(add(3, 4))          # 7   （在 __all__ 中，可用）
# print(subtract(3, 4))   # NameError：subtract 不在 __all__ 里
```

:::warning 再次提醒
`from module import *` 会一次性把名字倒进当前空间，大项目里尽量用显式引入。
:::
