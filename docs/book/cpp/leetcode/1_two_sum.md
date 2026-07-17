---
title: LeetCode 1. 两数之和
description: 在数组中寻找和为目标值的两个数，分析暴力、哈希表、双指针等多种解法
order: 1
---

# LeetCode 1. 两数之和

## 题目描述

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出**和为目标值** `target` 的那**两个**整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。你可以按任意顺序返回答案。

### 示例

```text
输入：nums = [2, 7, 11, 15], target = 9
输出：[0, 1]
解释：因为 nums[0] + nums[1] == 9，返回 [0, 1]。
```

```text
输入：nums = [3, 2, 4], target = 6
输出：[1, 2]
```

## 方案一：暴力枚举

### 思路

枚举数组中的每一对数，检查它们的和是否等于 `target`。

### 代码

```cpp
vector<int> twoSum(vector<int>& nums, int target) {
    int n = nums.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }
    return {};
}
```

### 复杂度分析

- 时间复杂度：$O(n^2)$，需要枚举所有两两组合。
- 空间复杂度：$O(1)$，只使用了常数额外空间。

### 优缺点

- **优点**：实现简单，不占用额外空间。
- **缺点**：当数组很大时，$O(n^2)$ 的时间复杂度会非常慢。

## 方案二：两遍哈希表

### 思路

第一遍遍历数组，把每个数的值和下标存入哈希表。第二遍遍历数组，对于每个数 `nums[i]`，在哈希表中查找 `target - nums[i]` 是否存在，且不是当前下标。

### 代码

```cpp
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;

    for (int i = 0; i < nums.size(); i++) {
        seen[nums[i]] = i;
    }

    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement) && seen[complement] != i) {
            return {i, seen[complement]};
        }
    }

    return {};
}
```

### 复杂度分析

- 时间复杂度：$O(n)$，两次线性遍历。
- 空间复杂度：$O(n)$，需要哈希表存储所有元素。

### 优缺点

- **优点**：时间复杂度降为线性，效率显著提升。
- **缺点**：需要遍历两遍数组，且题目保证只有一个答案，两遍遍历略显冗余。

## 方案三：一遍哈希表（最佳方案）

### 思路

在遍历数组的同时，把已经访问过的数存入哈希表。对于当前数 `nums[i]`，先检查哈希表中是否存在 `target - nums[i]`。如果存在，说明之前已经遇到了配对数，直接返回两个下标；如果不存在，就把当前数加入哈希表，继续遍历。

### 代码

```cpp
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;

    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }

    return {};
}
```

### 复杂度分析

- 时间复杂度：$O(n)$，只需遍历一次数组。
- 空间复杂度：$O(n)$，最坏情况下需要存储 $n-1$ 个元素。

### 优缺点

- **优点**：只需一遍遍历，代码更简洁，效率最高。
- **缺点**：需要额外的哈希表空间。如果数组极大数据量固定，可以考虑排序加双指针进一步优化空间。

## 方案四：排序 + 双指针

### 思路

如果题目允许改变数组顺序或返回的是值而不是下标，可以先对数组排序，然后用双指针从两端向中间移动，寻找和为 `target` 的两个数。

### 代码

```cpp
vector<int> twoSum(vector<int>& nums, int target) {
    vector<pair<int, int>> indexed;
    for (int i = 0; i < nums.size(); i++) {
        indexed.push_back({nums[i], i});
    }

    sort(indexed.begin(), indexed.end());

    int left = 0, right = indexed.size() - 1;
    while (left < right) {
        int sum = indexed[left].first + indexed[right].first;
        if (sum == target) {
            return {indexed[left].second, indexed[right].second};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return {};
}
```

### 复杂度分析

- 时间复杂度：$O(n \log n)$，主要来自排序。
- 空间复杂度：$O(n)$，需要存储带下标的副本。

### 优缺点

- **优点**：空间占用稳定，不依赖哈希表。
- **缺点**：时间复杂度不如哈希表法，且需要记录原始下标。

## 方案对比与选择

| 方案 | 时间复杂度 | 空间复杂度 | 适用场景 |
| --- | --- | --- | --- |
| 暴力枚举 | $O(n^2)$ | $O(1)$ | 数据量极小，或不允许额外空间 |
| 两遍哈希表 | $O(n)$ | $O(n)$ | 理解哈希表思路的过渡方案 |
| 一遍哈希表 | $O(n)$ | $O(n)$ | 通用最佳方案 |
| 排序 + 双指针 | $O(n \log n)$ | $O(n)$ | 不允许使用哈希表，或需要返回数值而非下标 |

## 最佳方案详解

一遍哈希表是本题的**最优解**，核心思想是**用空间换时间**。

具体步骤：

1. 创建一个哈希表 `seen`，键是数值，值是该数值对应的下标。
2. 从左到右遍历数组。
3. 对于当前元素 `nums[i]`，计算 `complement = target - nums[i]`。
4. 如果 `complement` 已经在 `seen` 中，说明之前遇到的某个数和当前数配对成功，直接返回 `{seen[complement], i}`。
5. 否则，把 `nums[i]` 和 `i` 存入 `seen`，继续遍历。

为什么这样能找到答案？因为题目保证每种输入只有一个答案，所以当遍历到配对数中的第二个数时，第一个数一定已经在哈希表中了。

### 示例追踪

以 `nums = [3, 2, 4], target = 6` 为例：

| 步骤 | i | nums[i] | complement | seen | 结果 |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 3 | 3 | 空 | 未找到，存入 `{3: 0}` |
| 2 | 1 | 2 | 4 | `{3: 0}` | 未找到，存入 `{3: 0, 2: 1}` |
| 3 | 2 | 4 | 2 | `{3: 0, 2: 1}` | 找到！返回 `[1, 2]` |

## 完整参考代码

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int, int> seen;

    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }

    return {};
}

int main() {
    vector<int> nums = {3, 2, 4};
    int target = 6;

    vector<int> result = twoSum(nums, target);
    cout << result[0] << " " << result[1] << endl;

    return 0;
}
```
