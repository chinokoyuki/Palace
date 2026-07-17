---
title: C++ 流程结构
description: C++ 中的顺序、选择、循环三种基本流程控制结构
order: 10
---

# C++ 流程结构

程序默认按照代码书写的顺序一行一行执行，这称为顺序结构。但现实世界中的问题往往更复杂，需要根据不同条件做出选择，或者重复执行某些操作。流程控制结构就是用来改变程序执行顺序的工具。

C++ 中有三种基本流程结构：

- **顺序结构**：按顺序执行。
- **选择结构**：根据条件选择执行路径。
- **循环结构**：重复执行某段代码。

## 顺序结构

顺序结构是最简单的执行方式，代码从上到下依次运行。

```cpp
#include <iostream>
using namespace std;

int main()
{
    cout << "第一步" << endl;
    cout << "第二步" << endl;
    cout << "第三步" << endl;
    return 0;
}
```

运行结果：

```text
第一步
第二步
第三步
```

## 选择结构

选择结构让程序根据条件判断执行哪一段代码。

### if 语句

`if` 语句是最基本的选择结构。当条件为真时，执行大括号内的代码。

```cpp
int score = 85;

if (score >= 60)
{
    cout << "及格了" << endl;
}
```

### if-else 语句

如果条件不成立，就执行 `else` 分支。

```cpp
int score = 50;

if (score >= 60)
{
    cout << "及格了" << endl;
}
else
{
    cout << "不及格" << endl;
}
```

### if-else if-else 语句

多个条件需要判断时，可以使用 `else if`：

```cpp
int score = 78;

if (score >= 90)
{
    cout << "优秀" << endl;
}
else if (score >= 80)
{
    cout << "良好" << endl;
}
else if (score >= 60)
{
    cout << "及格" << endl;
}
else
{
    cout << "不及格" << endl;
}
```

### 嵌套 if

在一个 `if` 语句内部再写 `if` 语句，称为嵌套。

```cpp
int age = 20;
bool hasID = true;

if (age >= 18)
{
    if (hasID)
    {
        cout << "可以入场" << endl;
    }
    else
    {
        cout << "请出示证件" << endl;
    }
}
else
{
    cout << "未满 18 岁，禁止入场" << endl;
}
```

### switch 语句

当需要对一个变量的多个离散值进行判断时，`switch` 比多个 `if-else` 更清晰。

```cpp
int day = 3;

switch (day)
{
    case 1:
        cout << "星期一" << endl;
        break;
    case 2:
        cout << "星期二" << endl;
        break;
    case 3:
        cout << "星期三" << endl;
        break;
    case 4:
        cout << "星期四" << endl;
        break;
    case 5:
        cout << "星期五" << endl;
        break;
    default:
        cout << "周末" << endl;
        break;
}
```

`break` 用来跳出 `switch` 语句。如果忘记写 `break`，程序会继续执行下一个 `case`，这称为“穿透”。

```cpp
int score = 85;

switch (score / 10)
{
    case 10:
    case 9:
        cout << "优秀" << endl;
        break;
    case 8:
        cout << "良好" << endl;
        break;
    case 7:
    case 6:
        cout << "及格" << endl;
        break;
    default:
        cout << "不及格" << endl;
        break;
}
```

## 循环结构

循环结构让某段代码重复执行，直到满足某个条件为止。

### while 循环

`while` 循环先判断条件，条件为真时执行循环体。

```cpp
int i = 0;

while (i < 5)
{
    cout << i << " ";
    i++;
}

// 输出：0 1 2 3 4
```

如果条件一开始就不成立，循环体一次都不会执行。

### do-while 循环

`do-while` 循环先执行一次循环体，再判断条件。

```cpp
int i = 0;

do
{
    cout << i << " ";
    i++;
} while (i < 5);

// 输出：0 1 2 3 4
```

`do-while` 至少会执行一次循环体，适合需要先执行再判断的场景。

### for 循环

`for` 循环把初始化、条件判断和迭代放在同一行，适合已知循环次数的场景。

```cpp
for (int i = 0; i < 5; i++)
{
    cout << i << " ";
}

// 输出：0 1 2 3 4
```

`for` 循环的三个部分：

1. `int i = 0`：初始化，只在循环开始时执行一次。
2. `i < 5`：循环条件，每次循环前判断。
3. `i++`：迭代操作，每次循环结束后执行。

也可以用来遍历数组：

```cpp
int scores[] = {85, 92, 78, 90, 88};

for (int i = 0; i < 5; i++)
{
    cout << "第 " << i + 1 << " 个成绩：" << scores[i] << endl;
}
```

### 循环控制语句

- `break`：立即结束当前循环。
- `continue`：跳过本次循环剩余部分，进入下一次循环。

```cpp
for (int i = 0; i < 10; i++)
{
    if (i == 3)
    {
        continue;  // 跳过 3
    }
    if (i == 7)
    {
        break;     // 到达 7 时结束循环
    }
    cout << i << " ";
}

// 输出：0 1 2 4 5 6
```

## 选择合适的选择结构

- 条件范围连续或复杂时，使用 `if-else`。
- 判断一个变量是否等于若干个离散值时，使用 `switch`。
- 只需要二选一时，也可以考虑三元运算符。

## 选择合适的循环结构

- 循环次数明确时，使用 `for`。
- 循环次数不确定，但进入循环前就知道条件时，使用 `while`。
- 至少需要执行一次循环体时，使用 `do-while`。

## 完整示例

```cpp
#include <iostream>
using namespace std;

int main()
{
    int choice;

    cout << "请选择操作：" << endl;
    cout << "1. 加法" << endl;
    cout << "2. 减法" << endl;
    cout << "3. 退出" << endl;
    cin >> choice;

    switch (choice)
    {
        case 1:
        {
            int a, b;
            cout << "请输入两个数：";
            cin >> a >> b;
            cout << "结果：" << a + b << endl;
            break;
        }
        case 2:
        {
            int a, b;
            cout << "请输入两个数：";
            cin >> a >> b;
            cout << "结果：" << a - b << endl;
            break;
        }
        case 3:
            cout << "再见" << endl;
            break;
        default:
            cout << "无效选择" << endl;
            break;
    }

    cout << "倒计时：";
    for (int i = 5; i > 0; i--)
    {
        cout << i << " ";
    }
    cout << "开始！" << endl;

    return 0;
}
```
