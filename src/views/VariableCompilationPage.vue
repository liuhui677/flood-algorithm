<script setup lang="ts">
import { ref, computed } from 'vue'
import { TvariableCompilation } from '../utils/variableCompilation'

// ============ 变量管理 ============
interface VariableRow {
  id: number
  key: string
  value: string
}

let rowIdSeed = 0

const variables = ref<VariableRow[]>([
  { id: ++rowIdSeed, key: '来源', value: '上' },
  { id: ++rowIdSeed, key: '长度', value: '25' },
  { id: ++rowIdSeed, key: '宽度', value: '8' },
  { id: ++rowIdSeed, key: '框长', value: '3' },
])

const addVariable = () => {
  variables.value.push({ id: ++rowIdSeed, key: '', value: '' })
}

const removeVariable = (id: number) => {
  variables.value = variables.value.filter((v) => v.id !== id)
}

// 把表格行转成 variableDict 对象（自动尝试把数字字符串转成 number）
const buildAttrs = () => {
  const attrs: Record<string, string | number> = {}
  for (const v of variables.value) {
    const k = v.key.trim()
    if (!k) continue
    const raw = v.value.trim()
    // 空值当空字符串；纯数字当 number；其他当 string
    if (raw === '' || raw === undefined) {
      attrs[k] = ''
    } else if (!isNaN(Number(raw)) && raw.trim() !== '') {
      attrs[k] = Number(raw)
    } else {
      attrs[k] = raw
    }
  }
  return attrs
}

// ============ 表达式 & 运行 ============
const expression = ref('来源=上，长度>20')
const compiledStr = ref('')
const resultStr = ref('')
const runError = ref<{ message: string; detail?: string } | null>(null)

const isRunning = ref(false)

const run = () => {
  compiledStr.value = ''
  resultStr.value = ''
  runError.value = null

  const input = expression.value
  if (!input.trim()) {
    runError.value = { message: '请先输入表达式' }
    return
  }

  isRunning.value = true
  try {
    const attrs = buildAttrs()

    // 第一步：拿到编译后的字符串（parseAndReplace）
    const compiled = TvariableCompilation.getInstance().parseAndReplace(input)
    compiledStr.value = compiled

    // 第二步：用静态入口运行
    const res = TvariableCompilation.getCalculatedData(
      input,
      attrs,
      [],
      (err) => {
        runError.value = {
          message: '表达式执行出错',
          detail: `错误: ${err.error?.message || err.error}\n编译后: ${err.expressionString}\n原始: ${err.str}`,
        }
      }
    )

    if (runError.value) {
      // 执行回调里已经填了错误，不覆盖
    } else {
      // 格式化结果
      if (res === undefined || res === null) {
        resultStr.value = String(res)
      } else if (typeof res === 'boolean') {
        resultStr.value = res ? '✓ true (真)' : '✗ false (假)'
      } else {
        resultStr.value = String(res)
      }
    }
  } catch (e: any) {
    runError.value = {
      message: '编译阶段抛出异常',
      detail: e?.message || String(e),
    }
  } finally {
    isRunning.value = false
  }
}

// ============ 示例 ============
const examples = [
  { label: '基础比较：来源=上，长度>20', value: '来源=上，长度>20' },
  { label: '或关系：长度>10；宽度<5', value: '长度>10；宽度<5' },
  { label: 'Math函数：max(长度,宽度)+框长>30', value: 'max(长度, 宽度) + 框长 > 30' },
  { label: '混合：来源=上，(来源=下；max(长度,宽度+框长)>20)', value: '来源=上，(来源=下；max(长度,宽度+框长)>20)' },
  { label: '自定义函数：compress(来源)', value: "compress(来源)" },
]

const loadExample = (val: string) => {
  expression.value = val
}

// ============ 弹窗关闭 ============
const closeErrorModal = () => {
  runError.value = null
}

const formattedAttrs = computed(() => JSON.stringify(buildAttrs(), null, 2))
</script>

