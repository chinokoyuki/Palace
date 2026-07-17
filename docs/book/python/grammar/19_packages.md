---
title: Python 包
description: 包的结构、__init__.py 与多层包的组织方式
order: 19
---

# Python 包

当模块越来越多，就需要用**包（Package）**来把它们分门别类地组织起来。包本质上是一个**包含多个模块的文件夹**，并且必须有一个 `__init__.py` 文件（哪怕它是空的），Python 才会把它当作包来识别。

## 包的结构

```text
my_package/
├── __init__.py
├── module1.py
└── module2.py
```

- `my_package/` 是包的根目录。
- `__init__.py` 在包被导入时自动执行，常用于初始化或声明对外接口。
- `module1.py`、`module2.py` 是包里的模块。

## __init__.py 与 __all__

和模块里的 `__all__` 类似，包的 `__init__.py` 里也可以定义 `__all__`，用来控制 `from 包 import *` 时暴露哪些模块：

```python
# my_package/__init__.py
__all__ = ['module1']     # import * 时只引入 module1
```

## 使用包里的模块

```python
# 引入整个模块
from my_package import module1
module1.some_function()

# 直接从包里引入具体函数
from my_package.module2 import another_function
another_function()
```

## 多层包

包里还能再套包，形成层级结构：

```text
my_project/
├── __init__.py
├── utils/
│   ├── __init__.py
│   └── math_tools.py
└── core/
    ├── __init__.py
    └── engine.py
```

引入深层模块：

```python
from my_project.utils.math_tools import add
from my_project.core.engine import run
```

## 为什么用包

- **避免命名冲突**：不同包里可以有同名模块。
- **结构清晰**：按功能划分子目录，项目更易维护。
- **按需加载**：可以只引入需要的子模块，减小开销。

## 与"模块"章节的关系

- **模块** = 单个 `.py` 文件。
- **包** = 装有多个模块的文件夹（带 `__init__.py`）。

二者都通过 `import` 使用，区别只在组织层级。理解它们，你就掌握了 Python 代码复用与工程化组织的基础。

## 小结

| 概念 | 形态 | 关键文件 |
| --- | --- | --- |
| 模块 | 单个 `.py` 文件 | （无需特殊文件） |
| 包 | 文件夹 | `__init__.py` |

至此，你已经从 Python 基础语法一路学到了模块与包，具备了编写结构化 Python 程序的能力。继续练习，把这些知识用起来吧！
