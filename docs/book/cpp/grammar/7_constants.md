---
title: C++ 常量
description: C++ 中的字面常量、const、constexpr 与宏常量
order: 7
---

# C++ 常量

常量是在程序运行期间值不会被改变的量。使用常量可以让代码更安全、更清晰，也能避免魔术数字带来的维护困难。

## 什么是常量

与变量不同，常量一旦定义，就不能再被赋值或修改。

```cpp
const int MAX_SIZE = 100;
// MAX_SIZE = 200;  // 错误：不能修改常量
```

常量的名字通常全部大写，多个单词之间用下划线连接，这样一眼就能看出它是不可变的值。

## 字面常量

字面常量是直接写在代码中的固定值。根据类型不同，可以分为以下几种：

### 整数字面量

```cpp
int a = 100;        // 十进制
int b = 0xFF;       // 十六进制，等于 255
int c = 010;        // 八进制，等于 8
int d = 0b1010;     // 二进制，等于 10
```

### 浮点数字面量

```cpp
float f = 3.14f;         // float 类型，加 f 后缀
double d = 3.14159;      // double 类型
```

### 字符字面量

```cpp
char letter = 'A';
char newline = '\n';
char tab = '\t';
```

### 字符串字面量

```cpp
string name = "Koyuki";
```

### 布尔字面量

```cpp
bool success = true;
bool failed = false;
```

## const 常量

`const` 是 C++ 中最常用的定义常量的方式。它告诉编译器，这个变量的值在初始化后不能再改变。

```cpp
#include <iostream>
using namespace std;

int main()
{
    const double PI = 3.14159;
    const int MAX_STUDENTS = 50;

    double radius = 5.0;
    double area = PI * radius * radius;

    cout << "圆的面积：" << area << endl;

    return 0;
}
```

`const` 常量必须初始化，否则编译会报错：

```cpp
const int SIZE;     // 错误：未初始化的 const 常量
SIZE = 100;         // 错误：不能再次赋值
```

## constexpr 常量

`constexpr` 是 C++11 引入的关键字，表示值在编译期就可以确定。它比 `const` 更严格，要求右侧表达式必须是编译期可计算的。

```cpp
constexpr int SQUARE(int x)
{
    return x * x;
}

int main()
{
    constexpr int size = SQUARE(5);  // 编译期计算出 25
    cout << size << endl;
    return 0;
}
```

`constexpr` 常用于数组大小、模板参数等必须在编译期知道的场景：

```cpp
constexpr int ARRAY_SIZE = 10;
int numbers[ARRAY_SIZE];  // 数组大小必须是常量
```

## const 与 constexpr 的区别

| 特性 | const | constexpr |
| --- | --- | --- |
| 是否能在编译期确定 | 不一定 | 必须 |
| 能否用于数组大小 | 在某些编译器中可以 | 可以 |
| 修饰函数 | 表示函数不会修改成员变量 | 表示函数可以在编译期执行 |

初学阶段，可以先用 `const`，等熟悉编译期优化概念后再使用 `constexpr`。

## 宏常量

在 C 语言中，常用 `#define` 定义宏常量。C++ 中仍然支持，但不推荐优先使用。

```cpp
#define PI 3.14159
#define MAX_SIZE 100
```

宏常量在预处理阶段会被直接替换，不会进行类型检查。如果一个值有明确的类型，使用 `const` 或 `constexpr` 更安全。

```cpp
#include <iostream>
using namespace std;

#define PI 3.14159

int main()
{
    double area = PI * 5 * 5;
    cout << area << endl;
    return 0;
}
```

## 常量指针与指针常量

当 `const` 和指针结合时，情况会稍微复杂一些。

### 指向常量的指针

指针指向的内容不能修改，但指针本身可以指向别处。

```cpp
int a = 10;
int b = 20;
const int* p = &a;
// *p = 30;  // 错误：不能通过 p 修改 a
p = &b;      // 正确：可以让 p 指向 b
```

### 常量指针

指针本身的值不能修改，即不能让它指向别处，但它指向的内容可以修改。

```cpp
int a = 10;
int b = 20;
int* const p = &a;
*p = 30;     // 正确：可以修改 a 的值
// p = &b;   // 错误：不能改变 p 的指向
```

### 指向常量的常量指针

指针本身不能修改，指向的内容也不能修改。

```cpp
int a = 10;
const int* const p = &a;
// *p = 30;  // 错误
// p = &b;   // 错误
```

这部分内容比较深入，初学者可以先了解 `const` 的基本用法，等掌握指针后再回来学习。

## 使用常量的好处

- **可读性**：`MAX_SIZE` 比 `100` 更能表达含义。
- **可维护性**：只需要修改一处，所有使用该常量的地方都会更新。
- **安全性**：防止意外修改不应该改变的值。

## 完整示例

```cpp
#include <iostream>
using namespace std;

int main()
{
    const double PI = 3.14159;
    const int RADIUS = 5;

    double circumference = 2 * PI * RADIUS;
    double area = PI * RADIUS * RADIUS;

    cout << "半径：" << RADIUS << endl;
    cout << "周长：" << circumference << endl;
    cout << "面积：" << area << endl;

    return 0;
}
```

运行结果：

```text
半径：5
周长：31.4159
面积：78.5397
```
