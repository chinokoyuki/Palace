---
title: C++ 内存模型
description: C++ 程序的内存分区：栈、堆、全局区、常量区、代码区，以及动态内存管理
order: 15
---

# C++ 内存模型

理解 C++ 程序的内存布局，是写出高效、安全代码的前提。C++ 把程序使用的内存分为几个不同的区域，每个区域有自己的用途和管理方式。

## 为什么需要了解内存模型

- 知道变量"住在哪里"，才能理解它的生命周期和作用范围。
- 区分栈和堆，才能正确使用 `new`/`delete`，避免内存泄漏。
- 理解内存布局，有助于调试崩溃、野指针等棘手问题。

C++ 程序的内存通常分为五个区域：

| 区域 | 存储内容 | 管理方式 |
| --- | --- | --- |
| 栈（Stack） | 局部变量、函数参数 | 编译器自动管理 |
| 堆（Heap） | 动态分配的内存 | 程序员手动管理 |
| 全局/静态区 | 全局变量、静态变量 | 程序结束时释放 |
| 常量区 | 字符串常量、`const` 全局变量 | 只读，程序结束时释放 |
| 代码区 | 程序的机器指令 | 只读 |

## 栈内存（Stack）

栈由编译器自动管理，遵循"后进先出"的规则。每当调用一个函数，它的局部变量和参数就被压入栈中；函数返回时，这些数据自动弹出、释放。

```cpp
#include <iostream>
using namespace std;

void func()
{
    int x = 10;       // x 在栈上
    int y = 20;       // y 在栈上
    cout << x + y << endl;
}   // 函数结束，x 和 y 自动被销毁

int main()
{
    func();
    // 这里不能再访问 x 或 y
    return 0;
}
```

栈的特点：

- **速度快**：分配和释放只需移动栈指针，开销极小。
- **空间有限**：栈的大小通常为几 MB，递归过深或局部数组过大会导致栈溢出（Stack Overflow）。
- **自动管理**：无需手动释放，变量超出作用域即销毁。

```cpp
// 栈溢出示例（不要运行）
// int arr[10000000];    // 局部数组过大，可能栈溢出
```

## 堆内存（Heap）

堆是一块很大的自由内存区域，由程序员通过 `new` 申请、`delete` 释放。堆上的变量生命周期由程序员控制，不会随函数结束而自动销毁。

```cpp
#include <iostream>
using namespace std;

int* createNumber()
{
    int* p = new int(42);   // 在堆上分配
    return p;                // 返回指针，堆上的数据仍然存在
}

int main()
{
    int* num = createNumber();
    cout << *num << endl;    // 输出 42
    delete num;              // 手动释放
    num = nullptr;           // 避免悬空指针
    return 0;
}
```

堆的特点：

- **空间大**：受限于系统可用内存，远大于栈。
- **速度较慢**：分配和释放需要查找空闲块，有额外开销。
- **手动管理**：忘记 `delete` 会导致内存泄漏，提前 `delete` 会产生悬空指针。
- **生命周期灵活**：可以在函数之间传递，直到显式释放。

## 全局/静态区

全局变量（在所有函数外定义）和静态变量（用 `static` 修饰）存储在全局区，在程序启动时分配，程序结束时释放。

```cpp
#include <iostream>
using namespace std;

int globalVar = 100;      // 全局变量，存放在全局区

void func()
{
    static int count = 0; // 静态局部变量，也存放在全局区
    count++;
    cout << "count = " << count << endl;
}

int main()
{
    func();  // count = 1
    func();  // count = 2
    func();  // count = 3

    cout << "globalVar = " << globalVar << endl;
    return 0;
}
```

运行结果：

```text
count = 1
count = 2
count = 3
globalVar = 100
```

全局/静态区的特点：

- **生命周期长**：从程序启动到结束，全程存在。
- **默认初始化为零**：未显式初始化的全局/静态变量会自动置零。
- **静态局部变量的特殊性**：`static` 局部变量只在第一次执行到定义时初始化，之后保留上次的值。

## 常量区

