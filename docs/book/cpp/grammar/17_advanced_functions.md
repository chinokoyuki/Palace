---
title: 函数高级
description: C++ 函数的默认参数、占位参数与函数重载的详细讲解
order: 17
---

# 函数高级

在掌握了函数的基本概念之后，本章将深入介绍 C++ 中三个常用且重要的函数特性：默认参数、占位参数和函数重载。它们能够让代码更简洁、更灵活，也是面向对象编程中多态性的基础之一。

## 函数的默认参数

默认参数（Default Arguments）允许在函数声明时为某些参数指定默认值。调用函数时，如果没有为这些参数提供实参，编译器会自动使用默认值。

### 基本语法

默认参数从右向左依次给出，不能间隔设置。

```cpp
#include <iostream>
using namespace std;

// 正确：b 和 c 有默认值
int add(int a, int b = 10, int c = 20) {
    return a + b + c;
}

// 错误：不能跳过中间的 b 只为 c 设置默认值
// int add(int a, int b, int c = 20);  // 合法
// int add(int a, int b = 10, int c);  // 非法
```

### 调用方式

```cpp
int main() {
    cout << add(1) << endl;        // 1 + 10 + 20 = 31
    cout << add(1, 2) << endl;     // 1 + 2 + 20 = 23
    cout << add(1, 2, 3) << endl;  // 1 + 2 + 3 = 6
    return 0;
}
```

### 默认参数的声明位置

默认参数通常写在函数声明中，而不是定义中。如果函数声明和定义分开，只需在声明处写默认值即可。

```cpp
// 头文件或函数声明
int divide(int a, int b = 2);

// 函数定义
int divide(int a, int b) {
    return a / b;
}
```

:::warning
如果同时在声明和定义中写默认参数，会导致重定义错误。
:::

### 使用场景

默认参数适合用于以下场景：

- 函数的大多数调用使用相同的参数值。
- 需要向后兼容旧代码，新增参数时不破坏现有调用。

```cpp
void printInfo(string name, int age = 18, string school = "未知学校") {
    cout << "姓名：" << name << endl;
    cout << "年龄：" << age << endl;
    cout << "学校：" << school << endl;
}

int main() {
    printInfo("小明");
    printInfo("小红", 20);
    printInfo("小刚", 19, "第一中学");
    return 0;
}
```

## 函数的占位参数

占位参数（Placeholder Parameters）是指在函数参数列表中只声明类型而不写参数名的形参。调用函数时仍然需要传入对应的实参，但函数体内不会使用这个参数。

### 基本语法

```cpp
void func(int a, int) {
    cout << "a = " << a << endl;
}

int main() {
    func(10, 20);  // 第二个参数必须传入，但不会使用
    return 0;
}
```

### 占位参数与默认参数结合

占位参数也可以设置默认值，这样调用时就可以省略该参数。

```cpp
void func(int a, int = 10) {
    cout << "a = " << a << endl;
}

int main() {
    func(10);      // 使用默认值 10
    func(10, 20);  // 传入 20
    return 0;
}
```

### 使用场景

占位参数在以下场景中有用：

- 保留参数位置，方便后续扩展。
- 区分函数重载版本。
- 与运算符重载配合，区分前缀和后缀形式（如 `++a` 和 `a++`）。

```cpp
class Counter {
public:
    int value = 0;

    // 前缀 ++
    Counter& operator++() {
        ++value;
        return *this;
    }

    // 后缀 ++，使用 int 占位参数区分
    Counter operator++(int) {
        Counter temp = *this;
        value++;
        return temp;
    }
};
```

## 函数重载

函数重载（Function Overloading）允许在同一作用域中声明多个同名函数，只要它们的参数列表不同即可。编译器根据调用时传入的实参类型和数量，自动选择最匹配的版本。

### 重载的条件

函数重载必须满足以下条件之一：

- 参数个数不同。
- 参数类型不同。
- 参数顺序不同。

:::warning
仅返回值不同不能构成重载，因为编译器无法通过返回值区分调用哪个函数。
:::

### 基本示例

```cpp
#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

int add(int a, int b, int c) {
    return a + b + c;
}

int main() {
    cout << add(1, 2) << endl;        // 调用 int 版本
    cout << add(1.5, 2.5) << endl;    // 调用 double 版本
    cout << add(1, 2, 3) << endl;     // 调用三参数版本
    return 0;
}
```

### 重载与默认参数结合时的歧义

默认参数和函数重载同时使用时，可能会产生调用歧义，编译器会报错。

```cpp
int add(int a, int b) {
    return a + b;
}

int add(int a, int b = 10) {  // 带默认参数
    return a + b;
}

int main() {
    // add(1, 2);  // 错误：两个函数都匹配
    return 0;
}
```

### 重载解析规则

当存在多个候选函数时，编译器按以下优先级选择：

1. 精确匹配。
2. 通过类型提升匹配（如 `char` 提升为 `int`，`float` 提升为 `double`）。
3. 通过标准转换匹配（如 `int` 转换为 `double`）。
4. 通过用户自定义转换匹配。

```cpp
void print(int a) {
    cout << "int: " << a << endl;
}

void print(double a) {
    cout << "double: " << a << endl;
}

int main() {
    print('A');    // char 提升为 int，调用 print(int)
    print(3.14f);  // float 提升为 double，调用 print(double)
    return 0;
}
```

### 函数重载的应用场景

函数重载常用于：

- 为不同类型的数据提供统一的接口。
- 实现运算符重载。
- 提供不同参数个数的便捷调用方式。

```cpp
class Calculator {
public:
    int multiply(int a, int b) {
        return a * b;
    }

    double multiply(double a, double b) {
        return a * b;
    }

    int multiply(int a, int b, int c) {
        return a * b * c;
    }
};
```

## 默认参数、占位参数与重载对比

| 特性 | 作用 | 调用时是否传参 |
| --- | --- | --- |
| 默认参数 | 为参数提供默认值，简化调用 | 可以不传 |
| 占位参数 | 占一个参数位置，函数体不使用 | 必须传（除非有默认值） |
| 函数重载 | 同名函数不同参数列表，实现多态 | 根据版本传参 |

## 综合示例

下面通过一个综合示例演示三个特性的结合使用：

```cpp
#include <iostream>
using namespace std;

class Box {
public:
    double length;
    double width;
    double height;

    Box(double l, double w, double h) : length(l), width(w), height(h) {}

    // 计算体积，可指定是否使用默认单位
    double volume(bool useDefault = true) {
        if (useDefault) {
            return length * width * height;
        }
        return length * width * height * 1000;
    }
};

// 重载 print 函数
void print(Box box) {
    cout << "Box: " << box.length << " x " << box.width << " x " << box.height << endl;
}

void print(double volume, int) {  // 使用 int 占位参数
    cout << "Volume: " << volume << endl;
}

int main() {
    Box box(2.0, 3.0, 4.0);

    print(box);
    print(box.volume(), 0);  // 占位参数传入 0

    return 0;
}
```

## 本章小结

- 默认参数可以为函数参数提供默认值，必须从右向左连续设置。
- 占位参数只声明类型不写名称，常用于运算符重载和参数占位。
- 函数重载允许同名函数共存，条件是参数列表不同。
- 默认参数与重载同时使用时要注意避免歧义。
