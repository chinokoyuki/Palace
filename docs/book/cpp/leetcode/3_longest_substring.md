---
title: LeetCode 3. 无重复字符的最长子串
description: 使用滑动窗口寻找不含重复字符的最长子串长度
order: 3
---

# LeetCode 3. 无重复字符的最长子串

## 题目描述

给定一个字符串 `s`，请你找出其中**不含有重复字符**的**最长子串**的长度。

### 示例

```text
输入：s = "abcabcbb"
输出：3
解释：因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

```text
输入：s = "bbbbb"
输出：1
解释：因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

```text
输入：s = "pwwkew"
输出：3
解释：因为无重复字符的最长子串是 "wke"，所以其长度为 3。
```

## 方案一：暴力枚举

### 思路

枚举字符串的所有子串，检查每个子串是否含有重复字符，记录最长的不重复子串长度。

### 代码

```cpp
bool hasUniqueChars(const string& s, int start, int end) {
    vector<bool> seen(256, false);
    for (int i = start; i <= end; i++) {
        unsigned char ch = s[i];
        if (seen[ch]) {
            return false;
        }
        seen[ch] = true;
    }
    return true;
}

int lengthOfLongestSubstring(string s) {
    int n = s.size();
    int maxLen = 0;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            if (hasUniqueChars(s, i, j)) {
                maxLen = max(maxLen, j - i + 1);
            }
        }
    }

    return maxLen;
}
```

### 复杂度分析

- 时间复杂度：$O(n^3)$，枚举所有子串需要 $O(n^2)$，检查每个子串需要 $O(n)$。
- 空间复杂度：$O(1)$，使用固定大小的数组判断重复。

### 优缺点

- **优点**：思路直接，容易理解。
- **缺点**：时间复杂度过高，对于较长字符串会超时，不适合实际使用。

## 方案二：滑动窗口 + 集合

### 思路

维护一个窗口 `[left, right]`，窗口内的字符都是不重复的。用集合记录窗口中的字符。

- 如果 `s[right]` 不在集合中，把它加入集合，右指针右移，更新最大长度。
- 如果 `s[right]` 已经在集合中，说明出现了重复，需要把左指针右移，直到重复字符被移出窗口。

### 代码

```cpp
#include <unordered_set>

int lengthOfLongestSubstring(string s) {
    unordered_set<char> window;
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.size(); right++) {
        while (window.count(s[right])) {
            window.erase(s[left]);
            left++;
        }
        window.insert(s[right]);
        maxLen = max(maxLen, right - left + 1);
    }

    return maxLen;
}
```

### 复杂度分析

- 时间复杂度：$O(2n) = O(n)$，每个字符最多被左指针和右指针各访问一次。
- 空间复杂度：$O(\min(m, n))$，其中 $m$ 是字符集大小，$n$ 是字符串长度。

### 优缺点

- **优点**：时间复杂度降为线性，思路清晰。
- **缺点**：使用集合维护窗口中的字符，每次移动左指针都要从集合中删除字符。

## 方案三：优化滑动窗口 + 哈希表（最佳方案）

### 思路

用哈希表记录每个字符**最近一次出现的位置**。当发现 `s[right]` 在当前窗口内重复时，直接把 `left` 跳到重复字符的下一个位置，而不是逐个移动左指针。

### 代码

```cpp
int lengthOfLongestSubstring(string s) {
    vector<int> lastIndex(256, -1);
    int maxLen = 0;
    int left = 0;

    for (int right = 0; right < s.size(); right++) {
        unsigned char ch = s[right];

        // 如果字符在当前窗口内出现过，收缩左边界
        if (lastIndex[ch] >= left) {
            left = lastIndex[ch] + 1;
        }

        // 更新字符最近出现的位置
        lastIndex[ch] = right;

        // 更新最大长度
        maxLen = max(maxLen, right - left + 1);
    }

    return maxLen;
}
```

### 复杂度分析

- 时间复杂度：$O(n)$，只需要遍历一次字符串。
- 空间复杂度：$O(m)$，$m$ 是字符集大小。对于 ASCII 字符，固定为 256。

### 优缺点

- **优点**：每个字符只访问一次，左指针跳跃式移动，效率最高。
- **缺点**：需要额外数组记录字符位置，空间占用与字符集大小相关。

## 方案对比与选择

| 方案 | 时间复杂度 | 空间复杂度 | 是否推荐 |
| --- | --- | --- | --- |
| 暴力枚举 | $O(n^3)$ | $O(1)$ | 不推荐，会超时 |
| 滑动窗口 + 集合 | $O(n)$ | $O(m)$ | 可作为过渡理解 |
| 优化滑动窗口 + 哈希表 | $O(n)$ | $O(m)$ | 推荐，最佳方案 |

## 最佳方案详解

优化滑动窗口是本题的标准解法，核心思想是**用空间换时间，快速跳过重复部分**。

### 关键观察

对于一个不含重复字符的子串，当右指针遇到一个已经在窗口中出现过的字符时，左指针可以直接跳到该重复字符上次出现位置的下一个位置。因为重复字符之前的所有字符都不可能再出现在当前合法子串中了。

### 为什么 `lastIndex[ch] >= left`？

`lastIndex[ch]` 记录的是字符 `ch` 最近一次出现的位置。如果这个位置在当前窗口 `[left, right]` 内，即 `lastIndex[ch] >= left`，说明 `ch` 在当前窗口中重复了，需要收缩左边界。

如果 `lastIndex[ch] < left`，说明 `ch` 虽然之前出现过，但已经不在当前窗口中了，不需要收缩。

### 示例追踪

以 `s = "abcabcbb"` 为例：

| right | ch | left | lastIndex | 当前窗口 | maxLen |
| --- | --- | --- | --- | --- | --- |
| 0 | a | 0 | a:0 | a | 1 |
| 1 | b | 0 | a:0, b:1 | ab | 2 |
| 2 | c | 0 | a:0, b:1, c:2 | abc | 3 |
| 3 | a | 1 | a:3, b:1, c:2 | bca | 3 |
| 4 | b | 2 | a:3, b:4, c:2 | cab | 3 |
| 5 | c | 3 | a:3, b:4, c:5 | abc | 3 |
| 6 | b | 5 | a:3, b:6, c:5 | cb | 3 |
| 7 | b | 7 | a:3, b:7, c:5 | b | 3 |

最终结果为 3。

## 完整参考代码

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    vector<int> lastIndex(256, -1);
    int maxLen = 0;
    int left = 0;

    for (int right = 0; right < s.size(); right++) {
        unsigned char ch = s[right];

        if (lastIndex[ch] >= left) {
            left = lastIndex[ch] + 1;
        }

        lastIndex[ch] = right;
        maxLen = max(maxLen, right - left + 1);
    }

    return maxLen;
}

int main() {
    string s = "abcabcbb";
    cout << lengthOfLongestSubstring(s) << endl;  // 输出 3

    return 0;
}
```
