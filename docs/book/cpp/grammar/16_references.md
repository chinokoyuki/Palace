---
title: C++ 引用
description: C++ 引用的概念、定义与初始化、与指针的区别、传参、const 引用、返回值引用
order: 16
---

# C++ 引用

引用（Reference）是 C++ 对 C 语言的重要扩展。简单来说，引用就是给一个已有的变量**起一个别名**。对引用的操作，实际上就是在操作原变量本身。

## 什么是引用

想象你有一个本名，同时也有一个小名。不管别人叫你的本名还是小名，指的都是你这个人。C++ 中的引用也是这个道理—— `&` 符号用来声明一个引用，让它成为某个变量的别名。

```cpp
int a = 10;
int& ref = a;      // ref 是 a 的引用（别名）

cout << a << endl;    // 10
cout << ref << endl;  // 10

ref = 20;             // 通过引用修改
cout << a << endl;    // 20 —— a 也被改了
```

`ref` 和 `a` 指向内存中**同一块空间**。它们不是两个独立变量，而是同一个变量的两个名字。

## 引用的定义与初始化

引用必须在定义时**立即初始化**，而且要绑定到一个已有的变量上。一旦绑定，就不能再让它引用别的变量。

```cpp
int a = 10;
int b = 20;

int& ref = a;     // 正确：定义时立即绑定到 a
// int& ref2;     // 错误：引用必须初始化

ref = b;          // 这不是让 ref 引用 b，而是把 b 的值赋给了 a
cout << a << endl; // 20
cout << b << endl; // 20
```

上面 `ref = b;` 等价于 `a = b;`，因为 `ref` 就是 `a` 的别名，它永远绑定到 `a`。

**引用不是变量**——它没有自己的内存空间（底层实现可能用指针，但语义上它只是一个别名）。用 `sizeof(ref)` 得到的是被引用变量的大小。

```cpp
int x = 42;
int& r = x;

cout << sizeof(r) << endl;  // 输出 4（int 的大小），而不是指针的大小
```

## 引用 vs 指针

引用和指针都能间接访问变量，但它们有本质区别：

| 对比维度 | 引用 | 指针 |
| --- | --- | --- |
| 本质 | 变量的别名 | 存储地址的变量 |
| 初始化 | 必须定义时初始化 | 可以先定义后赋值 |
| 可否为空 | 不能为空，必须绑定有效变量 | 可以为 `nullptr` |
| 可否重新绑定 | 不能，终身绑定一个变量 | 可以指向不同的变量 |
| 访问方式 | 直接使用，和普通变量一样 | 需要 `*` 解引用 |
| 语法安全性 | 较高，不容易出错 | 较低，容易出现野指针 |
| 多级 | 没有多级引用 | 可以有多级指针 (`int**`) |

```cpp
// 引用：天然安全
int a = 10;
int& ref = a;
ref = 20;              // 等价于 a = 20，语法简洁

// 指针：功能强大但需要更小心
int b = 10;
int* ptr = &b;
*ptr = 20;             // 需要解引用
ptr = nullptr;         // 可以为空
// *ptr = 30;          // 危险！对空指针解引用
```

:::tip 选择建议
- 函数参数想**避免拷贝**、**可能修改实参** → 用引用。
- 函数参数想**避免拷贝**、**只读访问** → 用 `const` 引用。
- 需要表示"可能为空"、"可能重新指向" → 用指针。
- 动态内存管理 → 用指针（配合 `new`/`delete` 或智能指针）。
:::

## 引用作为函数参数

在函数章节已经见过引用传参，这里做更系统的说明。

### 避免拷贝，提高效率

对于大型对象（如 `string`、自定义结构体），值传递会复制整个对象，开销很大。引用传递只传地址，零拷贝：

```cpp
struct LargeData
{
    int data[1000];
};

void process(LargeData& obj)    // 引用传递，不拷贝
{
    obj.data[0] = 999;
}
```

### 让函数修改实参

之前用指针实现的 `swap` 函数，用引用可以写得更简洁：

```cpp
void swap(int& a, int& b)
{
    int temp = a;
    a = b;
    b = temp;
}

int main()
{
    int x = 10, y = 20;
    swap(x, y);
    cout << "x = " << x << ", y = " << y << endl;  // x = 20, y = 10
    return 0;
}
```

相比指针版本，调用方不需要传 `&x`，函数内部不需要 `*a` —— 代码直观很多。

## const 引用

`const` 引用有两个重要用途：

### 只读访问，防止意外修改

