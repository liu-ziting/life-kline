<script setup lang="ts">
import { ref } from 'vue';
import type { Bazi } from '../utils/divination';

const props = defineProps<{
  bazi: Bazi | null;
}>();

const emit = defineEmits<{
  (e: 'divine', data: { name: string; gender: string; place: string; date: string; time: string }): void;
}>();

const name = ref('');
const gender = ref('1');
const place = ref('中原');
const date = ref('2000-01-01');
const time = ref('09:00');

function handleDivine() {
  if (!name.value) {
    alert("请赐下尊姓大名");
    return;
  }
  emit('divine', {
    name: name.value,
    gender: gender.value,
    place: place.value,
    date: date.value,
    time: time.value
  });
}
</script>

<template>
  <div class="fate-book">
    <div class="book-title">批注命书</div>
    
    <div class="form-group">
      <label class="form-label">姓名 / Name</label>
      <input type="text" class="form-input" v-model="name" placeholder="请输入姓名">
    </div>

    <div class="form-row">
      <div class="form-group" style="flex:1">
        <label class="form-label">乾坤 / Gender</label>
        <select class="form-input" v-model="gender">
          <option value="1">乾造 (男)</option>
          <option value="0">坤造 (女)</option>
        </select>
      </div>
      <div class="form-group" style="flex:1">
        <label class="form-label">籍贯 / Place</label>
        <input type="text" class="form-input" v-model="place">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group" style="flex:1">
        <label class="form-label">生辰 / Date</label>
        <input type="date" class="form-input" v-model="date">
      </div>
      <div class="form-group" style="flex:1">
        <label class="form-label">时辰 / Time</label>
        <input type="time" class="form-input" v-model="time">
      </div>
    </div>

    <button class="seal-btn" @click="handleDivine">天机推演</button>

    <!-- 八字结果 -->
    <div class="bazi-box" v-if="props.bazi">
      <div class="bazi-grid">
        <div><div class="pillar-label">年柱</div><div class="pillar">{{ props.bazi.y }}</div></div>
        <div><div class="pillar-label">月柱</div><div class="pillar">{{ props.bazi.m }}</div></div>
        <div><div class="pillar-label">日柱</div><div class="pillar">{{ props.bazi.d }}</div></div>
        <div><div class="pillar-label">时柱</div><div class="pillar">{{ props.bazi.h }}</div></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- 1. 命书（输入面板） --- */
.fate-book {
  width: 100%;
  max-width: 380px;
  background: var(--bg-panel);
  border: 2px solid var(--ink);
  padding: 30px 20px;
  position: relative;
  /* 双重边框模拟古籍 */
  box-shadow: 
      0 0 0 4px var(--bg-panel), 
      0 0 0 6px var(--border-color),
      10px 10px 20px var(--shadow);
  transition: all 0.6s ease;
  z-index: 10;
}

/* Parent body.active styles need to be handled by parent or passed down. 
   Actually, scoped styles might not reach if the parent class changes.
   We can use :global() or just rely on the prop to change class/style if needed.
   However, the original CSS used `body.active .fate-book`.
   I'll use a deep selector or just global styles for this specific state if possible,
   or better, handle the layout change in the parent container.
   The `fate-book` itself changes style when active. 
   I'll add a prop or class for active state.
*/

:global(body.active) .fate-book {
  max-width: 100%;
  height: 100%;
  border-radius: 0;
  box-shadow: none;
  border: 1px solid var(--border-color);
  background: rgba(255, 253, 245, 0.8);
}

/* Mobile adaptation */
@media (max-width: 768px) {
  :global(body.active) .fate-book {
      order: 2;
      margin-top: 20px;
      border: none; border-top: 2px solid var(--ink);
  }
}

.book-title {
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
  color: var(--cinnabar);
}

/* 表单样式改造：下划线风格 */
.form-group { margin-bottom: 20px; }
.form-label { font-size: 0.9rem; color: #666; margin-bottom: 5px; display: block; }

.form-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--ink);
  background: transparent;
  border-radius: 0;
  padding: 8px 0;
  font-size: 1.1rem;
  color: var(--ink);
  font-family: inherit;
  outline: none;
  transition: border-color 0.3s;
}
.form-input:focus { border-bottom: 2px solid var(--cinnabar); }

.form-row { display: flex; gap: 15px; }

/* 印章按钮 */
.seal-btn {
  display: block;
  width: 120px;
  height: 120px;
  margin: 30px auto 0;
  background: var(--cinnabar);
  color: #fff;
  border: none;
  border-radius: 4px; /* 轻微圆角 */
  font-family: "Songti SC", serif;
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(168, 54, 45, 0.4);
  /* 印章纹理模拟 */
  background-image: url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23902015' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-rl; /* 竖排文字 */
  text-orientation: upright;
  letter-spacing: 5px;
  border: 3px double #ffbaba;
}
.seal-btn:active { transform: scale(0.95); opacity: 0.9; }

@media (max-width: 768px) {
  .seal-btn { width: 100%; height: 50px; writing-mode: horizontal-tb; letter-spacing: 5px; margin-top: 20px;}
}

/* 八字展示 */
.bazi-box {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px dashed var(--border-color);
  /* display: none; -> handled by v-if */
  text-align: center;
}
.bazi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
.pillar { writing-mode: vertical-rl; margin: 0 auto; font-size: 1.2rem; font-weight: bold; color: var(--ink); letter-spacing: 5px; }
.pillar-label { writing-mode: horizontal-tb; font-size: 0.7rem; color: #888; margin-bottom: 5px; }
</style>