字符串字面量和 `const` 修饰的全局变量存放在常量区，这块内存是**只读**的。

```cpp
const char* msg = "Hello";   // "Hello" 在常量区，msg 是指向它的指针
// msg[0] = 'h';             // 错误！常量区不可修改
```

:::warning 注意
尝试修改常量区的内容会导致未定义行为（通常程序崩溃）。如果需要可修改的字符串，请使用字符数组：

```cpp
char msg[] = "Hello";        // "Hello" 从常量区拷贝到栈上的数组
msg[0] = 'h';                // 合法
```
:::

## 栈 vs 堆

| 对比维度 | 栈（Stack） | 堆（Heap） |
| --- | --- | --- |
| 管理方式 | 编译器自动 | 程序员手动 (`new`/`delete`) |
| 分配速度 | 极快 | 较慢 |
| 空间大小 | 几 MB，有限 | 可达 GB 级别 |
| 生命周期 | 随作用域结束 | 由程序员控制 |
| 碎片问题 | 无 | 可能出现内存碎片 |
| 典型用途 | 局部变量、函数调用 | 动态数组、大对象、跨函数共享数据 |

选择原则：

- 小对象、生命周期明确 → 用栈。
- 大小不确定、需要跨函数共享、生命周期复杂 → 用堆。
- C++11 以后，优先使用**智能指针**（`unique_ptr`、`shared_ptr`）管理堆内存，避免手动 `new`/`delete`。

## 动态数组的内存

动态数组的内存分配在堆上：

```cpp
int n;
cout << "请输入数组大小：";
cin >> n;

int* arr = new int[n];   // 在堆上分配 n 个 int

for (int i = 0; i < n; i++)
{
    arr[i] = i * 10;
}

for (int i = 0; i < n; i++)
{
    cout << arr[i] << " ";
}
cout << endl;

delete[] arr;            // 用 delete[] 释放数组
arr = nullptr;
```

:::tip 提示
`new` 搭配 `delete`，`new[]` 搭配 `delete[]` —— 混用会导致未定义行为。
:::

## 内存泄漏

内存泄漏是指用 `new` 分配了堆内存，但忘记用 `delete` 释放。随着程序运行，泄漏的内存越积越多，最终可能耗尽系统内存。

```cpp
void leak()
{
    int* p = new int(100);
    // 忘记 delete p;  ← 内存泄漏！
}   // p 本身（栈上的指针）被销毁，但它指向的堆内存永远丢失了

int main()
{
    for (int i = 0; i < 1000000; i++)
    {
        leak();  // 每次调用泄漏 4 字节
    }
    return 0;
}
```

防范措施：

- 每个 `new` 都要配一个 `delete`。
- 使用智能指针自动管理内存。
- 用工具（如 Valgrind、AddressSanitizer）检测泄漏。

## 完整示例

```cpp
#include <iostream>
using namespace std;

int globalScore = 100;          // 全局区

void showMemory()
{
    int stackVar = 10;          // 栈
    static int staticVar = 0;   // 全局区
    staticVar++;

    int* heapVar = new int(20); // 堆

    cout << "栈变量：" << stackVar << endl;
    cout << "静态变量（第" << staticVar << "次调用）：" << staticVar << endl;
    cout << "堆变量：" << *heapVar << endl;
    cout << "全局变量：" << globalScore << endl;

    delete heapVar;
    heapVar = nullptr;
}

int main()
{
    showMemory();
    cout << "---------------" << endl;
    showMemory();
    cout << "---------------" << endl;

    // 动态数组示例
    int size = 5;
    int* arr = new int[size];

    for (int i = 0; i < size; i++)
    {
        arr[i] = (i + 1) * 10;
    }

    cout << "堆上的数组：";
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
栈变量：10
静态变量（第1次调用）：1
堆变量：20
全局变量：100
---------------
栈变量：10
静态变量（第2次调用）：2
堆变量：20
全局变量：100
---------------
堆上的数组：10 20 30 40 50
```

从这个例子可以清楚地看到：栈变量每次调用都重新创建；静态变量跨调用保持；堆变量由我们手动管理；全局变量全程存在。
