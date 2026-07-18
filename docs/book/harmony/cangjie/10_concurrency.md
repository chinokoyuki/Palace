---
title: 仓颉并发编程
description: 仓颉用户态线程、Future、并发对象与线程安全
order: 10
---

# 仓颉并发编程

仓颉采用轻量化用户态线程模型，线程创建和调度开销极低。配合并发对象库，可以轻松实现线程安全的并发编程。

## 创建线程

使用 `spawn` 关键字创建仓颉线程：

```cangjie
main() {
    spawn {
        println("子线程执行")
    }
    println("主线程执行")
}
```

`spawn` 返回 `Future<T>` 对象，表示线程的执行结果：

```cangjie
main() {
    let fut = spawn {
        42
    }
    println(fut.get())  // 42，get() 阻塞等待结果
}
```

## Future

`Future<T>` 是仓颉中表示异步计算结果的核心类型。

### 获取结果

`get()` 方法阻塞当前线程，直到计算完成：

```cangjie
let fut = spawn {
    sleep(Duration.second)
    "完成"
}
let result = fut.get()  // 阻塞等待
println(result)
```

### 线程名称

```cangjie
let fut = spawn {
    println("线程名：${Thread.currentThread.name}")
}
fut.thread.name = "Worker-1"  // 设置线程名
```

### 取消线程

```cangjie
let future = spawn {
    while (true) {
        if (Thread.currentThread.hasPendingCancellation) {
            return 0  // 响应取消请求
        }
    }
    return 1
}

future.cancel()       // 发送取消请求
let res = future.get()
println(res)          // 0
```

## 线程同步

### Mutex 互斥锁

```cangjie
import std.sync.*

var counter = 0
let mutex = Mutex()

func increment(): Unit {
    synchronized(mutex) {
        counter++
    }
}

main() {
    let futures = Array<Future<Unit>>()
    for (i in 0..100) {
        futures.append(spawn { increment() })
    }
    for (fut in futures) {
        fut.get()
    }
    println(counter)  // 100
}
```

### Semaphore 信号量

```cangjie
import std.sync.*

let semaphore = Semaphore(3)  // 允许 3 个线程同时访问

func accessResource(id: Int64): Unit {
    semaphore.acquire()
    println("线程 ${id} 获取资源")
    sleep(100 * Duration.millisecond)
    println("线程 ${id} 释放资源")
    semaphore.release()
}
```

### ReentrantMutex 可重入锁

```cangjie
import std.sync.*

let lock = ReentrantMutex()

func outer(): Unit {
    synchronized(lock) {
        inner()  // 同一线程可以再次获取
    }
}

func inner(): Unit {
    synchronized(lock) {
        println("可重入锁")
    }
}
```

## 并发对象

仓颉提供线程安全的并发对象，无需手动加锁即可在多线程中使用。

### AtomicInt64 原子整数

```cangjie
import std.sync.*

let counter = AtomicInt64(0)

func increment(): Unit {
    counter.fetchAdd(1)
}

main() {
    let futures = Array<Future<Unit>>()
    for (i in 0..1000) {
        futures.append(spawn { increment() })
    }
    for (fut in futures) {
        fut.get()
    }
    println(counter.load())  // 1000
}
```

常用原子操作：

| 方法 | 说明 |
| --- | --- |
| `load()` | 读取值 |
| `store(value)` | 设置值 |
| `fetchAdd(delta)` | 原子加，返回旧值 |
| `fetchSub(delta)` | 原子减，返回旧值 |
| `compareExchange(expected, desired)` | CAS 操作 |

### 并发队列

```cangjie
import std.collection.concurrent.*

let queue = ConcurrentQueue<Int64>()

// 生产者
queue.enqueue(1)
queue.enqueue(2)

// 消费者
let value = queue.dequeue()  // Some(1)
```

## Channel 通道

Channel 用于线程间的数据传递：

```cangjie
import std.sync.*

let channel = Channel<Int64>()

main() {
    // 生产者线程
    spawn {
        for (i in 0..5) {
            channel.send(i)
        }
    }

    // 消费者线程
    spawn {
        for (i in 0..5) {
            let value = channel.receive()
            println("收到：${value}")
        }
    }
}
```

## ThreadLocal

`ThreadLocal` 为每个线程提供独立的变量副本：

```cangjie
import std.sync.*

let threadLocal = ThreadLocal<Int64>()

main() {
    threadLocal.set(100)

    let fut = spawn {
        threadLocal.set(200)
        println("子线程：${threadLocal.get()}")  // 200
    }
    fut.get()

    println("主线程：${threadLocal.get()}")  // 100
}
```

## sleep 休眠

```cangjie
sleep(Duration.second)           // 休眠 1 秒
sleep(100 * Duration.millisecond) // 休眠 100 毫秒
```

## 本章小结

- 使用 `spawn` 创建轻量用户态线程，返回 `Future<T>`。
- `Future.get()` 阻塞等待结果，`cancel()` 取消线程。
- 使用 `Mutex`、`Semaphore` 进行线程同步。
- 并发对象（`AtomicInt64`、`ConcurrentQueue`）提供无锁线程安全操作。
- `Channel` 用于线程间数据传递，`ThreadLocal` 提供线程私有变量。
