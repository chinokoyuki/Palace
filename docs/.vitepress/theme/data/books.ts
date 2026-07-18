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
      { text: '内存模型', link: '/book/cpp/grammar/15_memory_model' },
      { text: '引用', link: '/book/cpp/grammar/16_references' },
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
  },
  {
    text: 'HAL 方法详解',
    collapsed: false,
    items: [
      { text: 'GPIO 方法', link: '/book/embedded/stm32-hal/methods/gpio' },
      { text: 'UART 方法', link: '/book/embedded/stm32-hal/methods/uart' },
      { text: 'I2C 方法', link: '/book/embedded/stm32-hal/methods/i2c' },
      { text: 'SPI 方法', link: '/book/embedded/stm32-hal/methods/spi' },
      { text: '定时器方法', link: '/book/embedded/stm32-hal/methods/timer' },
      { text: 'ADC 方法', link: '/book/embedded/stm32-hal/methods/adc' },
      { text: 'NVIC 方法', link: '/book/embedded/stm32-hal/methods/nvic' },
      { text: '系统方法', link: '/book/embedded/stm32-hal/methods/system' },
    ]
  }
]

const pythonSideBar: BookSection[] = [
  {
    text: '语法',
    collapsed: false,
    items: [
      { text: '介绍', link: '/book/python/grammar/1_introduction' },
      { text: '基础语法', link: '/book/python/grammar/2_basic_syntax' },
      { text: '注释', link: '/book/python/grammar/3_comments' },
      { text: '数据类型', link: '/book/python/grammar/4_data_types' },
      { text: '变量', link: '/book/python/grammar/5_variables' },
      { text: '运算符', link: '/book/python/grammar/6_operators' },
      { text: '列表', link: '/book/python/grammar/7_lists' },
      { text: '字典', link: '/book/python/grammar/8_dictionaries' },
      { text: 'for 循环', link: '/book/python/grammar/9_for_loops' },
      { text: 'while 循环', link: '/book/python/grammar/10_while_loops' },
      { text: '格式化字符串', link: '/book/python/grammar/11_formatted_strings' },
      { text: '函数', link: '/book/python/grammar/12_functions' },
      { text: '引入模块', link: '/book/python/grammar/13_importing_modules' },
      { text: '类', link: '/book/python/grammar/14_classes' },
      { text: '文件', link: '/book/python/grammar/15_files' },
      { text: '报错处理', link: '/book/python/grammar/16_exceptions' },
      { text: '测试', link: '/book/python/grammar/17_testing' },
      { text: '模块', link: '/book/python/grammar/18_modules' },
      { text: '包', link: '/book/python/grammar/19_packages' },
      { text: 'JSON 数据格式转换', link: '/book/python/grammar/20_json' },
    ],
  },
]

const dsSideBar: BookSection[] = [
  {
    text: '绪论',
    collapsed: false,
    items: [
      { text: '1.1 数据结构的基本概念', link: '/book/ds/intro/1_1_basic_concepts' },
      { text: '1.2 算法和算法评价', link: '/book/ds/intro/1_2_algorithm' },
    ],
  },
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
      {
        title: 'Python',
        desc: 'Python 语言开发与实践',
        link: '/book/python/grammar/1_introduction',
        sidebars: {
          '/book/python/grammar/': pythonSideBar,
        },
      },
    ],
  },
  {
    title: '计算机',
    books: [
      {
        title: '数据结构',
        desc: '数据结构与算法基础',
        link: '/book/ds/intro/1_1_basic_concepts',
        sidebars: {
          '/book/ds/': dsSideBar,
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
