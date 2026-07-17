---
title: LeetCode 2. 两数相加
description: 用链表模拟两个逆序整数相加，分析迭代、递归等多种解法
order: 2
---

# LeetCode 2. 两数相加

## 题目描述

给你两个**非空**的链表，表示两个非负的整数。它们每位数字都是按照**逆序**的方式存储的，并且每个节点只能存储**一位**数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

### 示例

```text
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807。
```

```text
输入：l1 = [0], l2 = [0]
输出：[0]
```

## 链表节点定义

```cpp
struct ListNode {
    int value;
    ListNode *next;
    ListNode() : value(0), next(nullptr) {}
    ListNode(int x) : value(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : value(x), next(next) {}
};
```

## 方案一：迭代法（最佳方案）

### 思路

模拟小学竖式加法的过程。从两个链表的头节点开始，逐位相加，同时维护一个进位值 `carry`。

具体步骤：

1. 创建一个哨兵节点 `dummy`，用于简化头节点的处理。
2. 用尾指针 `cur` 指向新链表的最后一个节点。
3. 循环直到 `l1`、`l2` 都为空且没有进位：
   - 把当前进位 `carry` 加入总和。
   - 如果 `l1` 不为空，加上 `l1->value`，并把 `l1` 后移。
   - 如果 `l2` 不为空，加上 `l2->value`，并把 `l2` 后移。
   - 新节点的值为 `sum % 10`，新的进位为 `sum / 10`。
   - 把新节点接到 `cur` 后面，并移动 `cur`。
4. 返回 `dummy.next`。

### 代码

```cpp
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* cur = &dummy;
    int carry = 0;

    while (l1 || l2 || carry) {
        int sum = carry;

        if (l1) {
            sum += l1->value;
            l1 = l1->next;
        }
        if (l2) {
            sum += l2->value;
            l2 = l2->next;
        }

        carry = sum / 10;
        cur->next = new ListNode(sum % 10);
        cur = cur->next;
    }

    return dummy.next;
}
```

### 复杂度分析

- 时间复杂度：$O(\max(m, n))$，其中 $m$ 和 $n$ 分别是两个链表的长度。
- 空间复杂度：$O(\max(m, n))$，新链表的长度最多为 $\max(m, n) + 1$。

### 优缺点

- **优点**：逻辑清晰，只需要一次遍历，是面试和实际应用中的标准写法。
- **缺点**：需要手动管理链表内存，容易忘记释放造成内存泄漏。

## 方案二：递归法

### 思路

递归地处理两个链表的当前节点，并把进位传递到下一层递归。

### 代码

```cpp
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2, int carry = 0) {
    if (!l1 && !l2 && carry == 0) {
        return nullptr;
    }

    int sum = carry;
    if (l1) {
        sum += l1->value;
        l1 = l1->next;
    }
    if (l2) {
        sum += l2->value;
        l2 = l2->next;
    }

    ListNode* node = new ListNode(sum % 10);
    node->next = addTwoNumbers(l1, l2, sum / 10);
    return node;
}
```

### 复杂度分析

- 时间复杂度：$O(\max(m, n))$。
- 空间复杂度：$O(\max(m, n))$，包括递归调用栈空间和结果链表空间。

### 优缺点

- **优点**：代码简洁，更符合数学归纳的思维方式。
- **缺点**：递归深度受栈空间限制，链表很长时可能导致栈溢出。同时，递归调用栈也占用了额外空间。

## 方案三：先转数字再相加（不推荐）

### 思路

先把两个链表表示的数字转换成整数，相加后再把结果转换回链表。

### 代码

