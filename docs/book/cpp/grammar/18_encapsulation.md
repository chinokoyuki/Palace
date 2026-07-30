---
title: 封装
description: C++ 面向对象编程之封装的详细讲解，包括类与对象、访问控制、成员属性与方法、友元、常函数与常对象等
order: 18
---

# 封装

封装是面向对象编程（OOP）的三大特性之一（封装、继承、多态）。它将数据（属性）和操作数据的方法（行为）捆绑在一起，并隐藏对象内部的实现细节，只对外暴露必要的接口。封装的核心价值在于：**降低复杂度、提高安全性、增强可维护性**。

## 封装的概念

### 为什么需要封装

在 C 语言中，数据和操作数据的函数是分离的，任何能够访问到数据的代码都可以随意修改它，这会导致：

- 数据可能被意外修改，难以排查 Bug。
- 修改数据结构时，所有直接访问该数据的地方都需要同步修改。
- 代码的职责不清晰，难以维护。

封装通过以下方式解决这些问题：

1. **数据隐藏**：将内部状态声明为私有，外部无法直接访问。
2. **接口暴露**：提供公共方法来访问或修改内部状态，在方法中加入合法性校验。
3. **实现隐藏**：外部只关心「能做什么」，不关心「怎么做到的」。

### 封装的设计原则

- **公开接口，隐藏实现**：只暴露必要的公共方法，内部实现细节对外不可见。
- **最小权限原则**：能设为 `private` 的就不要设为 `public`。
- **数据与行为绑定**：将相关的数据和操作数据的方法放在同一个类中。

## 类与对象基础

### 结构体到类的演进

C++ 中的 `struct` 和 `class` 都可以定义自定义类型，唯一的区别在于默认访问权限：

- `struct` 默认成员为 `public`。
- `class` 默认成员为 `private`。

```cpp
#include <iostream>
#include <string>
using namespace std;

// 用 struct 定义：默认 public
struct StudentStruct {
    string name;       // 默认 public
    int age;           // 默认 public
};

// 用 class 定义：默认 private
class StudentClass {
    string name;       // 默认 private
    int age;           // 默认 private
};
```

在面向对象编程中，推荐使用 `class`，并显式声明访问权限，使意图更清晰。

### 类的定义与成员

类可以包含两种成员：

- **成员变量（属性）**：描述对象的状态。
- **成员函数（方法）**：描述对象的行为。

```cpp
class Student {
public:
    // 成员函数（方法）
    void setName(const string& n) {
        name = n;
    }

    string getName() const {
        return name;
    }

    void setAge(int a) {
        if (a < 0 || a > 150) {   // 合法性校验
            cout << "年龄不合法！" << endl;
            return;
        }
        age = a;
    }

    int getAge() const {
        return age;
    }

    void display() const {
        cout << "姓名：" << name << "，年龄：" << age << endl;
    }

private:
    // 成员变量（属性）
    string name;
    int age;
};
```

### 对象的创建与使用

```cpp
int main() {
    // 创建对象
    Student s1;
    s1.setName("张三");
    s1.setAge(20);
    s1.display();   // 姓名：张三，年龄：20

    // 通过指针创建（堆区）
    Student* s2 = new Student();
    s2->setName("李四");
    s2->setAge(22);
    s2->display();   // 姓名：李四，年龄：22
    delete s2;       // 记得释放

    return 0;
}
```

### 封装带来的好处

观察上面的 `Student` 类，外部代码无法直接访问 `name` 和 `age`，只能通过 `setName`、`setAge` 等方法间接操作。这意味着：

- `setAge` 中可以加入合法性校验，防止设置 `-5` 岁或 `200` 岁。
- 未来如果内部存储方式从 `int age` 改为 `string birthDate`，只需要修改方法内部实现，外部调用方式不变。
- 外部代码不需要知道对象内部是如何存储数据的，只需要知道「调用 `setAge(20)` 就能设置年龄」。

## 访问控制

C++ 提供三种访问修饰符来控制成员的可见性。

### public、private、protected

| 修饰符 | 类内部 | 派生类（子类） | 外部 |
| --- | --- | --- | --- |
| `public` | 可访问 | 可访问 | 可访问 |
| `protected` | 可访问 | 可访问 | 不可访问 |
| `private` | 可访问 | 不可访问 | 不可访问 |

```cpp
class AccessExample {
public:
    int publicVar;         // 任何地方都可访问

protected:
    int protectedVar;       // 本类和子类可访问

private:
    int privateVar;        // 仅本类可访问
};
```

