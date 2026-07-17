---
title: Python 报错处理
description: try/except/else/finally、捕获特定异常与自定义异常
order: 16
---

# Python 报错处理

程序运行时难免出错（比如用 0 做除数、把字符串转成数字失败）。如果不加处理，错误会直接终止程序。用 **try...except** 可以"捕获"异常，让程序更健壮。

## 基本结构

```python
try:
    # 可能出错的代码
    result = 10 / 0
except ZeroDivisionError:
    # 出错后执行的补救代码
    print("error")
```

`try` 块里的代码正常时直接走完；一旦抛出指定类型的异常，就跳到对应的 `except` 块处理，程序不会崩溃。

## 捕获多种异常

可以为不同类型的错误分别写 `except`：

```python
try:
    int("abc")          # 可能 ValueError
    result = 10 / 0     # 可能 ZeroDivisionError
except ValueError:
    print("error: 无法转换成数字")
except ZeroDivisionError:
    print("error: 除数不能为 0")
```

也可以用元组一次捕获多种：

```python
except (ValueError, ZeroDivisionError):
    print("error")
```

## 捕获所有异常

不带类型的 `except:` 会捕获**所有**异常，应谨慎使用，以免掩盖真正的 bug：

```python
try:
    # ...
except:
    print("error")
```

## else 与 finally

- `else`：**没有发生异常**时才执行。
- `finally`：**无论是否发生异常**都会执行，常用来释放资源（如关闭文件）。

```python
try:
    print("尝试计算")
    x = 10 / 2
except ZeroDivisionError:
    print("error")
else:
    print("没有出错，结果是", x)    # 会执行
finally:
    print("无论如何都会执行")        # 会执行
```

运行结果：

```text
尝试计算
没有出错，结果是 5.0
无论如何都会执行
```

## 获取异常信息

用 `as` 把异常对象接出来，可以看到更详细的错误信息：

```python
try:
    int("abc")
except ValueError as e:
    print("出错啦：", e)
```

运行结果：

```text
出错啦： invalid literal for int() with base 10: 'abc'
```

## 主动抛出异常

用 `raise` 主动抛出错误，常用于参数校验：

```python
def divide(a, b):
    if b == 0:
        raise ValueError("除数不能为 0")
    return a / b
```

## 完整示例

```python
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("错误：除数不能为 0")
        return None
    else:
        print("计算成功")
        return result
    finally:
        print("计算结束")

print(safe_divide(10, 2))
print(safe_divide(10, 0))
```

运行结果：

```text
计算成功
计算结束
5.0
错误：除数不能为 0
计算结束
None
```
