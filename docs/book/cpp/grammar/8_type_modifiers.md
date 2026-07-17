---
title: C++ 修饰符类型
description: C++ 中的 signed、unsigned、short、long、const 与 volatile
order: 8
---

# C++ 修饰符类型

修饰符用于改变基本数据类型的含义，比如扩大取值范围、限制正负号，或者声明不可修改的值。合理使用修饰符，可以让我们更精确地控制数据的存储方式。

## 为什么需要修饰符

不同的场景对数据的要求不同：

- 年龄不可能是负数，使用 `unsigned` 可以扩大正数范围。
- 处理大整数时，可能需要 `long long`。
- 嵌入式设备内存有限，可能需要用 `short` 节省空间。

修饰符让我们可以在不改变数据本质的情况下，灵活调整类型特性。

## signed 与 unsigned

`signed` 表示有符号，可以表示正数、负数和零。`unsigned` 表示无符号，只能表示零和正数。

```cpp
int a = -10;             // 默认 signed
signed int b = -10;      // 显式有符号
unsigned int c = 10;     // 无符号
```

对于 `int` 来说，`signed` 是默认值，通常可以省略。

### 取值范围对比

以 32 位 `int` 为例：

| 类型 | 最小值 | 最大值 |
| --- | --- | --- |
| `signed int` | -2,147,483,648 | 2,147,483,647 |
| `unsigned int` | 0 | 4,294,967,295 |

`unsigned` 把原来表示负数的位全部用来表示正数，因此最大值翻倍。

### 使用场景

```cpp
unsigned int age = 18;           // 年龄不可能是负数
unsigned int studentCount = 50;  // 人数不可能是负数
```

注意：如果把负数赋给 `unsigned` 变量，会得到一个很大的正数，造成意料之外的结果。

```cpp
unsigned int x = -1;
cout << x << endl;  // 会输出一个很大的数
```

## short、long 与 long long

这些修饰符用来改变整数类型占用的字节数，从而影响取值范围。

```cpp
short int a = 100;       // 短整型
long int b = 1000000L;   // 长整型
long long int c = 9000000000000LL;  // 长长整型
```

在修饰 `int` 时，`int` 通常可以省略：

```cpp
short a = 100;
long b = 1000000L;
long long c = 9000000000000LL;
```

### 典型占用空间

| 类型 | 典型大小 |
| --- | --- |
| `short` | 2 字节 |
| `int` | 4 字节 |
| `long` | 4 或 8 字节 |
| `long long` | 8 字节 |

具体大小取决于编译器和平台，可以用 `sizeof` 查看。

```cpp
cout << "short: " << sizeof(short) << " 字节" << endl;
cout << "int: " << sizeof(int) << " 字节" << endl;
cout << "long: " << sizeof(long) << " 字节" << endl;
cout << "long long: " << sizeof(long long) << " 字节" << endl;
```

## 修饰符的组合

多个修饰符可以组合使用，例如 `unsigned short`、`unsigned long long` 等。

```cpp
unsigned short smallPositive = 40000;
unsigned long long hugeNumber = 18000000000000000000ULL;
```

常见组合：

| 类型 | 说明 |
| --- | --- |
| `unsigned int` | 无符号整数 |
| `unsigned short` | 无符号短整数 |
| `unsigned long` | 无符号长整数 |
| `unsigned long long` | 无符号长长整数 |
| `signed char` | 有符号字符 |
| `unsigned char` | 无符号字符 |

## 字面量后缀

为了明确告诉编译器一个字面量的类型，可以使用后缀：

| 后缀 | 含义 |
| --- | --- |
| `U` 或 `u` | `unsigned` |
| `L` 或 `l` | `long` |
| `LL` 或 `ll` | `long long` |
| `UL` | `unsigned long` |
| `ULL` | `unsigned long long` |
| `F` 或 `f` | `float` |

```cpp
unsigned int a = 100U;
long b = 1000000L;
long long c = 10000000000LL;
unsigned long long d = 10000000000ULL;
float pi = 3.14f;
```

## const 修饰符

`const` 修饰的变量值不能被修改。它是最常用的类型修饰符之一。

```cpp
const int MAX_SIZE = 100;
const double PI = 3.14159;
```

`const` 也可以修饰指针，表示指针指向的内容不可修改，或者指针本身不可修改。

```cpp
const int* p1;      // 指向常量的指针，内容不可改
int* const p2;      // 常量指针，指向不可改
const int* const p3; // 指向常量的常量指针，都不可改
```

## volatile 修饰符

`volatile` 告诉编译器，这个变量的值可能会在程序控制之外被改变，因此不要对它进行优化。

```cpp
volatile int sensorValue;
```

常见使用场景包括：

- 硬件寄存器中的值。
- 多线程中可能被其他线程修改的变量。
- 信号处理程序中修改的变量。

对于普通的学习和小型程序，`volatile` 很少用到，但了解它的存在是有帮助的。

## 修饰符的使用建议

- 如果数据不可能为负，优先考虑 `unsigned`。
- 如果数值范围很大，使用 `long long`。
- 如果内存紧张且数值范围很小，使用 `short`。
- 对于不需要改变的值，使用 `const`。
- 不要轻易混用 `signed` 和 `unsigned`，比较时可能产生意外结果。

## 完整示例

```cpp
#include <iostream>
using namespace std;

int main()
{
    short temperature = -20;
    unsigned int studentCount = 1500;
    long long nationalPopulation = 1410000000LL;
    const float PI = 3.14f;

    cout << "温度：" << temperature << " 度" << endl;
    cout << "学生人数：" << studentCount << " 人" << endl;
    cout << "人口：" << nationalPopulation << " 人" << endl;
    cout << "PI：" << PI << endl;

    cout << "\n各类型占用字节数：" << endl;
    cout << "short: " << sizeof(short) << " 字节" << endl;
    cout << "int: " << sizeof(int) << " 字节" << endl;
    cout << "long: " << sizeof(long) << " 字节" << endl;
    cout << "long long: " << sizeof(long long) << " 字节" << endl;

    return 0;
}
```

运行结果（不同平台可能略有差异）：

```text
温度：-20 度
学生人数：1500 人
人口：1410000000 人
PI：3.14

各类型占用字节数：
short: 2 字节
int: 4 字节
long: 4 字节
long long: 8 字节
```
