<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface Props {
  option: Record<string, any>
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '460px',
})

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: any = null
let resizeObserver: ResizeObserver | null = null

async function initChart() {
  if (!chartRef.value) return

  const echarts = await import('echarts')
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.option, true)

  resizeObserver = new ResizeObserver(() => {
    chartInstance && chartInstance.resize()
  })
  resizeObserver.observe(chartRef.value)
}

function updateChart() {
  if (chartInstance) {
    chartInstance.setOption(props.option, true)
  }
}

onMounted(() => {
  nextTick(initChart)
})

onUnmounted(() => {
  if (resizeObserver && chartRef.value) {
    resizeObserver.unobserve(chartRef.value)
  }
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

watch(() => props.option, updateChart, { deep: true })
</script>
