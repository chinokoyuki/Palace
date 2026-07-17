---
title: Python 测试
description: assert 断言、unittest 单元测试与命令行运行
order: 17
---

# Python 测试

写好的代码需要验证它"确实按预期工作"。测试能在你修改代码后迅速发现回归问题。Python 内置了 `unittest` 框架，也提供了简单直接的 `assert` 断言。

## assert 断言

`assert` 后面跟一个布尔表达式。**为真时什么都不发生，为假时抛出 `AssertionError`**，常用于调试和检查前提条件：

```python
assert 1 + 2 == 3          # 正确，安静通过
assert 1 + 2 > 6           # 错误，抛出 AssertionError
```

也可以附加错误信息：

```python
assert 1 + 2 == 4, "加法算错了！"
```

## unittest 单元测试

`unittest` 是 Python 标准库的测试框架，适合组织大量测试用例。

### 实现代码：my_adder.py

```python
# my_adder.py
def my_adder(x, y):
    return x + y
```

### 测试代码：test_my_adder.py

测试类要**继承 `unittest.TestCase`**（注意是 `unittest.TestCase`，不是逗号分隔的两个参数），以 `test` 开头的方法会被自动识别为测试用例：

```python
# test_my_adder.py
import unittest
from my_adder import my_adder


class TestMyAdder(unittest.TestCase):
    def test_1(self):
        self.assertEqual(my_adder(2, 3), 5)

    def test_2(self):
        self.assertEqual(my_adder(5, 3), 8)

    def test_negative(self):
        self.assertEqual(my_adder(-1, 1), 0)
```


### 常用断言方法

| 方法 | 含义 |
| --- | --- |
| `assertEqual(a, b)` | `a == b` |
| `assertNotEqual(a, b)` | `a != b` |
| `assertTrue(x)` | `x` 为真 |
| `assertFalse(x)` | `x` 为假 |
| `assertRaises(Error)` | 期望抛出指定异常 |
| `assertIn(a, b)` | `a` 在 `b` 中 |

## 运行测试

在终端运行：

```bash
python -m unittest
```

它会**自动发现并运行当前目录下所有以 `test` 开头的测试**。每个用例通过显示 `.`，失败显示 `F`。例如：

```text
...
----------------------------------------------------------------------
Ran 3 tests in 0.001s

OK
```

如果某个用例失败，会打印 `F` 并给出详细追踪，帮助你定位问题。

## 完整示例

把上面 `my_adder.py` 和 `test_my_adder.py` 放在同一目录，运行：

```bash
python -m unittest test_my_adder.py
```

输出（通过时）：

```text
...
----------------------------------------------------------------------
Ran 3 tests in 0.000s

OK
```
