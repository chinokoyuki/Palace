---
title: C++ 基础语法
description: C++ 程序的基本结构、语句、标识符与关键字
order: 2
---

# C++ 程序结构

C++ 程序由若干源文件组成，每个源文件又是一系列声明、定义和语句的集合。无论程序多么复杂，执行时总是从 `main` 函数开始。理解程序的基本结构，是写出正确 C++ 代码的第一步。

## 第一个程序回顾

我们先看一段最简短的完整程序：

```cpp
#include <iostream>
using namespace std;

int main()
{
    cout << "Hello Koyuki!" << endl;
    return 0;
}
```

从上到下，这段程序可以拆成四个部分：

1. **头文件包含**：`#include <iostream>`
   - 以 `#` 开头的是预处理指令。
   - `iostream` 是标准输入输出库，提供了 `cout`、`cin`、`endl` 等工具。
   - 没有它，程序就不知道 `cout` 是什么。

2. **命名空间**：`using namespace std;`
   - 标准库中的内容都放在 `std` 命名空间里。
   - 使用这行代码后，可以直接写 `cout`，否则需要写 `std::cout`。
   - 在小型示例中这样写比较方便，大型项目里通常会显式加 `std::` 前缀。

3. **主函数**：`int main()`
   - 这是程序的入口，操作系统从这里开始执行。
   - `int` 表示函数返回一个整数。
   - 大括号 `{}` 里的内容是函数体。

4. **返回语句**：`return 0;`
   - 向操作系统返回 0，通常表示程序正常结束。
   - 返回非 0 值一般表示程序遇到了错误。

## 预处理指令

预处理在编译之前执行，负责把头文件内容、宏定义等插入到源文件中。常见的预处理指令有：

- `#include`：包含头文件
- `#define`：定义宏
- `#ifdef` / `#ifndef` / `#endif`：条件编译

例如：

```cpp
#include <iostream>
#include <string>
```

尖括号 `< >` 用于标准库头文件，双引号 `" "` 用于自己写的头文件：

```cpp
#include "myheader.h"
```

## 命名空间

命名空间用来避免名字冲突。比如两个库都定义了 `cout`，可以用命名空间区分：

```cpp
#include <iostream>

int main()
{
    std::cout << "使用 std:: 前缀输出" << std::endl;
    return 0;
}
```

也可以只引入某一个名字：

```cpp
#include <iostream>
using std::cout;
using std::endl;

int main()
{
    cout << "只引入了 cout 和 endl" << endl;
    return 0;
}
```

## 函数

函数是一段可以重复使用的代码块。`main` 是最特殊的函数，但我们也可以自己定义函数：

```cpp
#include <iostream>
using namespace std;

// 函数声明：返回值类型 + 函数名 + 参数列表
int add(int a, int b)
{
    return a + b;
}

int main()
{
    int result = add(3, 5);
    cout << "3 + 5 = " << result << endl;
    return 0;
}
```

- `int add(int a, int b)` 中，`int` 是返回值类型，`a` 和 `b` 是参数。
- 函数必须先声明或定义，然后才能调用。

## 语句与分号

C++ 程序由语句组成，每个语句以分号 `;` 结束。分号告诉编译器一条语句在哪里结束。

```cpp
int age = 18;        // 声明语句
age = age + 1;       // 赋值语句
cout << age;         // 表达式语句
```

注意：预处理指令、函数定义的大括号、控制语句的头部不以分号结尾。

```cpp
if (age > 18)        // if 头部没有分号
{
    cout << "成年了";
}
```

## 代码块

用 `{}` 包围起来的代码称为代码块，也叫复合语句。函数体、条件分支、循环体都使用代码块：

```cpp
{
    int x = 10;
    cout << x << endl;
}
// x 在这里已经不可见
```

代码块内部定义的变量只在块内有效，这称为变量的作用域。

## 空白与缩进

C++ 会忽略大部分空白字符，包括空格、制表符和换行。因此下面两种写法对编译器来说是等价的：

```cpp
int a=10;
```

```cpp
int a = 10;
```

但为了可读性，我们通常会：

- 在运算符两侧加空格
- 使用 4 个空格或 1 个 Tab 缩进
- 大括号独占一行或与语句同行

良好的格式能让代码更容易维护。

## 标识符

标识符是用来给变量、函数、类等命名的符号。命名规则如下：

- 只能由字母、数字和下划线 `_` 组成。
- 不能以数字开头。
- 区分大小写，`name` 和 `Name` 是两个不同的标识符。
- 不能使用 C++ 关键字。

有效的标识符：

```cpp
int studentAge;
int _score;
float pi2;
```

无效的标识符：

```cpp
int 2pi;        // 错误：以数字开头
int student age; // 错误：包含空格
int return;     // 错误：使用了关键字
```

命名建议：

- 见名知意，如 `studentAge` 比 `a` 更好。
- 变量名通常用小驼峰，如 `userName`。
- 常量通常全大写，如 `MAX_SIZE`。

## C++ 关键字

关键字是 C++ 保留的特殊单词，不能用作标识符。常见关键字包括：

| 类别 | 关键字 |
| --- | --- |
| 数据类型 | `int`、`float`、`double`、`char`、`bool`、`void` |
| 控制语句 | `if`、`else`、`switch`、`case`、`for`、`while`、`do`、`break`、`continue`、`return` |
| 类与对象 | `class`、`struct`、`public`、`private`、`protected` |
| 其他 | `const`、`static`、`namespace`、`using`、`template`、`virtual` |

不需要一次性记住所有关键字，随着学习深入会自然熟悉。

## 完整示例

下面是一个综合运用基础语法的小程序：

```cpp
#include <iostream>
using namespace std;

// 计算两个数的和
int add(int a, int b)
{
    return a + b;
}

int main()
{
    int num1 = 12;
    int num2 = 30;

    int sum = add(num1, num2);

    cout << "第一个数：" << num1 << endl;
    cout << "第二个数：" << num2 << endl;
    cout << "两数之和：" << sum << endl;

    return 0;
}
```

运行结果：

```text
第一个数：12
第二个数：30
两数之和：42
```
