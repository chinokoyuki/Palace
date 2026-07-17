export interface BookSection {
  text: string
  collapsed?: boolean
  items: { text: string; link: string }[]
}

export interface Book {
  title: string
  desc: string
  link: string
  sidebars: Record<string, BookSection[]>
}

export interface BookCategory {
  title: string
  books: Book[]
}

const cppSideBar: BookSection[] = [
  {
    text: '语法',
    collapsed: false,
    items: [
      { text: '介绍', link: '/book/cpp/grammar/1_hello' },
      { text: '基础语法', link: '/book/cpp/grammar/2_basic_syntax' },
      { text: '注释', link: '/book/cpp/grammar/3_comments' },
      { text: '数据类型', link: '/book/cpp/grammar/4_data_types' },
      { text: '变量类型', link: '/book/cpp/grammar/5_variable_types' },
      { text: '变量作用域', link: '/book/cpp/grammar/6_variable_scope' },
      { text: '常量', link: '/book/cpp/grammar/7_constants' },
      { text: '修饰符类型', link: '/book/cpp/grammar/8_type_modifiers' },
      { text: '运算符', link: '/book/cpp/grammar/9_operators' },
      { text: '流程结构', link: '/book/cpp/grammar/10_flow_structure' },
      { text: '数组', link: '/book/cpp/grammar/11_arrays' },
      { text: '函数', link: '/book/cpp/grammar/12_functions' },
      { text: '指针', link: '/book/cpp/grammar/13_pointers' },
      { text: '结构体', link: '/book/cpp/grammar/14_structures' },
    ],
  },
  {
    text: 'LeetCode',
    collapsed: true,
    items: [
      { text: '1. 两数之和', link: '/book/cpp/leetcode/1_two_sum' },
      { text: '2. 两数相加', link: '/book/cpp/leetcode/2_add_two_numbers' },
      { text: '3. 无重复字符的最长子串', link: '/book/cpp/leetcode/3_longest_substring' },
    ]
  }
]

const stm32HalSidBar: BookSection[] = [
  {
    text: '教程',
    collapsed: false,
    items: [
      { text: '入门', link: '/book/embedded/stm32-hal/1_hello' },
      { text: 'GPIO 通用输入输出', link: '/book/embedded/stm32-hal/2_gpio' },
      { text: '串口通信 UART/USART', link: '/book/embedded/stm32-hal/3_uart' },
      { text: 'I2C 总线通信', link: '/book/embedded/stm32-hal/4_i2c' },
      { text: '时钟系统', link: '/book/embedded/stm32-hal/5_clock' },
      { text: 'SPI 总线通信', link: '/book/embedded/stm32-hal/6_spi' },
      { text: '中断与 NVIC', link: '/book/embedded/stm32-hal/7_interrupt' },
      { text: '定时器与 PWM', link: '/book/embedded/stm32-hal/8_timer' },
      { text: 'ADC 模数转换', link: '/book/embedded/stm32-hal/9_adc' },
    ]
  }
]

/**
 * 所有书本数据。
 *
 * 添加新书只需在本文件里：
 * 1. 新建一个 Book 对象；
 * 2. 把它放进对应的分类（BookCategory）里；
 * 3. 在 sidebars 里声明它需要的侧边栏路径。
 *
 * BooksPage.vue 和 config.ts 的 sidebar 都会自动从这里读取。
 */
export const bookCategories: BookCategory[] = [
  {
    title: '程序语言',
    books: [
      {
        title: 'C++',
        desc: 'C++ 语言开发与实践',
        link: '/book/cpp/grammar/1_hello',
        sidebars: {
          '/book/cpp/grammar/': cppSideBar,
          '/book/cpp/leetcode/': cppSideBar
        },
      },
    ],
  },
  {
    title: '嵌入式',
    books: [
      {
        title: 'STM32-HAL',
        desc: '基于HAL库的STM32嵌入式开发与实践',
        link: '/book/embedded/stm32-hal/1_hello',
        sidebars: {
          '/book/embedded/stm32-hal': stm32HalSidBar
        }
      }
    ]
  }
]

/**
 * 根据书本数据生成 VitePress 的 sidebar 配置。
 */
export const bookSidebars: Record<string, BookSection[]> = bookCategories.reduce(
  (acc, category) => {
    category.books.forEach((book) => {
      Object.entries(book.sidebars).forEach(([path, sections]) => {
        acc[path] = sections
      })
    })
    return acc
  },
  {} as Record<string, BookSection[]>,
)
