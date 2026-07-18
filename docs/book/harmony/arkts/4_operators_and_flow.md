---
title: ArkTS 运算符与流程控制
description: ArkTS 常用运算符、条件语句与循环语句
order: 4
---

# ArkTS 运算符与流程控制

本章介绍 ArkTS 中用于数据计算和逻辑控制的运算符与流程控制语句。

## 算术运算符

```typescript
let a: number = 10;
let b: number = 3;

console.log(a + b);  // 13
console.log(a - b);  // 7
console.log(a * b);  // 30
console.log(a / b);  // 3.333...
console.log(a % b);  // 1
```

## 赋值运算符

```typescript
let x: number = 10;
x += 5;  // x = 15
x -= 3;  // x = 12
x *= 2;  // x = 24
x /= 4;  // x = 6
```

## 比较运算符

```typescript
let a: number = 5;
let b: number = 10;

console.log(a == b);   // false
console.log(a != b);   // true
console.log(a > b);    // false
console.log(a < b);    // true
console.log(a >= b);   // false
console.log(a <= b);   // true
```

:::tip
ArkTS 中推荐使用 `===` 和 `!==` 进行严格相等比较，避免类型转换带来的意外结果。
:::

## 逻辑运算符

```typescript
let isLogin: boolean = true;
let isAdmin: boolean = false;

console.log(isLogin && isAdmin);  // false
console.log(isLogin || isAdmin);  // true
console.log(!isLogin);            // false
```

## 条件语句

### if / else

```typescript
let score: number = 85;

if (score >= 90) {
  console.log('优秀');
} else if (score >= 80) {
  console.log('良好');
} else {
  console.log('继续努力');
}
```

### 三元运算符

```typescript
let age: number = 18;
let result: string = age >= 18 ? '成年人' : '未成年人';
```

### switch

```typescript
let level: string = 'B';

switch (level) {
  case 'A':
    console.log('优秀');
    break;
  case 'B':
    console.log('良好');
    break;
  default:
    console.log('其他');
}
```

## 循环语句

### for 循环

```typescript
for (let i: number = 0; i < 5; i++) {
  console.log(i);
}
```

### for...of

```typescript
let fruits: string[] = ['apple', 'banana', 'orange'];

for (let fruit of fruits) {
  console.log(fruit);
}
```

### while 循环

```typescript
let count: number = 0;

while (count < 3) {
  console.log(count);
  count++;
}
```

### do...while 循环

`do...while` 至少执行一次循环体，再判断条件。

```typescript
let num: number = 0;

do {
  console.log(num);
  num++;
} while (num < 3);
```

### for...in（ArkTS 中禁止使用）

ArkTS 中对象布局在编译时确定，不支持使用 `for...in` 迭代对象属性。遍历数组应使用 `for` 或 `for...of`。

```typescript
// ❌ ArkTS 中不允许
// for (let key in obj) { ... }

// ✅ 遍历数组使用 for 或 for...of
let arr: string[] = ['a', 'b', 'c'];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

## 跳转语句

```typescript
for (let i: number = 0; i < 10; i++) {
  if (i == 3) {
    continue;  // 跳过当前迭代
  }
  if (i == 6) {
    break;     // 终止循环
  }
  console.log(i);
}
```

## 本章小结

- 算术、赋值、比较、逻辑运算符与主流编程语言一致。
- 条件语句包括 `if/else`、`switch` 和三元运算符。
- 循环语句包括 `for`、`for...of`、`while` 和 `do...while`。
- ArkTS 中禁止使用 `for...in` 循环。
