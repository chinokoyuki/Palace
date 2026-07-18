---
title: ArkTS 函数
description: ArkTS 函数声明、参数、返回值、箭头函数及回调函数
order: 5
---

# ArkTS 函数

函数是组织代码的基本单元。本章介绍 ArkTS 中函数的定义方式、参数处理、返回值以及箭头函数等特性。

## 函数声明

使用 `function` 关键字声明函数。

```typescript
function add(a: number, b: number): number {
  return a + b;
}

let result: number = add(2, 3);
console.log(result);  // 5
```

## 参数类型

### 必填参数

```typescript
function greet(name: string): void {
  console.log('Hello, ' + name);
}

greet('Koyuki');
```

### 默认参数

```typescript
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}`;
}

console.log(greet('Koyuki'));           // Hello, Koyuki
console.log(greet('Koyuki', 'Hi'));     // Hi, Koyuki
```

### 可选参数

```typescript
function buildUser(name: string, age?: number): string {
  if (age !== undefined) {
    return `${name}, ${age}岁`;
  }
  return name;
}
```

:::warning
可选参数必须放在必填参数之后。
:::

## 返回值

函数可以返回任意类型。如果没有返回值，使用 `void`。

```typescript
function logMessage(msg: string): void {
  console.log(msg);
}
```

## 箭头函数

箭头函数提供了一种更简洁的函数写法。

```typescript
let multiply = (a: number, b: number): number => {
  return a * b;
};

// 单行函数体可省略 return 和大括号
let square = (x: number): number => x * x;
```

箭头函数常用于回调场景：

```typescript
let numbers: number[] = [1, 2, 3, 4];
let doubled: number[] = numbers.map((n: number) => n * 2);
console.log(doubled);  // [2, 4, 6, 8]
```

## 函数作为参数

ArkTS 支持把函数作为参数传递。

```typescript
function processData(data: number[], handler: (item: number) => number): number[] {
  return data.map(handler);
}

let result: number[] = processData([1, 2, 3], (x) => x + 10);
console.log(result);  // [11, 12, 13]
```

## 本章小结

- 函数使用 `function` 关键字声明，需指定参数和返回值类型。
- 支持默认参数和可选参数。
- 箭头函数简洁，适合回调和简单逻辑。
- 函数可以作为参数传递。
