---
title: C++ 指针
description: C++ 中指针的概念、定义、使用及常见操作
order: 13
---

# C++ 指针

指针是 C++ 中非常强大但也容易出错的特性。它保存的是变量的内存地址，通过指针可以直接访问和修改内存中的数据。

## 什么是指针

每个变量在内存中都有一个地址。指针就是用来存储这个地址的变量。

```cpp
int age = 18;
int* p = &age;  // p 存储了 age 的地址
```

- `&`：取地址运算符，获取变量的内存地址。
- `*`：解引用运算符，通过地址访问变量本身。
- `int*`：表示指向 `int` 类型的指针。

## 指针的定义

定义指针时，需要在类型后面加 `*`。

```cpp
int* p1;      // 指向 int 的指针
double* p2;   // 指向 double 的指针
char* p3;     // 指向 char 的指针
```

`*` 放在类型后面或变量名前面都可以，但放在类型后面更常见：

```cpp
int *p1;      // 等价
int* p1;      // 推荐
```

## 取地址与解引用

```cpp
#include <iostream>
using namespace std;

int main()
{
    int age = 18;
    int* p = &age;

    cout << "age 的值：" << age << endl;
    cout << "age 的地址：" << p << endl;
    cout << "通过指针访问 age：" << *p << endl;

    *p = 20;  // 通过指针修改 age 的值
    cout << "修改后 age 的值：" << age << endl;

    return 0;
}
```

运行结果可能类似于：

```text
age 的值：18
age 的地址：0x7ffd12345678
通过指针访问 age：18
修改后 age 的值：20
```

## 空指针

没有指向任何有效地址的指针称为空指针，用 `nullptr` 表示。

```cpp
int* p = nullptr;

if (p == nullptr)
{
    cout << "指针为空" << endl;
}
```

在 C++11 之前，通常用 `NULL` 或 `0` 表示空指针。现在推荐使用 `nullptr`，因为它类型安全。

## 指针与数组

数组名本质上就是数组首元素的地址。

```cpp
int arr[5] = {10, 20, 30, 40, 50};
int* p = arr;  // p 指向 arr[0]

cout << *p << endl;      // 输出 10
cout << *(p + 1) << endl; // 输出 20
cout << *(p + 2) << endl; // 输出 30
```

指针算术：`p + 1` 并不是把地址加 1，而是加上一个元素的大小。对于 `int*` 来说，`p + 1` 移动到下一个 `int` 的位置。

也可以使用中括号访问数组元素：

```cpp
cout << p[0] << endl;  // 输出 10
cout << p[1] << endl;  // 输出 20
```

## 指针与函数

指针可以作为函数参数，让函数修改调用者的变量。

```cpp
void swap(int* a, int* b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main()
{
    int x = 10, y = 20;
    swap(&x, &y);
    cout << "x = " << x << ", y = " << y << endl;
    return 0;
}
```

运行结果：

```text
x = 20, y = 10
```

## 动态内存分配

使用 `new` 可以在运行时动态申请内存，使用 `delete` 释放内存。

```cpp
int* p = new int;       // 申请一个 int 大小的空间
*p = 100;
cout << *p << endl;
delete p;               // 释放内存
```

申请数组：

```cpp
int* arr = new int[5];  // 申请 5 个 int 的空间
arr[0] = 10;
arr[1] = 20;
delete[] arr;           // 释放数组内存
```

动态分配的内存不会自动释放，忘记释放会导致内存泄漏。

## 野指针与悬空指针

- **野指针**：未初始化就使用的指针，指向不确定的地址。
- **悬空指针**：指向已经被释放的内存的指针。

```cpp
int* p;       // 野指针
*p = 10;      // 危险操作

int* arr = new int[5];
delete[] arr;
cout << arr[0];  // 悬空指针，危险
```

避免方法：

- 定义指针时初始化为 `nullptr`。
- 释放内存后，将指针置为 `nullptr`。

```cpp
int* p = nullptr;
int* arr = new int[5];
delete[] arr;
arr = nullptr;
```

## 指向指针的指针

指针本身也是变量，也有地址。指向指针的指针称为二级指针。

```cpp
int age = 18;
int* p = &age;
int** pp = &p;

cout << **pp << endl;  // 输出 18
```

## 指针的注意事项

- 指针必须指向有效的内存地址才能解引用。
- 释放内存后不要再使用指针。
- 避免内存泄漏，每个 `new` 都要对应一个 `delete`。
- 指针的类型决定了指针算术的步长。

## 完整示例

```cpp
#include <iostream>
using namespace std;

int main()
{
    int a = 10;
    int b = 20;

    int* p1 = &a;
    int* p2 = &b;

    cout << "交换前：a = " << a << ", b = " << b << endl;

    int temp = *p1;
    *p1 = *p2;
    *p2 = temp;

    cout << "交换后：a = " << a << ", b = " << b << endl;

    // 动态数组
    int size = 5;
    int* arr = new int[size];

    for (int i = 0; i < size; i++)
    {
        arr[i] = i * 10;
    }

    cout << "数组元素：";
    for (int i = 0; i < size; i++)
    {
        cout << arr[i] << " ";
    }
    cout << endl;

    delete[] arr;
    arr = nullptr;

    return 0;
}
```

运行结果：

```text
交换前：a = 10, b = 20
交换后：a = 20, b = 10
数组元素：0 10 20 30 40
```
