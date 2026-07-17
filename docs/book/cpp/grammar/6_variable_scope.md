---
title: C++ 变量作用域
description: C++ 中变量的作用域规则、生命周期与遮蔽现象
order: 6
---

# C++ 变量作用域

作用域决定了程序中哪些位置可以访问某个变量。理解作用域，可以帮助我们避免命名冲突，合理地控制变量的可见范围。

## 什么是作用域

作用域就是变量可以被使用的代码范围。超出这个范围，变量就不可见了。

```cpp
#include <iostream>
using namespace std;

int main()
{
    int inside = 10;  // inside 只在 main 函数内有效
    cout << inside << endl;
    return 0;
}

// cout << inside;  // 错误：outside 超出了 inside 的作用域
```

## 块级作用域

在代码块 `{}` 内部定义的变量，只在该代码块内有效。

```cpp
#include <iostream>
using namespace std;

int main()
{
    if (true)
    {
        int blockVar = 100;
        cout << "块内：" << blockVar << endl;
    }

    // cout << blockVar;  // 错误：blockVar 已经在代码块结束时销毁

    return 0;
}
```

块级作用域常用于循环、条件判断等场景：

```cpp
for (int i = 0; i < 5; i++)
{
    cout << i << endl;
}

// cout << i;  // 错误：i 只在 for 循环内部有效
```

## 函数作用域

在函数内部定义的变量，称为局部变量，只在该函数执行期间有效。不同函数中的同名局部变量互不影响。

```cpp
#include <iostream>
using namespace std;

void funcA()
{
    int value = 10;
    cout << "funcA: " << value << endl;
}

void funcB()
{
    int value = 20;  // 和 funcA 中的 value 是完全不同的变量
    cout << "funcB: " << value << endl;
}

int main()
{
    funcA();
    funcB();
    return 0;
}
```

运行结果：

```text
funcA: 10
funcB: 20
```

## 全局作用域

在所有函数之外定义的变量具有全局作用域，从定义位置开始，到文件结束都可以访问。

```cpp
#include <iostream>
using namespace std;

int globalNumber = 100;  // 全局变量

void show()
{
    cout << "show 函数中：" << globalNumber << endl;
}

int main()
{
    cout << "main 函数中：" << globalNumber << endl;
    show();
    return 0;
}
```

如果全局变量在文件末尾定义，而前面的函数想使用它，需要用 `extern` 声明：

```cpp
#include <iostream>
using namespace std;

extern int globalNumber;  // 声明外部变量

void show()
{
    cout << globalNumber << endl;
}

int globalNumber = 100;  // 实际定义

int main()
{
    show();
    return 0;
}
```

## 作用域解析运算符

当局部变量和全局变量同名时，局部变量会优先被访问。如果仍然想访问全局变量，可以使用作用域解析运算符 `::`。

```cpp
#include <iostream>
using namespace std;

int value = 100;  // 全局变量

int main()
{
    int value = 10;  // 局部变量

    cout << "局部 value：" << value << endl;    // 输出 10
    cout << "全局 value：" << ::value << endl;  // 输出 100

    return 0;
}
```

## 变量遮蔽

当内层作用域定义了与外层作用域同名的变量时，内层变量会遮蔽外层变量。这种现象称为变量遮蔽或名字隐藏。

```cpp
#include <iostream>
using namespace std;

int main()
{
    int x = 10;

    {
        int x = 20;  // 内层 x 遮蔽外层 x
        cout << "内层 x：" << x << endl;  // 输出 20
    }

    cout << "外层 x：" << x << endl;  // 输出 10

    return 0;
}
```

变量遮蔽虽然合法，但容易引发混淆。建议尽量避免同名变量出现在嵌套作用域中。

## 生命周期

生命周期指的是变量从创建到销毁的时间段。它与作用域密切相关，但并不完全相同。

| 变量类型 | 生命周期 |
| --- | --- |
| 局部变量 | 进入作用域时创建，离开作用域时销毁 |
| 全局变量 | 程序启动时创建，程序结束时销毁 |
| 静态局部变量 | 程序启动时创建，程序结束时销毁，但只能在定义它的函数内访问 |

```cpp
#include <iostream>
using namespace std;

void counter()
{
    static int count = 0;  // 只初始化一次
    count++;
    cout << "count = " << count << endl;
}

int main()
{
    counter();  // count = 1
    counter();  // count = 2
    counter();  // count = 3
    return 0;
}
```

## 作用域最佳实践

- 尽量使用局部变量，减少全局变量的使用。
- 变量声明时尽量靠近第一次使用的位置。
- 避免变量遮蔽，特别是在嵌套代码块中。
- 如果必须用到全局变量，考虑用 `const` 修饰，防止被意外修改。

## 完整示例

```cpp
#include <iostream>
using namespace std;

int value = 100;  // 全局变量

void inner()
{
    int value = 300;  // 局部变量遮蔽全局变量
    cout << "inner 中：" << value << endl;
}

void outer()
{
    int value = 200;  // 局部变量遮蔽全局变量
    cout << "outer 中：" << value << endl;
    inner();
}

int main()
{
    outer();
    cout << "main 中访问全局：" << ::value << endl;
    return 0;
}
```

运行结果：

```text
outer 中：200
inner 中：300
main 中访问全局：100
```