```cpp
void printStudent(const string& name, const int& age)
{
    // name = "xxx";  // 错误！const 引用不能修改
    cout << name << " " << age << endl;
}
```

### 绑定临时对象

普通引用不能绑定到临时对象（字面量、表达式结果），但 `const` 引用可以：

```cpp
// int& r1 = 10;           // 错误：普通引用不能绑定到字面量
const int& r2 = 10;         // 正确：const 引用可以

// int& r3 = a + b;        // 错误：普通引用不能绑定到临时结果
const int& r4 = a + b;     // 正确：const 引用延长了临时对象的生命周期
```

这个特性让 `const` 引用在函数参数中特别常用——你可以直接传字面量或表达式：

```cpp
void print(const int& value)
{
    cout << value << endl;
}

print(10);           // 直接传字面量
print(3 + 4);        // 传表达式结果
```

## 引用作为返回值

函数可以返回引用，但要**格外小心**——绝对不能返回局部变量的引用！

```cpp
// 错误示例：返回局部变量的引用
int& badFunc()
{
    int x = 10;
    return x;    // 危险！x 在函数返回后就被销毁了
}   // 返回的引用指向已销毁的内存 → 悬空引用

// 正确示例：返回静态变量的引用
int& goodFunc()
{
    static int x = 10;
    return x;    // 安全：静态变量生命周期是整个程序
}

// 正确示例：返回传入的引用参数
int& max(int& a, int& b)
{
    return (a > b) ? a : b;
}

int main()
{
    int x = 10, y = 20;
    max(x, y) = 0;   // 把较大的那个值置为零
    cout << x << " " << y << endl;  // 10 0
    return 0;
}
```

:::danger 常见陷阱
返回局部变量的引用是 C++ 中最常见的未定义行为之一。编译器可能会给一个警告，但程序仍可能"碰巧"运行正常——这才是最危险的，因为 bug 可能在很久之后才暴露。

```cpp
int& dangerous()
{
    int local = 42;
    return local;  // 编译器警告：reference to local variable
}
```
:::

## 引用的局限

引用虽好，但并非万能：

- **不能为空**：如果你需要表达"没有值"的语义，只能用指针（`nullptr`）。
- **不能重新绑定**：一旦绑定到一个变量，终身不变。需要切换目标时用指针。
- **没有"引用的引用"**：`int&&` 是右值引用（C++11 的高级特性），不是引用的引用。
- **不能组成数组**：不能定义 `int& arr[5]`，但可以定义指针数组。

## 左值引用与右值引用

本文讨论的是**左值引用**（`T&`），即绑定到有名字的、可以取地址的变量。C++11 引入了**右值引用**（`T&&`），用于移动语义和完美转发，属于进阶话题。

```cpp
int a = 10;
int& lref = a;       // 左值引用：绑定到左值 a

int&& rref = 10;     // 右值引用：绑定到右值（临时的）10
// int&& rref2 = a;  // 错误：a 是左值，不能绑定到右值引用
```

右值引用主要用于实现移动构造函数和移动赋值，在 C++ 类的章节会进一步展开。

## 完整示例

```cpp
#include <iostream>
#include <string>
using namespace std;

// 用引用交换两个值
void swap(int& a, int& b)
{
    int temp = a;
    a = b;
    b = temp;
}

// const 引用：只读访问大型对象
void printInfo(const string& name, const int& age)
{
    cout << "姓名：" << name << "，年龄：" << age << endl;
}

// 返回引用的函数：找出较大的元素并返回引用
int& larger(int& a, int& b)
{
    return (a > b) ? a : b;
}

int main()
{
    // 1. 基本引用
    int original = 10;
    int& alias = original;

    alias = 100;
    cout << "通过引用修改后，原值 = " << original << endl;

    // 2. 引用传参
    int x = 5, y = 99;
    cout << "交换前：x = " << x << ", y = " << y << endl;
    swap(x, y);
    cout << "交换后：x = " << x << ", y = " << y << endl;

    // 3. const 引用
    string name = "Koyuki";
    printInfo(name, 18);          // 可以直接传字面量给 const 引用
    printInfo("Alice", 20);       // 临时字符串也可以

    // 4. 返回引用
    larger(x, y) = 0;             // 把较大的改成 0
    cout << "修改较大值后：x = " << x << ", y = " << y << endl;

    return 0;
}
```

运行结果：

```text
通过引用修改后，原值 = 100
交换前：x = 5, y = 99
交换后：x = 99, y = 5
姓名：Koyuki，年龄：18
姓名：Alice，年龄：20
修改较大值后：x = 0, y = 5
```