<template>
  <div class="page">
    <!-- ============ Section 1: 变量管理 ============ -->
    <section class="panel">
      <header class="panel-header">
        <h3>① 变量字典（variableDict）</h3>
        <button class="btn btn-primary btn-sm" @click="addVariable">＋ 新增变量</button>
      </header>

      <div class="table-wrap">
        <table class="var-table">
          <thead>
            <tr>
              <th style="width: 38%">key</th>
              <th>value（数字或字符串）</th>
              <th style="width: 60px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in variables" :key="v.id">
              <td>
                <input class="cell-input" v-model="v.key" placeholder="变量名" />
              </td>
              <td>
                <input class="cell-input" v-model="v.value" placeholder="值（纯数字会自动转 number）" />
              </td>
              <td class="action-cell">
                <button class="btn btn-danger btn-sm" @click="removeVariable(v.id)">删除</button>
              </td>
            </tr>
            <tr v-if="variables.length === 0">
              <td colspan="3" class="empty-tip">暂无变量，点击右上角"＋ 新增变量"添加</td>
            </tr>
          </tbody>
        </table>
      </div>

      <details class="attrs-preview">
        <summary>预览最终 variableDict 对象</summary>
        <pre>{{ formattedAttrs }}</pre>
      </details>
    </section>

    <!-- ============ Section 2: 表达式输入 & 运行 ============ -->
    <section class="panel">
      <header class="panel-header">
        <h3>② 表达式输入</h3>
        <div class="examples">
          <label>示例：</label>
          <select @change="loadExample(($event.target as HTMLSelectElement).value)">
            <option value="">— 选择一个示例 —</option>
            <option v-for="ex in examples" :key="ex.value" :value="ex.value">{{ ex.label }}</option>
          </select>
        </div>
      </header>

      <textarea
        class="expr-input"
        v-model="expression"
        placeholder="例：来源=上，长度>20"
        spellcheck="false"
        @keydown.ctrl.enter="run"
      ></textarea>

      <div class="run-bar">
        <button class="btn btn-primary" :disabled="isRunning" @click="run">
          {{ isRunning ? '运行中…' : '▶ 运行（Ctrl+Enter）' }}
        </button>
        <span class="hint">支持中文标点、Math.* 函数、自定义函数、&&/|| 通过 ，/； 表达</span>
      </div>

      <!-- ============ Section 3: 结果输出 ============ -->
      <div class="result-area">
        <div class="result-block">
          <h4>🔧 编译后表达式（parseAndReplace）</h4>
          <code class="compiled-code">{{ compiledStr || '— 运行后显示 —' }}</code>
        </div>
        <div class="result-block">
          <h4>📦 运行结果（getCountResult）</h4>
          <div class="result-value" :class="{ empty: !resultStr }">
            {{ resultStr || '— 运行后显示 —' }}
          </div>
        </div>
      </div>
    </section>

    <!-- ============ 错误弹窗 ============ -->
    <Transition name="fade">
      <div v-if="runError" class="modal-mask" @click.self="closeErrorModal">
        <div class="modal">
          <header class="modal-header">
            <span class="modal-title">⚠ 运行出错</span>
            <button class="btn-close" @click="closeErrorModal">✕</button>
          </header>
          <div class="modal-body">
            <p class="error-msg">{{ runError.message }}</p>
            <pre v-if="runError.detail" class="error-detail">{{ runError.detail }}</pre>
          </div>
          <footer class="modal-footer">
            <button class="btn btn-primary" @click="closeErrorModal">知道了</button>
          </footer>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  background: #f8fafc;
}

.panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.panel-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

/* ============ 按钮 ============ */
.btn {
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
  background: #f1f5f9;
  color: #334155;
}
.btn:hover:not(:disabled) {
  filter: brightness(0.95);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-sm {
  padding: 5px 10px;
  font-size: 13px;
}
.btn-primary {
  background: #3b82f6;
  color: #fff;
}
.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}
.btn-danger {
  background: #fee2e2;
  color: #dc2626;
}
.btn-danger:hover:not(:disabled) {
  background: #fecaca;
}

/* ============ 变量表格 ============ */
.table-wrap {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}
.var-table {
  width: 100%;
  border-collapse: collapse;
}
.var-table th {
  background: #f8fafc;
  padding: 8px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}
.var-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #f1f5f9;
}
.var-table tr:last-child td {
  border-bottom: none;
}
.cell-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}
.cell-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.action-cell {
  text-align: center;
}
.empty-tip {
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  padding: 18px;
}

/* attrs 预览 */
.attrs-preview {
  margin-top: 10px;
  font-size: 12px;
  color: #64748b;
}
.attrs-preview summary {
  cursor: pointer;
  user-select: none;
}
.attrs-preview pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 10px;
  border-radius: 4px;
  margin: 8px 0 0;
  font-size: 12px;
  overflow: auto;
}

/* ============ 表达式输入 ============ */
.examples {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}
.examples select {
  padding: 5px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 13px;
  background: #fff;
  cursor: pointer;
}
.expr-input {
  width: 100%;
  min-height: 80px;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 15px;
  font-family: 'SF Mono', Consolas, Menlo, monospace;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.expr-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.run-bar {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.hint {
  font-size: 12px;
  color: #94a3b8;
}

/* ============ 结果输出 ============ */
.result-area {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.result-block h4 {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}
.compiled-code {
  display: block;
  background: #1e293b;
  color: #a5f3fc;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  font-family: 'SF Mono', Consolas, Menlo, monospace;
  word-break: break-all;
  min-height: 50px;
  line-height: 1.5;
}
.result-value {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 14px 16px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  min-height: 50px;
  display: flex;
  align-items: center;
}
.result-value.empty {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #94a3b8;
  font-weight: 400;
  font-size: 14px;
}

/* ============ 错误弹窗 ============ */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 10px;
  width: 480px;
  max-width: 92vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #fee2e2;
  background: #fef2f2;
}
.modal-title {
  font-weight: 600;
  color: #dc2626;
}
.btn-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #94a3b8;
  padding: 0 4px;
}
.btn-close:hover {
  color: #dc2626;
}
.modal-body {
  padding: 16px 18px;
  overflow: auto;
}
.error-msg {
  margin: 0 0 8px;
  color: #334155;
  font-size: 14px;
}
.error-detail {
  background: #1e293b;
  color: #fca5a5;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 12px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
.modal-footer {
  padding: 12px 18px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式：窄屏单列 */
@media (max-width: 720px) {
  .result-area {
    grid-template-columns: 1fr;
  }
}
</style>
