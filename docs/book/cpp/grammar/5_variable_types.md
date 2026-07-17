---
title: C++ 变量类型
description: C++ 中变量的分类、声明、初始化与使用
order: 5
---

# C++ 变量类型

变量是程序中用于存储数据的命名空间。每个变量都有名字、类型和值。理解不同类型的变量，有助于我们合理地组织代码，避免作用域混乱和生命周期错误。

## 什么是变量

可以把变量想象成一个带标签的盒子：

- **变量名**就是盒子上的标签。
- **数据类型**决定了盒子能装什么。
- **值**就是盒子里的内容。

```cpp
int age = 18;
```

上面这行代码声明了一个名为 `age` 的整数变量，并把 18 存进去。

## 声明、定义与初始化

### 声明

告诉编译器变量的类型和名字。

```cpp
extern int count;
```

### 定义

在内存中为变量分配空间。

```cpp
int count;
```

### 初始化

在定义变量的同时赋予一个初始值。

```cpp
int count = 0;
```

未初始化的局部变量值是不确定的，直接使用可能产生奇怪的结果。推荐在定义时立即初始化。

## 局部变量

在函数或代码块内部定义的变量称为局部变量。它只在定义它的代码块内有效，离开代码块后就会被销毁。

```cpp
#include <iostream>
using namespace std;

void printNumber()
{
    int localNumber = 100;  // 局部变量
    cout << "局部变量：" << localNumber << endl;
}

int main()
{
    printNumber();
    // cout << localNumber;  // 错误：局部变量在这里不可见
    return 0;
}
```

局部变量的优点是不会与其他函数的变量冲突，因为它们互相隔离。

## 全局变量

在所有函数之外定义的变量称为全局变量。它从程序开始运行就存在，直到程序结束才销毁。全局变量可以被程序中的任何函数访问。

```cpp
#include <iostream>
using namespace std;

int globalNumber = 50;  // 全局变量

void showGlobal()
{
    cout << "全局变量：" << globalNumber << endl;
}

int main()
{
    cout << "在 main 中访问：" << globalNumber << endl;
    showGlobal();
    return 0;
}
```

全局变量虽然方便，但过度使用会让程序难以维护。因为任何函数都可能修改它，排查错误会变得困难。

## 形式参数

函数定义时列出的变量称为形式参数，简称形参。它们是函数的局部变量，只在函数执行期间有效。

```cpp
#include <iostream>
using namespace std;

int multiply(int a, int b)  // a 和 b 是形参
{
    return a * b;
}

int main()
{
    int result = multiply(4, 7);
    cout << "4 * 7 = " << result << endl;
    return 0;
}
```

调用函数时传入的具体值称为实际参数，简称实参。上面的 `4` 和 `7` 就是实参。

## 静态变量

用 `static` 关键字修饰的变量称为静态变量。静态局部变量只初始化一次，即使函数执行结束，它的值也会被保留。

```cpp
#include <iostream>
using namespace std;

void countCalls()
{
    static int count = 0;  // 静态局部变量
    count++;
    cout << "第 " << count << " 次调用" << endl;
}

int main()
{
    countCalls();  // 第 1 次调用
    countCalls();  // 第 2 次调用
    countCalls();  // 第 3 次调用
    return 0;
}
```

运行结果：

```text
第 1 次调用
第 2 次调用
第 3 次调用
```

如果没有 `static`，每次调用函数时 `count` 都会被重新初始化为 0。

## 外部变量

在一个源文件中定义的全局变量，可以在另一个源文件中使用 `extern` 声明后访问。

文件 `a.cpp`：

```cpp
int sharedValue = 100;
```

文件 `b.cpp`：

```cpp
#include <iostream>
using namespace std;

extern int sharedValue;  // 声明外部变量

int main()
{
    cout << sharedValue << endl;
    return 0;
}
```

`extern` 只声明变量，不分配新的内存空间。它告诉编译器：“这个变量在别的地方已经定义了。”

## 变量的命名规范

给变量起一个好名字，是写出清晰代码的重要一步。

- 使用有意义的英文单词，如 `studentCount` 而不是 `n`。
- 变量名通常用小驼峰命名法，如 `userName`。
- 避免使用单个字母，除非在循环等非常短的作用域内。
- 不要使用 C++ 关键字作为变量名。

```cpp
int studentCount = 30;        // 好
float averageScore = 85.5;    // 好
int n = 30;                   // 含义不明确
int return = 0;               // 错误：使用了关键字
```

## 变量类型总结

| 类型 | 定义位置 | 作用范围 | 生命周期 |
| --- | --- | --- | --- |
| 局部变量 | 函数或代码块内 | 定义它的代码块 | 进入代码块时创建，离开时销毁 |
| 全局变量 | 所有函数之外 | 整个程序 | 程序启动时创建，结束时销毁 |
| 形式参数 | 函数参数列表 | 函数内部 | 函数调用时创建，返回时销毁 |
| 静态局部变量 | 函数内部，带 `static` | 函数内部 | 程序启动时创建，结束时销毁 |
| 外部变量 | 用 `extern` 声明 | 声明处所在范围 | 与定义它的全局变量相同 |

## 完整示例

```cpp
#include <iostream>
using namespace std;

int globalValue = 10;  // 全局变量

void demo()
{
    int localValue = 20;           // 局部变量
    static int staticValue = 0;    // 静态局部变量
    staticValue++;

    cout << "局部变量：" << localValue << endl;
    cout << "静态变量：" << staticValue << endl;
}

int main()
{
    cout << "全局变量：" << globalValue << endl;
    demo();
    demo();
    return 0;
}
```

运行结果：

```text
全局变量：10
局部变量：20
静态变量：1
局部变量：20
静态变量：2
```
