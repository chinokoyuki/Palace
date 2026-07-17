---
title: C++ 结构体
description: C++ 中结构体的定义、使用、数组与嵌套
order: 14
---

# C++ 结构体

结构体是一种自定义数据类型，可以把多个不同类型的数据组合在一起。它非常适合描述现实世界中的复杂对象，比如一个学生、一本书或一个坐标点。

## 为什么需要结构体

假设要描述一个学生，包含姓名、年龄和成绩：

```cpp
string studentName;
int studentAge;
double studentScore;
```

如果有很多学生，就需要很多组变量，管理起来很混乱。使用结构体可以把这些属性封装成一个整体：

```cpp
struct Student
{
    string name;
    int age;
    double score;
};
```

## 结构体的定义

结构体使用 `struct` 关键字定义，大括号内列出各个成员。

```cpp
struct Point
{
    int x;
    int y;
};
```

定义结构体后，就可以像使用基本类型一样使用它：

```cpp
Point p1;
p1.x = 10;
p1.y = 20;
```

## 结构体变量的初始化

结构体变量可以在定义时初始化：

```cpp
Student stu1 = {"Koyuki", 18, 92.5};

// C++11 以后支持更清晰的列表初始化
Student stu2{"Alice", 19, 88.0};
```

## 访问结构体成员

使用点号 `.` 访问结构体成员。

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Student
{
    string name;
    int age;
    double score;
};

int main()
{
    Student stu = {"Koyuki", 18, 92.5};

    cout << "姓名：" << stu.name << endl;
    cout << "年龄：" << stu.age << endl;
    cout << "成绩：" << stu.score << endl;

    return 0;
}
```

运行结果：

```text
姓名：Koyuki
年龄：18
成绩：92.5
```

## 结构体数组

可以定义结构体数组来存储多个同类对象。

```cpp
Student students[3] = {
    {"Koyuki", 18, 92.5},
    {"Alice", 19, 88.0},
    {"Bob", 20, 79.5}
};

for (int i = 0; i < 3; i++)
{
    cout << students[i].name << " " << students[i].score << endl;
}
```

## 结构体嵌套

结构体中可以包含另一个结构体。

```cpp
struct Date
{
    int year;
    int month;
    int day;
};

struct Person
{
    string name;
    Date birthday;
};

int main()
{
    Person person = {"Koyuki", {2006, 9, 15}};

    cout << "姓名：" << person.name << endl;
    cout << "生日：" << person.birthday.year << "-"
         << person.birthday.month << "-"
         << person.birthday.day << endl;

    return 0;
}
```

## 结构体作为函数参数

结构体可以作为函数参数传递。为了避免拷贝整个结构体，通常使用引用传递。

```cpp
void printStudent(const Student& stu)
{
    cout << stu.name << " " << stu.age << " " << stu.score << endl;
}

void setScore(Student& stu, double newScore)
{
    stu.score = newScore;
}
```

`const` 引用用于只读访问，`非 const` 引用用于需要修改结构体内容的场景。

## 结构体与函数返回值

函数也可以返回结构体。

```cpp
Student createStudent(string name, int age, double score)
{
    Student stu;
    stu.name = name;
    stu.age = age;
    stu.score = score;
    return stu;
}
```

## 结构体与指针

可以通过指针访问结构体成员，使用箭头运算符 `->`。

```cpp
Student stu = {"Koyuki", 18, 92.5};
Student* p = &stu;

cout << p->name << endl;   // 等价于 (*p).name
cout << p->age << endl;
```

## 结构体与类的区别

在 C++ 中，结构体 `struct` 和类 `class` 非常相似，主要区别是默认访问权限：

- `struct` 的成员默认是 `public`。
- `class` 的成员默认是 `private`。

除此之外，两者几乎可以互换使用。在只需要封装数据时，`struct` 更简洁。

## 完整示例

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Student
{
    string name;
    int age;
    double score;
};

void printStudent(const Student& stu)
{
    cout << "姓名：" << stu.name << endl;
    cout << "年龄：" << stu.age << endl;
    cout << "成绩：" << stu.score << endl;
    cout << "----------------" << endl;
}

int main()
{
    Student students[3] = {
        {"Koyuki", 18, 92.5},
        {"Alice", 19, 88.0},
        {"Bob", 20, 79.5}
    };

    double total = 0;

    for (int i = 0; i < 3; i++)
    {
        printStudent(students[i]);
        total += students[i].score;
    }

    cout << "平均成绩：" << total / 3 << endl;

    return 0;
}
```

运行结果：

```text
姓名：Koyuki
年龄：18
成绩：92.5
----------------
姓名：Alice
年龄：19
成绩：88
----------------
姓名：Bob
年龄：20
成绩：79.5
----------------
平均成绩：86.6667
```
