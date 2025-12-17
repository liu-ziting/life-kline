<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type ApiConfig } from '../services/aiService'

const props = defineProps<{
    visible: boolean
}>()

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'save', config: ApiConfig): void
}>()

const form = ref<ApiConfig>({
    endpoint: '',
    model: '',
    apiKey: ''
})

onMounted(() => {
    // Load defaults or saved settings
    const saved = localStorage.getItem('ai_config')
    if (saved) {
        form.value = JSON.parse(saved)
    } else {
        // Default values (could be imported but let's just use placeholders or empty)
        form.value = {
            endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            model: 'GLM-4.1V-Thinking-Flash',
            apiKey: ''
        }
    }
})

function handleClose() {
    emit('update:visible', false)
}

function handleSave() {
    localStorage.setItem('ai_config', JSON.stringify(form.value))
    emit('save', form.value)
    emit('update:visible', false)
}
</script>

<template>
    <div class="modal-overlay" v-if="visible" @click="handleClose">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>天机设置</h3>
                <button class="close-btn" @click="handleClose">×</button>
            </div>
            
            <div class="modal-body">
                <div class="form-group">
                    <label>接口地址 (Endpoint)</label>
                    <input type="text" v-model="form.endpoint" placeholder="https://..." />
                </div>
                
                <div class="form-group">
                    <label>模型名称 (Model)</label>
                    <input type="text" v-model="form.model" placeholder="e.g. GLM-4.1V-Thinking-Flash" />
                </div>
                
                <div class="form-group">
                    <label>API Key</label>
                    <input type="password" v-model="form.apiKey" placeholder="sk-..." />
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn-cancel" @click="handleClose">取消</button>
                <button class="btn-save" @click="handleSave">保存配置</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);
}

.modal-content {
    background: var(--bg-paper);
    width: 90%;
    max-width: 500px;
    border: 2px solid var(--ink);
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.03);
}

.modal-header h3 {
    margin: 0;
    font-family: 'KaiTi', serif;
    font-size: 1.4rem;
    color: var(--ink);
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
}

.modal-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: var(--ink);
    font-size: 0.9rem;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.8);
    font-family: inherit;
    box-sizing: border-box; /* Ensure padding doesn't overflow width */
}

.form-group input:focus {
    outline: none;
    border-color: var(--cinnabar);
    box-shadow: 0 0 0 2px rgba(168, 54, 45, 0.1);
}

.modal-footer {
    padding: 15px 20px;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

button {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
}

.btn-cancel {
    background: transparent;
    border: 1px solid #ccc;
    color: #666;
}

.btn-cancel:hover {
    background: rgba(0, 0, 0, 0.05);
}

.btn-save {
    background: var(--cinnabar);
    color: white;
    border: 1px solid var(--cinnabar);
}

.btn-save:hover {
    background: #8a2a22;
    border-color: #8a2a22;
}
</style>
