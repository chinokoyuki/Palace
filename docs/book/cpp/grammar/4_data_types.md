---
title: C++ 数据类型
description: C++ 中的基本数据类型、类型修饰符、常量与类型转换
order: 4
---

# C++ 数据类型

程序的本质是处理数据。在 C++ 中，每个变量都有特定的数据类型，类型决定了变量能存储什么样的数据、占用多少内存，以及可以进行哪些操作。

## 为什么需要数据类型

计算机内存中的数据本质上都是 0 和 1。如果没有类型，编译器就不知道这串二进制应该解释成整数、小数还是字符。数据类型让程序能够：

- 正确地存储和读取数据。
- 分配合适大小的内存空间。
- 在编译阶段检查操作是否合法。

## 基本数据类型

C++ 提供了几种最常用的内置类型：

| 类型 | 说明 | 示例 | 典型占用空间 |
| --- | --- | --- | --- |
| `int` | 整数 | `int a = 10;` | 4 字节 |
| `float` | 单精度浮点数 | `float b = 3.14f;` | 4 字节 |
| `double` | 双精度浮点数 | `double c = 3.14159;` | 8 字节 |
| `char` | 单个字符 | `char d = 'A';` | 1 字节 |
| `bool` | 布尔值 | `bool e = true;` | 1 字节 |
| `void` | 无类型 | 用于函数不返回值 | 无 |

## 变量声明与初始化

在使用变量之前，必须先声明它的类型和名字。声明时可以直接赋初值，这称为初始化。

```cpp
int age;           // 声明一个整数变量，未初始化
age = 18;          // 赋值

int score = 95;    // 声明并初始化
```

未初始化的变量值是不确定的，直接使用可能导致不可预期的结果。好的习惯是声明时立即初始化：

```cpp
int count = 0;
float pi = 3.14f;
char grade = 'A';
bool isReady = false;
```

也可以同时声明多个同类型变量：

```cpp
int a = 1, b = 2, c = 3;
```

## 整型 int

`int` 用于存储整数，例如年龄、数量、编号等。

```cpp
int studentCount = 50;
int year = 2026;
int temperature = -5;
```

整数可以进行加、减、乘、除、取模等运算：

```cpp
int a = 17;
int b = 5;
int sum = a + b;        // 22
int diff = a - b;       // 12
int product = a * b;    // 85
int quotient = a / b;   // 3，整数除法会舍去小数部分
int remainder = a % b;  // 2，取模运算得到余数
```

## 浮点型 float 与 double

`float` 和 `double` 用于存储小数。`double` 的精度更高，能表示更多有效数字。

```cpp
float price = 19.99f;       // 注意 float 字面量通常加 f 后缀
double pi = 3.1415926535;
```

如果需要一个精度较高的浮点数，优先使用 `double`。只有在内存特别敏感的场景，例如嵌入式开发或大规模数组，才考虑使用 `float`。

```cpp
#include <iostream>
using namespace std;

int main()
{
    float f = 1.0f / 3.0f;
    double d = 1.0 / 3.0;

    cout << "float:  " << f << endl;
    cout << "double: " << d << endl;

    return 0;
}
```

## 字符型 char

`char` 用来存储单个字符，用单引号包围。

```cpp
char grade = 'A';
char symbol = '@';
char digit = '7';  // 注意这是字符 '7'，不是整数 7
```

字符在内存中实际上是以 ASCII 码的形式存储的。例如 `'A'` 对应的 ASCII 值是 65。可以通过类型转换查看：

```cpp
char letter = 'A';
cout << "字符：" << letter << endl;
cout << "ASCII 值：" << (int)letter << endl;
```

## 布尔型 bool

`bool` 只有两个取值：`true` 或 `false`，常用于条件判断。

```cpp
bool isPassed = true;
bool hasError = false;
```

布尔值在参与整数运算时，`true` 会被当作 1，`false` 会被当作 0。

```cpp
bool flag = true;
cout << flag + 1 << endl;  // 输出 2
```

## 字符串 string

虽然 `string` 不是 C++ 的内置基本类型，但它是标准库提供的常用类型，用来表示一串字符。

```cpp
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string name = "Koyuki";
    cout << "你好，" << name << endl;
    return 0;
}
```

使用 `string` 时需要包含头文件 `<string>`。

## 类型修饰符

可以在基本类型前加上修饰符，改变类型的取值范围或符号属性：

| 修饰符 | 作用 |
| --- | --- |
| `short` | 短整型，占用空间更小 |
| `long` | 长整型，占用空间更大 |
| `long long` | 更长的整型 |
| `signed` | 有符号，可表示正负，默认即如此 |
| `unsigned` | 无符号，只能表示非负数 |

例如：

```cpp
short smallNumber = 100;
long bigNumber = 1000000L;
long long veryBigNumber = 9000000000000LL;
unsigned int positive = 42;  // 只能存 0 和正数
```

`unsigned` 类型把原来表示负数的部分用来表示更大的正数，因此范围会翻倍，但不能表示负数。

## 常量

常量是值在程序运行期间不能改变的量。用 `const` 关键字修饰：

```cpp
const int MAX_SIZE = 100;
const double PI = 3.14159;
```

尝试修改常量会编译报错：

```cpp
MAX_SIZE = 200;  // 错误
```

常量名通常全部大写，多个单词用下划线连接：

```cpp
const int MAX_STUDENT_COUNT = 50;
const float GRAVITY = 9.8f;
```

## 类型转换

有时候需要把一种类型转换成另一种类型。C++ 支持多种转换方式，最常见的是显式转换：

```cpp
int a = 10;
double b = (double)a / 3;  // 把 a 转换成 double，结果才能保留小数
```

C++ 风格更推荐用 `static_cast`：

```cpp
int a = 10;
double b = static_cast<double>(a) / 3;
```

不过在学习初期，用 C 风格的 `(类型)` 转换也是完全可以接受的。

## 自动推导类型 auto

C++11 引入了 `auto` 关键字，可以让编译器根据右侧的值自动推断变量类型：

```cpp
auto age = 18;          // 推断为 int
auto price = 19.99;     // 推断为 double
auto name = "Koyuki";   // 推断为 const char*
```

`auto` 能减少代码冗余，但初学时建议先显式写出类型，熟悉后再使用 `auto`。

## sizeof 运算符

`sizeof` 用来查看类型或变量占用的字节数，不同平台和编译器可能略有差异：

```cpp
#include <iostream>
using namespace std;

int main()
{
    cout << "char 大小：" << sizeof(char) << " 字节" << endl;
    cout << "int 大小：" << sizeof(int) << " 字节" << endl;
    cout << "float 大小：" << sizeof(float) << " 字节" << endl;
    cout << "double 大小：" << sizeof(double) << " 字节" << endl;

    return 0;
}
```

## 完整示例

下面是一个综合运用数据类型的小程序：

```cpp
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string name = "Koyuki";
    int age = 18;
    float height = 1.65f;
    bool isStudent = true;
    char grade = 'A';

    cout << "姓名：" << name << endl;
    cout << "年龄：" << age << endl;
    cout << "身高：" << height << " 米" << endl;
    cout << "是否学生：" << (isStudent ? "是" : "否") << endl;
    cout << "成绩等级：" << grade << endl;

    return 0;
}
```

运行结果：

```text
姓名：Koyuki
年龄：18
身高：1.65 米
是否学生：是
成绩等级：A
```
