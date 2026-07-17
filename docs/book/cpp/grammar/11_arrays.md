---
title: C++ 数组
description: C++ 中数组的定义、初始化、遍历与常见操作
order: 11
---

# C++ 数组

数组是用来存储一组相同类型数据的容器。比如要存储一个班级 30 名学生的成绩，不需要定义 30 个变量，只需要一个数组即可。

## 为什么使用数组

假设要存储 5 个整数：

```cpp
int score1 = 85;
int score2 = 92;
int score3 = 78;
int score4 = 90;
int score5 = 88;
```

这样写不仅冗长，而且难以批量处理。使用数组可以让代码更简洁：

```cpp
int scores[5] = {85, 92, 78, 90, 88};
```

## 数组的定义

数组定义的格式是：

```cpp
数据类型 数组名[元素个数];
```

例如：

```cpp
int numbers[5];           // 定义一个包含 5 个整数的数组
float temperatures[7];    // 定义一个包含 7 个浮点数的数组
char letters[26];         // 定义一个包含 26 个字符的数组
```

数组的大小必须是常量或在编译期可确定的值：

```cpp
const int SIZE = 5;
int arr[SIZE];  // 正确

// int arr[n];  // 错误：n 必须是常量（C99 变长数组除外）
```

## 数组的初始化

数组可以在定义时初始化：

```cpp
int arr1[5] = {1, 2, 3, 4, 5};
int arr2[] = {1, 2, 3, 4, 5};     // 省略大小，编译器自动推断为 5
int arr3[5] = {1, 2};             // 前两个元素初始化，其余为 0
int arr4[5] = {0};                // 所有元素都初始化为 0
```

如果初始化时提供的元素个数超过数组大小，会编译报错：

```cpp
int arr[3] = {1, 2, 3, 4};  // 错误：元素太多
```

## 访问数组元素

数组中的每个元素都有一个索引，从 0 开始。通过索引可以访问或修改元素。

```cpp
int scores[5] = {85, 92, 78, 90, 88};

cout << scores[0] << endl;  // 输出 85
cout << scores[2] << endl;  // 输出 78

scores[1] = 95;             // 把第二个元素改成 95
```

注意：C++ 不会自动检查索引是否越界。访问 `scores[10]` 这样的非法索引可能导致程序崩溃或产生不可预期的结果。

## 遍历数组

通常使用 `for` 循环遍历数组中的所有元素。

```cpp
#include <iostream>
using namespace std;

int main()
{
    int scores[5] = {85, 92, 78, 90, 88};

    for (int i = 0; i < 5; i++)
    {
        cout << "第 " << i + 1 << " 个成绩：" << scores[i] << endl;
    }

    return 0;
}
```

运行结果：

```text
第 1 个成绩：85
第 2 个成绩：92
第 3 个成绩：78
第 4 个成绩：90
第 5 个成绩：88
```

## 计算数组元素个数

对于普通数组，可以用 `sizeof` 计算元素个数：

```cpp
int arr[] = {1, 2, 3, 4, 5};
int length = sizeof(arr) / sizeof(arr[0]);  // 数组总大小 / 单个元素大小

cout << "数组长度：" << length << endl;
```

注意：这种方法只适用于在定义数组的同一作用域内使用，不能用于函数参数传入的数组。

## 数组的常见操作

### 求和与平均值

```cpp
int scores[5] = {85, 92, 78, 90, 88};
int sum = 0;

for (int i = 0; i < 5; i++)
{
    sum += scores[i];
}

double average = (double)sum / 5;
cout << "总分：" << sum << endl;
cout << "平均分：" << average << endl;
```

### 查找最大值

```cpp
int arr[5] = {34, 78, 12, 90, 56};
int max = arr[0];

for (int i = 1; i < 5; i++)
{
    if (arr[i] > max)
    {
        max = arr[i];
    }
}

cout << "最大值：" << max << endl;
```

### 数组反转

```cpp
int arr[5] = {1, 2, 3, 4, 5};

for (int i = 0; i < 5 / 2; i++)
{
    int temp = arr[i];
    arr[i] = arr[4 - i];
    arr[4 - i] = temp;
}

for (int i = 0; i < 5; i++)
{
    cout << arr[i] << " ";
}

// 输出：5 4 3 2 1
```

## 字符数组与字符串

字符数组可以用来存储字符串。C 风格字符串以 `\0` 结尾。

```cpp
char name1[] = "Koyuki";      // 自动包含结尾的 '\0'
char name2[10] = {'K', 'o', 'y', 'u', 'k', 'i', '\0'};
```

更推荐使用 C++ 标准库的 `string` 类型：

```cpp
#include <string>
using namespace std;

string name = "Koyuki";
cout << name << endl;
```

## 二维数组

二维数组可以看作表格，有行和列。

```cpp
int matrix[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};

cout << matrix[0][0] << endl;  // 输出 1
cout << matrix[1][2] << endl;  // 输出 6
```

遍历二维数组需要嵌套循环：

```cpp
for (int i = 0; i < 2; i++)
{
    for (int j = 0; j < 3; j++)
    {
        cout << matrix[i][j] << " ";
    }
    cout << endl;
}
```

运行结果：

```text
1 2 3
4 5 6
```

## 数组作为函数参数

当数组作为函数参数传递时，实际上传递的是数组的首地址。因此函数内部通常无法知道数组的长度，需要额外传入长度参数。

```cpp
#include <iostream>
using namespace std;

void printArray(int arr[], int length)
{
    for (int i = 0; i < length; i++)
    {
        cout << arr[i] << " ";
    }
    cout << endl;
}

int main()
{
    int numbers[5] = {1, 2, 3, 4, 5};
    printArray(numbers, 5);
    return 0;
}
```

## 数组的注意事项

- 数组大小在定义后不能改变。
- 数组索引从 0 开始，最大有效索引是 `大小 - 1`。
- C++ 不会自动检查越界，越界访问可能导致严重错误。
- 定义数组时如果未初始化，局部数组的元素值是不确定的。

## 完整示例

```cpp
#include <iostream>
using namespace std;

int main()
{
    const int SIZE = 5;
    int scores[SIZE] = {85, 92, 78, 90, 88};

    int sum = 0;
    int max = scores[0];

    for (int i = 0; i < SIZE; i++)
    {
        sum += scores[i];
        if (scores[i] > max)
        {
            max = scores[i];
        }
    }

    double average = (double)sum / SIZE;

    cout << "成绩列表：";
    for (int i = 0; i < SIZE; i++)
    {
        cout << scores[i] << " ";
    }
    cout << endl;

    cout << "总分：" << sum << endl;
    cout << "平均分：" << average << endl;
    cout << "最高分：" << max << endl;

    return 0;
}
```

运行结果：

```text
成绩列表：85 92 78 90 88
总分：433
平均分：86.6
最高分：92
```