### 访问修饰符的作用范围

一个类中可以有多个 `public`、`protected`、`private` 段落，每个修饰符的作用范围从声明处开始，直到下一个修饰符出现或类定义结束：

```cpp
class MixedAccess {
    int a;              // 默认 private（class 默认）

public:
    int b;              // public

private:
    int c;              // private

public:
    int d;              // public
};
```

### 设置和获取（Getter / Setter）

封装的标准做法是将成员变量设为 `private`，并提供 `get` 和 `set` 方法来控制访问：

```cpp
class BankAccount {
public:
    void setBalance(double b) {
        if (b < 0) {
            cout << "余额不能为负数！" << endl;
            return;
        }
        balance = b;
    }

    double getBalance() const {
        return balance;
    }

    void setPassword(const string& pwd) {
        if (pwd.length() < 6) {
            cout << "密码长度不能少于 6 位！" << endl;
            return;
        }
        password = pwd;
    }

    // 密码通常不提供 getter
    // string getPassword() const { return password; }

private:
    double balance;
    string password;
};
```

上例中，密码字段只提供了 `set` 方法而不提供 `get` 方法，这是一种常见的「只写」封装策略，用于防止敏感信息被外部读取。

### 只读属性

如果某些属性只在构造时设置，之后不再修改，可以通过将 `set` 方法省略来实现只读：

```cpp
class Person {
public:
    Person(const string& n, int a) : name(n), age(a) {}

    string getName() const { return name; }
    int getAge() const { return age; }

private:
    const string name;
    int age;
};
```

## 成员函数的类内与类外定义

### 类内定义

在类定义内部直接给出函数实现，编译器可能会将其当作内联函数处理：

```cpp
class Point {
public:
    int getX() const { return x; }    // 类内定义
    int getY() const { return y; }    // 类内定义

private:
    int x;
    int y;
};
```

### 类外定义

在类外使用 `类名::函数名` 的语法定义，需要用 `::` 作用域解析运算符指明所属类：

```cpp
// 头文件 point.h
class Point {
public:
    int getX() const;
    int getY() const;
    void setX(int x);
    void setY(int y);

private:
    int x;
    int y;
};

// 源文件 point.cpp
int Point::getX() const {
    return x;
}

int Point::getY() const {
    return y;
}

void Point::setX(int val) {
    x = val;
}

void Point::setY(int val) {
    y = val;
}
```

### 类内声明 + 类外定义的优势

在实际项目中，通常将类的声明放在头文件（`.h`），将实现放在源文件（`.cpp`），这样做的好处是：

- 隐藏实现细节，只对外暴露接口。
- 减少编译依赖，修改实现时不需要重新编译所有依赖该头文件的文件。
- 便于多文件协作开发。

## 构造函数与析构函数

构造函数和析构函数是封装中管理对象生命周期的关键机制。

### 构造函数

构造函数在对象创建时自动调用，用于初始化成员变量。它的名字与类名相同，没有返回值类型。

```cpp
class Person {
public:
    // 无参构造
    Person() : name("无名"), age(0) {}

    // 有参构造
    Person(const string& n, int a) : name(n), age(a) {}

    // 拷贝构造
    Person(const Person& other) : name(other.name), age(other.age) {}

    void display() const {
        cout << name << ", " << age << endl;
    }

private:
    string name;
    int age;
};
```

### 初始化列表

初始化列表在对象创建时直接初始化成员变量，比在构造函数体内赋值更高效（尤其对于 `const` 成员和引用成员，必须使用初始化列表）：

```cpp
class Configuration {
public:
    Configuration(const string& path, int maxConn)
        : configPath(path)              // const 成员，必须用初始化列表
        , maxConnections(maxConn)
        , logStream(&defaultLog)        // 引用成员，必须用初始化列表
    {}

private:
    const string configPath;
    int maxConnections;
    ostream& logStream;
    ostream defaultLog;
};
```

### 析构函数

析构函数在对象销毁时自动调用，用于释放资源。它的名字是 `~类名`，没有参数和返回值：

```cpp
class FileHandler {
public:
    FileHandler(const string& filename) {
        file = fopen(filename.c_str(), "r");
        if (!file) {
            throw runtime_error("无法打开文件");
        }
    }

    ~FileHandler() {
        if (file) {
            fclose(file);
        }
    }

private:
    FILE* file;
};
```

