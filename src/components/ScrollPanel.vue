<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import type { FatePoint } from '../utils/divination';

const props = defineProps<{
  fateData: FatePoint[];
  birthYear: number;
}>();

const chartRef = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

const currentDetail = ref<FatePoint | null>(null);

function initChart() {
  if (!chartRef.value) return;
  if (myChart) myChart.dispose();
  
  myChart = echarts.init(chartRef.value);
  updateChart();

  myChart.on('click', (params) => {
    showDetail(params.dataIndex);
  });

  window.addEventListener('resize', handleResize);
}

function handleResize() {
  myChart?.resize();
}

function showDetail(idx: number) {
  if (props.fateData && props.fateData[idx]) {
    currentDetail.value = props.fateData[idx];
  }
}

function updateChart() {
  if (!myChart || !props.fateData.length) return;

  const data = props.fateData;
  const xData = data.map(v => v.age);
  const values = data.map(v => [v.open, v.close, v.low, v.high]);

  const colorUp = '#a8362d';   // 朱红
  const colorDown = '#4a6c7c'; // 黛蓝

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent', // 透出背景纸纹
    grid: { left: 10, right: 10, top: 30, bottom: 20 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: '#8c8577', type: 'dashed' } },
      backgroundColor: 'rgba(255, 253, 245, 0.95)',
      borderColor: '#8c8577',
      textStyle: { color: '#2b2b2b', fontFamily: 'KaiTi' },
      formatter: (params: any) => {
        if (params[0]) {
            // ECharts tooltip formatter side-effect to update external UI is tricky
            // because tooltip might be triggered by hover.
            // The original code did `showDetail` in formatter.
            // We can do it, but usually it's better to just let tooltip show info.
            // However, the original UI updates the "Detail Area" at the bottom on hover/click.
            // Let's stick to the original behavior: update detail on hover (via formatter side effect? or 'showTip' event?)
            // 'axisPointer' changes might be better to listen to, or just keep the side effect if simple.
            // Be careful with reactivity loops.
            showDetail(params[0].dataIndex);
        }
        return ''; 
      }
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLine: { lineStyle: { color: '#8c8577' } },
      axisLabel: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      scale: true,
      splitLine: { show: false }, // 去除网格，像画
      axisLabel: { show: false }
    },
    dataZoom: [
      { type: 'inside', start: 0, end: 50 }, 
      { type: 'slider', bottom: 5, borderColor: 'transparent', handleStyle:{color: colorUp}, dataBackground:{lineStyle:{opacity:0}, areaStyle:{opacity:0}} }
    ],
    series: [{
      type: 'candlestick',
      data: values,
      itemStyle: {
        color: colorUp,
        color0: colorDown,
        borderColor: colorUp,
        borderColor0: colorDown
      },
      barWidth: '60%'
    }]
  };

  myChart.setOption(option);
  // Initialize detail view with the first data point
  showDetail(0);
}

watch(() => props.fateData, () => {
  if (myChart) {
    updateChart();
  } else {
    initChart();
  }
}, { deep: true });

onMounted(() => {
  if (props.fateData.length > 0) {
    initChart();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  myChart?.dispose();
});
</script>

<template>
  <div class="scroll-panel">
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>

    <div class="chart-area">
      <div ref="chartRef" style="width: 100%; height: 100%;"></div>
    </div>
    
    <div class="detail-area">
      <div class="age-display">
        <div class="age-num">{{ currentDetail ? currentDetail.age : '--' }}</div>
        <div class="age-label">岁</div>
        <div style="font-size:0.8rem; margin-top:5px; color:#666">
          {{ currentDetail ? (props.birthYear + currentDetail.age) + '年' : '----年' }}
        </div>
      </div>
      <div class="story-display">
        <div class="trend-tag">
           {{ currentDetail ? (currentDetail.isUp ? '运势上行' : '运势下行') : '等待推演' }}
        </div>
        <div class="story-event">
            {{ currentDetail ? currentDetail.event : '点击上方图卷，查看流年运势' }}
        </div>
        <div class="story-quote">
            {{ currentDetail ? currentDetail.quote : '“万般皆是命，半点不由人”' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- 2. 流年图卷（右侧面板） --- */
.scroll-panel {
  /* display: none; -> handled by v-if/v-show in parent or here */
  /* The original logic hides it initially and fades it in. */
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  position: relative;
  /* opacity handled by transition in parent or here if we want animation on mount */
}

/* 装饰角花 */
.corner {
  position: absolute; width: 20px; height: 20px;
  border-style: solid; border-color: var(--ink);
  pointer-events: none;
}
.tl { top: 5px; left: 5px; border-width: 2px 0 0 2px; }
.tr { top: 5px; right: 5px; border-width: 2px 2px 0 0; }
.bl { bottom: 5px; left: 5px; border-width: 0 0 2px 2px; }
.br { bottom: 5px; right: 5px; border-width: 0 2px 2px 0; }

/* K线图区域 */
.chart-area {
  flex: 2;
  padding: 10px;
  position: relative;
  background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}

/* 详情区域 */
.detail-area {
  flex: 1;
  border-top: 2px solid var(--ink);
  padding: 20px;
  display: flex;
  gap: 20px;
  background: rgba(184, 148, 92, 0.05); /* 淡淡的金 */
}

.age-display {
  width: 80px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.age-num { font-size: 2.5rem; font-weight: bold; color: var(--cinnabar); }
.age-label { font-size: 0.9rem; color: var(--ink); }

.story-display { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.story-event { font-size: 1.1rem; font-weight: bold; margin-bottom: 10px; color: var(--ink); }
.story-quote { 
  font-size: 1rem; color: var(--indigo); 
  font-style: italic; 
  border-left: 3px solid var(--gold); 
  padding-left: 10px; 
}
.trend-tag {
  display: inline-block; padding: 2px 8px; 
  border: 1px solid var(--border-color); 
  font-size: 0.75rem; margin-bottom: 5px; width: fit-content;
}

/* 移动端适配 */
@media (max-width: 768px) {
  :global(body.active) .scroll-panel {
      order: 1;
      height: 60vh; /* 使用视口高度而不是固定像素 */
      min-height: 400px; /* 保证最小高度 */
      width: 100%;
  }
  .detail-area { 
    flex-direction: column; 
    text-align: center; 
    padding: 15px; /* 减少内边距 */
    gap: 10px;
  }
  .age-display { 
    width: 100%; 
    border-right: none; 
    border-bottom: 1px solid var(--border-color); 
    padding-bottom: 5px; 
    margin-bottom: 5px; 
    flex-direction: row; 
    gap: 10px;
    align-items: baseline; /* 对齐 */
  }
  .age-num { font-size: 2rem; } /* 稍微调小字体 */
  .story-quote { text-align: left; font-size: 0.9rem; }
  .story-event { font-size: 1rem; margin-bottom: 5px; }
}
</style>
