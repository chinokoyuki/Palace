<template>
  <div class="kp-books-page">
    <div class="kp-books-header">
      <h1 class="kp-books-title">Library</h1>
      <p class="kp-books-subtitle">选择一本开始阅读</p>
    </div>

    <div class="kp-category-tabs">
      <button
        v-for="title in categoryTitles"
        :key="title"
        class="kp-category-tab"
        :class="{ active: activeCategory === title }"
        @click="activeCategory = title"
      >
        {{ title }}
      </button>
    </div>

    <template v-for="category in bookCategories" :key="category.title">
      <section
        v-if="activeCategory === '全部' || activeCategory === category.title"
        class="kp-book-category"
      >
        <h2 v-if="activeCategory === '全部'" class="kp-category-title">
          {{ category.title }}
        </h2>
        <div class="kp-books-grid">
          <a
            v-for="book in category.books"
            :key="book.link"
            :href="book.link"
            class="kp-book-card"
          >
            <div class="kp-book-spine"></div>
            <div class="kp-book-info">
              <h3 class="kp-book-title">{{ book.title }}</h3>
              <p class="kp-book-desc">{{ book.desc }}</p>
            </div>
          </a>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { bookCategories } from '../data/books'

const activeCategory = ref<string>('全部')
const categoryTitles = computed(() => ['全部', ...bookCategories.map((c) => c.title)])
</script>

<style scoped>
.kp-books-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.kp-books-header {
  text-align: center;
  margin-bottom: 40px;
}

.kp-books-title {
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 700;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #8FD3FF, #3BA7FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
}

.kp-books-subtitle {
  margin: 0;
  font-size: 18px;
  color: var(--vp-c-text-2);
}

.kp-category-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 48px;
}

.kp-category-tab {
  padding: 8px 22px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 200ms cubic-bezier(0.16, 1, 0.3, 1),
    color 200ms cubic-bezier(0.16, 1, 0.3, 1),
    background 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.kp-category-tab:hover {
  border-color: var(--kp-future-blue);
  color: var(--kp-future-blue);
}

.kp-category-tab.active {
  background: var(--kp-future-blue);
  border-color: var(--kp-future-blue);
  color: #ffffff;
}

.kp-book-category + .kp-book-category {
  margin-top: 56px;
}

.kp-category-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-border);
}

.kp-books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.kp-book-card {
  display: flex;
  align-items: stretch;
  padding: 0;
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  text-decoration: none;
  overflow: hidden;
  transition: border-color 200ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.kp-book-card:hover {
  border-color: #3BA7FF;
  box-shadow: 0 0 0 1px #3BA7FF, 0 16px 40px rgba(59, 167, 255, 0.15);
  transform: translateY(-2px);
}

.dark .kp-book-card:hover {
  box-shadow: 0 0 0 1px #3BA7FF, 0 16px 40px rgba(59, 167, 255, 0.12);
}

.kp-book-spine {
  width: 12px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #8FD3FF, #3BA7FF);
}

.kp-book-info {
  padding: 24px;
  flex: 1;
}

.kp-book-title {
  margin: 0 0 8px;
  font-size: 18px;
  color: var(--vp-c-text-1);
}

.kp-book-desc {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .kp-books-page {
    padding: 24px 16px 64px;
  }

  .kp-books-header {
    margin-bottom: 28px;
  }

  .kp-books-subtitle {
    font-size: 15px;
  }

  .kp-category-tabs {
    gap: 8px;
    margin-bottom: 32px;
  }

  .kp-category-tab {
    padding: 6px 16px;
    font-size: 13px;
  }

  .kp-book-category + .kp-book-category {
    margin-top: 40px;
  }

  .kp-category-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .kp-books-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .kp-book-info {
    padding: 18px;
  }

  .kp-book-title {
    font-size: 16px;
  }

  .kp-book-desc {
    font-size: 13px;
    line-height: 1.55;
  }
}
</style>
