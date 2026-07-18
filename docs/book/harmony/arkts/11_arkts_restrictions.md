---
title: ArkTS 严格模式限制
description: ArkTS 严格模式下的语法限制与 TypeScript 差异
order: 11
---

# ArkTS 严格模式限制

ArkTS 并非 TypeScript 的简单超集，而是一个**严格子集**。为了支持 AOT 编译、跨线程 Sendable 和 UI 状态追踪，ArkTS 禁用了许多 TypeScript 中的动态特性。本章系统梳理 ArkTS 严格模式下的主要限制。

## 设计理念

ArkTS 所有限制的核心目标只有一个：**让编译器在编译期就能确定每个变量的精确类型和内存布局**。所有看似"不合理"的限制都可以从这个目标推导出来：

- 禁 `any` → 编译期类型不能含糊
- 对象字面量要带类型 → 编译期要知道内存布局
- class 字段必须有默认值 → 编译期要确定内存布局
- 名义类型而非结构类型 → 编译器要能区分两个长得一样的 class

## 禁止 any / unknown

`any` 和 `unknown` 会让所有类型检查失效，编译器无法进行 AOT 优化。

```typescript
// ❌ 禁止
// let data: any = fetchData();
// let result: unknown = JSON.parse(str);

// ✅ 使用明确类型
let data: string = fetchData();
let result: Object = JSON.parse(str);
```

如果确实需要宽松类型，可以使用 `Object` 作为"逃生口"，但这会丢失类型精度，应尽量避免。

## 禁止 as 类型断言

ArkTS 不支持 `as` 类型断言语法。

```typescript
// ❌ 禁止
// let value: string = someValue as string;

// ✅ 使用显式类型声明或函数参数类型
let value: string = someValue;
```

## 禁止 for...in

ArkTS 中对象布局在编译时确定，不支持使用 `for...in` 迭代对象属性。

```typescript
// ❌ 禁止
// for (let key in obj) { ... }

// ✅ 遍历数组使用 for 或 for...of
let arr: string[] = ['a', 'b', 'c'];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

## 对象字面量必须带显式类型

每个对象字面量必须对应一个显式声明的 class 或 interface。

```typescript
// ❌ 禁止
// let obj = { x: 1, y: 2 };

// ✅ 正确写法
interface Point {
  x: number;
  y: number;
}
let obj: Point = { x: 1, y: 2 };
```

这也适用于函数参数和返回值中的对象字面量：

```typescript
// ❌ 禁止
// someFunction({ color: 'red', size: 16 });

// ✅ 正确写法
interface Config {
  color: string;
  size: number;
}
let config: Config = { color: 'red', size: 16 };
someFunction(config);
```

## 名义类型系统

ArkTS 采用名义类型系统（Nominal Typing），而非 TypeScript 的结构类型系统（Structural Typing）。即使两个类的结构完全相同，也不可以互赋值。

```typescript
class A { x: number = 0 }
class B { x: number = 0 }

// ❌ ArkTS 中禁止（TypeScript 中合法）
// let b: B = new A();

// ✅ 必须通过继承建立类型关系
class Base { x: number = 0 }
class A extends Base {}
class B extends Base {}
let a: Base = new A();  // 合法，A 是 Base 的子类
```

## 禁止动态特性

以下动态特性在 ArkTS 中全部禁止：

| 特性 | 说明 |
| --- | --- |
| `eval()` | 动态执行代码 |
| `new Function()` | 动态创建函数 |
| `with` 语句 | 动态作用域 |
| 动态属性访问 `obj[key]` | key 为变量时禁止 |
| 删除属性 `delete obj.prop` | 运行时修改对象布局 |
| 修改原型 `Object.prototype` | 运行时修改继承链 |

```typescript
// ❌ 以下全部禁止
// eval("console.log('x')");
// new Function("return 1");
// with (obj) { console.log(x); }
// let key = 'name'; obj[key];
// delete obj.prop;
```

## class 字段必须初始化

ArkTS 要求 class 的字段必须有初始值，确保编译器能确定内存布局。

```typescript
// ❌ 禁止
// class Person {
//   name: string;  // 没有初始值
// }

// ✅ 正确写法
class Person {
  name: string = '';
  age: number = 0;
}
```

## 逗号运算符限制

逗号运算符仅允许在 `for` 循环的初始化和更新表达式中使用。

```typescript
// ✅ 允许
for (let i = 0, j = 0; i < 10; i++, j += 2) {
  // ...
}

// ❌ 其他地方禁止
// let x = (++a, a++);
```

## 限制速查表

| 规则 | 关键字 | 说明 |
| --- | --- | --- |
| 禁止 any/unknown | `arkts-no-any-unknown` | 必须使用明确类型 |
| 禁止 as 断言 | `arkts-no-as-const` | 使用显式类型声明 |
| 禁止 for...in | `arkts-no-for-in` | 使用 for 或 for...of |
| 对象字面量需类型 | `arkts-no-untyped-obj-literals` | 必须声明 interface 或 class |
| 名义类型 | `arkts-no-structural-type` | 结构相同不可互赋值 |
| 禁止动态特性 | `arkts-no-dynamic-*` | 禁 eval/with/动态属性访问 |

## 本章小结

- ArkTS 是 TypeScript 的严格子集，禁止了大量动态特性。
- 核心目标：编译期确定类型和内存布局。
- 常见限制：禁 any/unknown、禁 as 断言、禁 for...in、对象字面量需类型、名义类型系统。
- 遇到不理解的限制，可以从"编译期需要精确类型信息"这个原则来推导原因。
