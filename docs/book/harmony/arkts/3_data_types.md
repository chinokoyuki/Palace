---
title: ArkTS 数据类型
description: ArkTS 基本数据类型、数组、对象、枚举、联合类型及类型推断
order: 3
---

# ArkTS 数据类型

ArkTS 是一门强类型语言，每个变量都应该有明确的类型。本章介绍常用的基本类型、复杂类型以及类型相关的高级特性。

## 基本数据类型

### number

数字类型，包括整数和浮点数。

```typescript
let age: number = 18;
let price: number = 19.99;
```

### string

字符串类型，使用单引号或双引号包裹。

```typescript
let name: string = 'Koyuki';
let intro: string = "HarmonyOS 开发者";
```

模板字符串可以嵌入变量：

```typescript
let version: number = 4.0;
let info: string = `HarmonyOS ${version}`;
```

### boolean

布尔类型，取值为 `true` 或 `false`。

```typescript
let isOnline: boolean = true;
```

### undefined 和 null

```typescript
let empty: null = null;
let notSet: undefined = undefined;
```

## 数组

数组用于存储多个相同类型的值。

```typescript
let scores: number[] = [85, 90, 78];
let names: Array<string> = ['Alice', 'Bob', 'Carol'];
```

访问数组元素：

```typescript
console.log(scores[0]);  // 85
scores[1] = 95;
```

## 对象类型

使用接口或类型别名定义对象结构。

```typescript
interface User {
  id: number;
  name: string;
  isVip?: boolean;  // 可选属性
}

let user: User = {
  id: 1,
  name: 'Koyuki',
};
```

## 枚举

枚举用于定义一组有名字的常量。

```typescript
enum Color {
  Red,
  Green,
  Blue,
}

let favorite: Color = Color.Blue;
```

## 联合类型

一个变量可以是多种类型之一。

```typescript
let value: string | number = 'hello';
value = 100;
```

## 类型推断

ArkTS 会根据赋值自动推断类型，因此很多情况下可以省略类型注解。

```typescript
let count = 10;        // 推断为 number
let title = 'ArkTS';   // 推断为 string
```

:::tip
虽然类型推断很方便，但在函数参数和类属性中建议显式声明类型，以提高代码可读性。
:::

## ArkTS 类型系统特殊规则

### 禁止 any 和 unknown

ArkTS 严格模式下禁止使用 `any` 和 `unknown` 类型，所有变量必须有明确类型。

```typescript
// ❌ ArkTS 中不允许
// let data: any = fetchData();
// let result: unknown = JSON.parse(str);

// ✅ 正确写法：使用明确类型
let data: string = fetchData();
let result: Object = JSON.parse(str);
```

### 禁止 as 类型断言

ArkTS 不支持 `as` 类型断言语法，应使用显式类型声明代替。

```typescript
// ❌ ArkTS 中不允许
// let input: string = 'hello';
// let length: number = (input as string).length;

// ✅ 正确写法：使用显式类型
let input: string = 'hello';
let length: number = input.length;
```

### 对象字面量必须带类型

ArkTS 要求每个对象字面量必须有显式的类型声明（对应一个已声明的 class 或 interface）。

```typescript
// ❌ ArkTS 中不允许
// let obj = { x: 1, y: 2 };

// ✅ 正确写法
interface Point {
  x: number;
  y: number;
}
let obj: Point = { x: 1, y: 2 };
```

### 名义类型系统

ArkTS 采用名义类型系统，即使两个类的结构完全相同，也不可以互赋值。

```typescript
class A { x: number = 0 }
class B { x: number = 0 }

// ❌ ArkTS 中不允许（TypeScript 中合法，因为结构相同）
// let b: B = new A();

// ✅ 必须使用继承或显式类型转换
class C extends A {}
let c: C = new C();  // 合法
```

## 本章小结

- 基本类型：`number`、`string`、`boolean`、`null`、`undefined`。
- 复杂类型：数组、对象、枚举、联合类型。
- ArkTS 支持类型推断，但禁止 `any`/`unknown` 和 `as` 类型断言。
- 对象字面量必须有显式类型声明。
- ArkTS 采用名义类型系统，结构相同不等于类型兼容。