## 友元

封装的原则是「外部不能直接访问私有成员」，但有时确实需要让某些外部函数或类访问私有成员。C++ 提供 `friend` 关键字来打破封装的边界，但应谨慎使用。

### 友元函数

```cpp
class Box {
public:
    Box(double l, double w, double h) : length(l), width(w), height(h) {}

    // 声明友元函数
    friend double calcVolume(const Box& b);

private:
    double length;
    double width;
    double height;
};

// 友元函数可以直接访问 Box 的私有成员
double calcVolume(const Box& b) {
    return b.length * b.width * b.height;
}

int main() {
    Box box(3.0, 4.0, 5.0);
    cout << "体积：" << calcVolume(box) << endl;   // 60
    return 0;
}
```

### 友元类

```cpp
class Engine;   // 前置声明

class Car {
public:
    Car(int hp) : horsepower(hp) {}

    // 声明 Engine 为友元类
    friend class Engine;

private:
    int horsepower;
};

class Engine {
public:
    void showCarHP(const Car& car) {
        // 可以直接访问 Car 的私有成员
        cout << "马力：" << car.horsepower << endl;
    }
};
```

### 友元的注意事项

- 友元关系是单向的：`A` 声明 `B` 是友元，不意味着 `B` 也声明 `A` 是友元。
- 友元关系不能被继承。
- 友元关系不能传递：`A` 是 `B` 的友元，`B` 是 `C` 的友元，不意味着 `A` 是 `C` 的友元。
- 过度使用友元会破坏封装，应优先考虑通过公共接口访问。

## 常函数与常对象

### 常成员函数（const 成员函数）

在成员函数声明末尾加上 `const`，表示该函数不会修改对象的状态。常函数内部不能修改任何非 `mutable` 的成员变量。

```cpp
class Temperature {
public:
    Temperature(double t) : temp(t) {}

    // 常函数：不修改对象状态
    double getTemp() const {
        return temp;
    }

    // 非常函数：修改对象状态
    void setTemp(double t) {
        temp = t;
    }

private:
    double temp;
};
```

### 常对象

用 `const` 修饰的对象称为常对象。常对象只能调用常函数，不能调用非常函数：

```cpp
void test() {
    Temperature t1(36.5);
    t1.setTemp(37.0);     // 普通对象：可以调用非常函数
    t1.getTemp();         // 普通对象：可以调用常函数

    const Temperature t2(100.0);
    // t2.setTemp(50.0); // 编译错误：常对象不能调用非常函数
    t2.getTemp();         // 正确：常对象可以调用常函数
}
```

### mutable 关键字

如果某个成员变量即使在常函数中也需要被修改，可以用 `mutable` 修饰：

```cpp
class Cache {
public:
    Cache() : cacheValid(false), cachedValue(0) {}

    int getValue() const {
        if (!cacheValid) {
            cachedValue = computeExpensiveValue();
            cacheValid = true;      // mutable 成员可在常函数中修改
        }
        return cachedValue;
    }

private:
    mutable bool cacheValid;        // mutable：可在常函数中修改
    mutable int cachedValue;

    int computeExpensiveValue() const {
        return 42;
    }
};
```

## this 指针

`this` 指针指向当前对象自身的指针。在成员函数内部，所有的成员变量访问都隐式地通过 `this` 指针进行。

### 基本用法

```cpp
class Player {
public:
    Player(string name, int hp) {
        // this 用于区分成员变量和参数
        this->name = name;
        this->hp = hp;
    }

    Player& addHP(int amount) {
        this->hp += amount;
        return *this;   // 返回对象自身的引用，支持链式调用
    }

    void display() const {
        cout << this->name << " HP: " << this->hp << endl;
    }

private:
    string name;
    int hp;
};

int main() {
    Player p("战士", 100);
    p.addHP(50).addHP(30);   // 链式调用
    p.display();             // 战士 HP: 180
    return 0;
}
```

### 返回 *this 实现链式调用

返回 `*this` 是封装中常见的技巧，让多个 `set` 方法可以连续调用：

```cpp
class StringBuilder {
public:
    StringBuilder& append(const string& s) {
        data += s;
        return *this;
    }

    StringBuilder& append(int n) {
        data += to_string(n);
        return *this;
    }

    string toString() const {
        return data;
    }

private:
    string data;
};

int main() {
    StringBuilder sb;
    sb.append("Hello").append(", ").append(2024).append("!");
    cout << sb.toString() << endl;   // Hello, 2024!
    return 0;
}
```