```cpp
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    long long num1 = 0, num2 = 0;
    long long base = 1;

    while (l1) {
        num1 += l1->value * base;
        base *= 10;
        l1 = l1->next;
    }

    base = 1;
    while (l2) {
        num2 += l2->value * base;
        base *= 10;
        l2 = l2->next;
    }

    long long sum = num1 + num2;

    ListNode dummy(0);
    ListNode* cur = &dummy;

    if (sum == 0) {
        return new ListNode(0);
    }

    while (sum > 0) {
        cur->next = new ListNode(sum % 10);
        cur = cur->next;
        sum /= 10;
    }

    return dummy.next;
}
```

### 复杂度分析

- 时间复杂度：$O(\max(m, n))$。
- 空间复杂度：$O(\max(m, n))$。

### 优缺点

- **优点**：思路直观，容易理解。
- **缺点**：当链表很长时，整数会溢出。即使使用 `long long`，也无法处理超长的链表。因此这道题的标准解法不推荐这种思路。

## 方案对比与选择

| 方案 | 时间复杂度 | 空间复杂度 | 是否推荐 |
| --- | --- | --- | --- |
| 迭代法 | $O(\max(m, n))$ | $O(\max(m, n))$ | 推荐，最佳方案 |
| 递归法 | $O(\max(m, n))$ | $O(\max(m, n))$ | 可作为练习，但生产环境慎用 |
| 转数字法 | $O(\max(m, n))$ | $O(\max(m, n))$ | 不推荐，存在溢出风险 |

## 最佳方案详解

迭代法是本题的标准解法，它的核心思想是**模拟手工加法**。

为什么要使用哨兵节点 `dummy`？因为新链表的第一个节点是在循环中创建的，如果不用哨兵节点，需要单独处理头节点的初始化，代码会更复杂。使用 `dummy` 后，可以统一处理所有节点，最后返回 `dummy.next` 即可。

循环条件为什么要写成 `l1 || l2 || carry`？

- 当两个链表都遍历完，但还有进位时，必须再创建一个节点存储进位。例如 `l1 = [5], l2 = [5]`，相加后得到 `[0, 1]`，最后的 `1` 就是由进位产生的。

### 示例追踪

以 `l1 = [2,4,3], l2 = [5,6,4]` 为例：

| 步骤 | l1 | l2 | carry | sum | 新节点 | 新 carry |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 2 | 5 | 0 | 7 | 7 | 0 |
| 2 | 4 | 6 | 0 | 10 | 0 | 1 |
| 3 | 3 | 4 | 1 | 8 | 8 | 0 |

最终结果为 `[7, 0, 8]`。

## 完整参考代码

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int value;
    ListNode *next;
    ListNode() : value(0), next(nullptr) {}
    ListNode(int x) : value(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : value(x), next(next) {}
};

ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* cur = &dummy;
    int carry = 0;

    while (l1 || l2 || carry) {
        int sum = carry;

        if (l1) {
            sum += l1->value;
            l1 = l1->next;
        }
        if (l2) {
            sum += l2->value;
            l2 = l2->next;
        }

        carry = sum / 10;
        cur->next = new ListNode(sum % 10);
        cur = cur->next;
    }

    return dummy.next;
}

// 辅助函数：从数组创建链表
ListNode* createList(const vector<int>& nums) {
    ListNode dummy;
    ListNode* cur = &dummy;
    for (int num : nums) {
        cur->next = new ListNode(num);
        cur = cur->next;
    }
    return dummy.next;
}

// 辅助函数：打印链表
void printList(ListNode* head) {
    cout << "[";
    while (head) {
        cout << head->value;
        if (head->next) cout << ",";
        head = head->next;
    }
    cout << "]" << endl;
}

// 辅助函数：释放链表内存
void deleteList(ListNode* head) {
    while (head) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
    }
}

int main() {
    ListNode* l1 = createList({2, 4, 3});
    ListNode* l2 = createList({5, 6, 4});

    ListNode* result = addTwoNumbers(l1, l2);
    printList(result);  // 期望 [7,0,8]

    deleteList(l1);
    deleteList(l2);
    deleteList(result);

    return 0;
}
```
