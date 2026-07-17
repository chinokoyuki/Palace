---
title: C++ 函数
description: C++ 中函数的定义、调用、参数传递、返回值与重载
order: 12
---

# C++ 函数

函数是一段可以重复使用的代码块，用来完成某个特定任务。通过函数，我们可以把复杂的问题拆分成多个小模块，让代码更清晰、更易于维护。

## 为什么使用函数

假设一个程序中多次需要计算两个数的最大值：

```cpp
int a = 10, b = 20;
int max1 = (a > b) ? a : b;

int c = 30, d = 15;
int max2 = (c > d) ? c : d;
```

如果很多地方都需要这个功能，反复写同样的逻辑会很冗余。把这段逻辑封装成函数，就可以多次调用：

```cpp
int getMax(int a, int b)
{
    return (a > b) ? a : b;
}

int max1 = getMax(10, 20);
int max2 = getMax(30, 15);
```

## 函数的定义

函数定义包括返回值类型、函数名、参数列表和函数体。

```cpp
int add(int a, int b)
{
    int sum = a + b;
    return sum;
}
```

- `int`：返回值类型，表示函数返回一个整数。
- `add`：函数名。
- `(int a, int b)`：参数列表，表示函数需要两个整数作为输入。
- `{}`：函数体，包含具体的执行逻辑。

## 函数的调用

定义函数后，可以通过函数名和参数来调用它。

```cpp
#include <iostream>
using namespace std;

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

运行结果：

```text
3 + 5 = 8
```

## 返回值

函数可以通过 `return` 语句返回一个值。返回值的类型必须与函数定义时声明的类型一致。

```cpp
double getArea(double radius)
{
    return 3.14159 * radius * radius;
}
```

如果函数不需要返回值，可以使用 `void`：

```cpp
void sayHello()
{
    cout << "Hello Koyuki!" << endl;
}
```

`void` 函数可以省略 `return` 语句，也可以在需要提前结束时使用 `return;`。

## 函数声明

如果函数定义在调用之后，需要在使用前先声明函数原型。

```cpp
#include <iostream>
using namespace std;

// 函数声明
int add(int a, int b);

int main()
{
    cout << add(3, 5) << endl;
    return 0;
}

// 函数定义
int add(int a, int b)
{
    return a + b;
}
```

函数声明只需要写出返回值类型、函数名和参数类型，参数名可以省略：

```cpp
int add(int, int);
```

## 参数传递方式

C++ 中参数传递有两种常见方式：值传递和引用传递。

### 值传递

值传递会把实参的值复制一份给形参。函数内部对形参的修改不会影响实参。

```cpp
void changeValue(int x)
{
    x = 100;
}

int main()
{
    int a = 10;
    changeValue(a);
    cout << a << endl;  // 输出 10，a 没有被修改
    return 0;
}
```

### 引用传递

引用传递让形参成为实参的别名。函数内部对形参的修改会直接影响实参。

```cpp
void changeValue(int& x)
{
    x = 100;
}

int main()
{
    int a = 10;
    changeValue(a);
    cout << a << endl;  // 输出 100，a 被修改了
    return 0;
}
```

引用传递可以避免复制大量数据，提高效率。如果不需要修改实参，可以使用 `const` 引用：

```cpp
void printString(const string& str)
{
    cout << str << endl;
}
```

## 默认参数

函数参数可以设置默认值。调用函数时，如果不传入该参数，就使用默认值。

```cpp
void greet(string name = "Koyuki")
{
    cout << "Hello, " << name << endl;
}

int main()
{
    greet();            // 输出 Hello, Koyuki
    greet("Alice");     // 输出 Hello, Alice
    return 0;
}
```

默认参数必须从右向左连续设置：

```cpp
void func(int a, int b = 10, int c = 20);  // 正确
// void func(int a = 1, int b, int c = 20); // 错误
```

## 函数重载

函数重载允许定义多个同名函数，只要它们的参数列表不同即可。编译器会根据调用时传入的参数自动选择合适的函数。

```cpp
#include <iostream>
using namespace std;

int add(int a, int b)
{
    return a + b;
}

double add(double a, double b)
{
    return a + b;
}

int add(int a, int b, int c)
{
    return a + b + c;
}

int main()
{
    cout << add(1, 2) << endl;        // 调用第一个
    cout << add(1.5, 2.5) << endl;    // 调用第二个
    cout << add(1, 2, 3) << endl;     // 调用第三个
    return 0;
}
```

函数重载的条件是参数个数、类型或顺序不同。仅返回值不同不能构成重载。

## 递归函数

函数调用自身的现象称为递归。递归需要有一个终止条件，否则会无限调用下去。

```cpp
int factorial(int n)
{
    if (n <= 1)
    {
        return 1;
    }
    return n * factorial(n - 1);
}

int main()
{
    cout << "5! = " << factorial(5) << endl;  // 输出 120
    return 0;
}
```

递归的思路：

- 找到问题的基准情况，例如 `factorial(1) = 1`。
- 把大问题分解为更小的同类问题，例如 `factorial(n) = n * factorial(n - 1)`。

## 内联函数

用 `inline` 关键字修饰的函数称为内联函数。编译器会尝试把函数调用处直接替换为函数体，减少函数调用的开销。

```cpp
inline int square(int x)
{
    return x * x;
}
```

内联函数适合代码简短、调用频繁的函数。是否真正内联由编译器决定，`inline` 只是建议。

## 函数设计建议

- 函数应该只完成一个明确的任务。
- 函数名应该见名知意，例如 `getMax`、`calculateArea`。
- 函数不宜过长，过长的函数可以考虑拆分。
- 优先使用引用传递大型对象，避免不必要的拷贝。

## 完整示例

```cpp
#include <iostream>
using namespace std;

// 函数声明
bool isPrime(int number);

int main()
{
    int n = 17;

    if (isPrime(n))
    {
        cout << n << " 是质数" << endl;
    }
    else
    {
        cout << n << " 不是质数" << endl;
    }

    return 0;
}

// 函数定义
bool isPrime(int number)
{
    if (number <= 1)
    {
        return false;
    }

    for (int i = 2; i < number; i++)
    {
        if (number % i == 0)
        {
            return false;
        }
    }

    return true;
}
```

运行结果：

```text
17 是质数
```