## 封装实战案例：学生管理系统

下面通过一个完整的「学生管理」类来展示封装在实际项目中的应用。

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Student {
public:
    // 构造函数
    Student(int id, const string& name, int age, double score)
        : id(id), name(name), age(age), score(score) {}

    // Getter
    int getId() const { return id; }
    string getName() const { return name; }
    int getAge() const { return age; }
    double getScore() const { return score; }

    // Setter（带校验）
    void setName(const string& n) {
        if (n.empty()) {
            cout << "姓名不能为空！" << endl;
            return;
        }
        name = n;
    }

    void setAge(int a) {
        if (a < 0 || a > 150) {
            cout << "年龄不合法！" << endl;
            return;
        }
        age = a;
    }

    void setScore(double s) {
        if (s < 0 || s > 100) {
            cout << "分数不合法！" << endl;
            return;
        }
        score = s;
    }

    void display() const {
        cout << "[" << id << "] " << name
             << " 年龄:" << age
             << " 分数:" << score << endl;
    }

private:
    const int id;        // 学号：只读，构造后不可修改
    string name;
    int age;
    double score;
};

class StudentManager {
public:
    void addStudent(const Student& s) {
        students.push_back(s);
    }

    bool removeStudent(int id) {
        for (auto it = students.begin(); it != students.end(); ++it) {
            if (it->getId() == id) {
                students.erase(it);
                return true;
            }
        }
        return false;
    }

    Student* findStudent(int id) {
        for (auto& s : students) {
            if (s.getId() == id) {
                return &s;
            }
        }
        return nullptr;
    }

    void displayAll() const {
        if (students.empty()) {
            cout << "暂无学生记录" << endl;
            return;
        }
        for (const auto& s : students) {
            s.display();
        }
    }

    double getAverageScore() const {
        if (students.empty()) return 0;
        double total = 0;
        for (const auto& s : students) {
            total += s.getScore();
        }
        return total / students.size();
    }

private:
    vector<Student> students;
};

int main() {
    StudentManager manager;

    manager.addStudent(Student(1, "张三", 20, 85.5));
    manager.addStudent(Student(2, "李四", 21, 92.0));
    manager.addStudent(Student(3, "王五", 19, 78.5));

    cout << "所有学生：" << endl;
    manager.displayAll();

    cout << "\n平均分：" << manager.getAverageScore() << endl;

    Student* s = manager.findStudent(2);
    if (s) {
        s->setScore(95.0);
        cout << "\n修改后：" << endl;
        s->display();
    }

    manager.removeStudent(1);
    cout << "\n删除学号1后：" << endl;
    manager.displayAll();

    return 0;
}
```

上述代码中：

- `Student` 类将学号设为 `const`，保证只读；姓名、年龄、分数通过 `set` 方法修改并做合法性校验。
- `StudentManager` 类内部用 `vector` 存储 `Student`，但外部不需要知道存储方式，只通过 `addStudent`、`removeStudent`、`findStudent` 等方法操作。
- 如果未来把 `vector` 换成 `map` 或链表，外部调用方式完全不需要改变，这就是封装的价值。

## 封装的设计建议

1. **成员变量默认 `private`**：除非有充分理由，否则所有成员变量都应设为 `private` 或 `protected`。
2. **提供最小化的公共接口**：只暴露必要的公共方法，不要把内部实现方法暴露出去。
3. **Getter/Setter 加校验**：在 `set` 方法中加入数据合法性检查，防止非法数据进入对象。
4. **合理使用 `const`**：不修改对象状态的成员函数应声明为 `const`，便于常对象调用。
5. **慎用友元**：友元会破坏封装，只有在确实需要且无法通过公共接口实现时才使用。
6. **接口与实现分离**：在大型项目中，将类声明放在头文件、实现放在源文件，降低编译依赖。
7. **避免暴露内部容器**：如果类内部用 `vector` 存储数据，不要直接返回 `vector` 的引用，而应提供迭代器或专门的访问方法。

## 本章小结

封装是面向对象编程的基础。它通过访问控制将内部实现与外部接口分离，使得对象能够：

- 保护内部数据不被外部随意修改。
- 在接口不变的前提下自由修改内部实现。
- 通过 `Getter/Setter` 或更丰富的公共方法控制外部对数据的访问方式。

掌握封装后，后续的继承和多态才能在坚实的基础上展开。
