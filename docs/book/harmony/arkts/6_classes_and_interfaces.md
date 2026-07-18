---
title: ArkTS 类与接口
description: ArkTS 类、构造函数、继承、访问修饰符及接口定义
order: 6
---

# ArkTS 类与接口

类与接口是面向对象编程的核心概念。本章介绍 ArkTS 中如何定义类、使用接口，以及访问修饰符和继承等特性。

## 类的定义

使用 `class` 关键字定义类。

```typescript
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  introduce(): string {
    return `我叫${this.name}，今年${this.age}岁`;
  }
}

let person = new Person('Koyuki', 20);
console.log(person.introduce());
```

## 访问修饰符

ArkTS 支持三种访问修饰符：

| 修饰符 | 说明 |
| --- | --- |
| `public` | 公有，任何地方都可以访问（默认） |
| `private` | 私有，只能在类内部访问 |
| `protected` | 受保护，只能在类内部和子类中访问 |

```typescript
class BankAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
    }
  }

  getBalance(): number {
    return this.balance;
  }
}

let account = new BankAccount();
account.deposit(100);
console.log(account.getBalance());  // 100
// console.log(account.balance);    // 错误，balance 是私有的
```

## 继承

使用 `extends` 实现继承，使用 `super` 调用父类成员。

```typescript
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(): void {
    console.log(`${this.name}在移动`);
  }
}

class Dog extends Animal {
  bark(): void {
    console.log('汪汪汪');
  }
}

let dog = new Dog('小黄');
dog.move();
dog.bark();
```

## 接口

接口用于定义对象的结构或类的行为规范。

### 对象接口

```typescript
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

let task: Task = {
  id: 1,
  title: '学习 ArkTS',
  completed: false,
};
```

### 可选属性与只读属性

```typescript
interface Product {
  readonly id: number;
  name: string;
  price?: number;
}

let book: Product = {
  id: 1001,
  name: 'HarmonyOS 开发指南',
};

// book.id = 1002;  // 错误，id 是只读的
```

### 接口继承

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

let myDog: Dog = {
  name: '小黄',
  breed: '金毛',
};
```

## 本章小结

- 使用 `class` 定义类，`constructor` 定义构造函数。
- 访问修饰符控制成员的访问范围。
- 使用 `extends` 实现继承。
- 接口用于描述对象结构，支持可选属性和只读属性。
