<script setup lang="ts">
import { ref, watch } from 'vue'
import FateBook from './components/FateBook.vue'
import ScrollPanel from './components/ScrollPanel.vue'
import { getBazi, generateFate, type Bazi, type FatePoint } from './utils/divination'
import { AIService } from './services/aiService'

const isActive = ref(false)
const isLoading = ref(false)
const fateData = ref<FatePoint[]>([])
const bazi = ref<Bazi | null>(null)
const birthYear = ref(2000)

const aiService = new AIService()

watch(isActive, val => {
    if (val) {
        document.body.classList.add('active')
    } else {
        document.body.classList.remove('active')
    }
})

async function handleDivine(data: { name: string; gender: string; place: string; date: string; time: string }) {
    isLoading.value = true
    fateData.value = [] // Clear previous data

    const yearStr = data.date.split('-')[0]
    const year = parseInt(yearStr || '2000')
    birthYear.value = year
    const s = data.name.length + year // Simple seed

    // Calculate Bazi
    bazi.value = getBazi(year, s)

    try {
        // Call AI Service
        fateData.value = await aiService.predictFate(data)
    } catch (error) {
        console.error('AI Service failed, using fallback:', error)
        // Generate Fate using fallback
        fateData.value = generateFate(s)
    } finally {
        isActive.value = true
        isLoading.value = false

        // Mobile scroll
        if (window.innerWidth < 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }
}
</script>

<template>
    <div class="header">
        <div class="header-title">人生大盘 · 流年</div>
    </div>

    <div class="container">
        <!-- 左：命书输入 -->
        <FateBook :bazi="bazi" @divine="handleDivine" />

        <!-- 右：画卷 -->
        <!-- Initially hidden or not rendered until active? The original CSS uses opacity transition. -->
        <transition name="fade-slide">
            <ScrollPanel v-if="isActive" :fate-data="fateData" :birth-year="birthYear" />
        </transition>
    </div>

    <!-- Loading -->
    <div class="loader" v-if="isLoading">
        <div class="spinner"></div>
        <div class="loader-text">天机推演中...</div>
    </div>
</template>

<style>
/* Global styles are imported in main.ts/style.css */

/* Transition for ScrollPanel */
.fade-slide-enter-active {
    transition: opacity 1s ease 0.5s, transform 1s ease 0.5s;
}
.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px);
}
.fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
}

/* Loader Styles */
.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-paper);
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.spinner {
    width: 60px;
    height: 60px;
    border: 4px solid var(--ink);
    border-top-color: var(--cinnabar);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
.loader-text {
    font-size: 1.2rem;
    margin-top: 20px;
    letter-spacing: 3px;
    animation: pulse 2s infinite;
}
@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}
@keyframes pulse {
    0% {
        opacity: 0.5;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0.5;
    }
}
</style>

