<template>
  <div class="wrap">
    <!-- Header -->
    <div class="header">
      <h1 class="title">📝 Scenario Manager</h1>
      <p class="subtitle">Create and manage DevOps scenarios for the game</p>
      <div class="header-actions">
        <button class="btn-secondary" @click="exportScenarios">📤 Export JSON</button>
        <button class="btn-secondary" @click="importScenarios">📥 Import JSON</button>
        <button class="btn-primary" @click="createNewScenario">➕ New Scenario</button>
      </div>
    </div>

    <!-- Scenarios List -->
    <div class="scenarios-section">
      <h2>📋 Current Scenarios ({{ scenarios.length }})</h2>
      <div class="scenarios-grid">
        <div 
          v-for="(scenario, index) in scenarios" 
          :key="scenario.id"
          class="scenario-card"
          @click="editScenario(index)"
        >
          <div class="scenario-header">
            <span class="scenario-id">{{ scenario.id }}</span>
            <button class="delete-btn" @click.stop="deleteScenario(index)">🗑️</button>
          </div>
          <h3>{{ scenario.title }}</h3>
          <p class="scenario-text">{{ scenario.text }}</p>
          <div class="choices-count">{{ scenario.choices.length }} choices</div>
        </div>
      </div>
    </div>

    <!-- Scenario Editor Modal -->
    <div v-if="showEditor" class="modal-overlay" @click="closeEditor">
      <div class="editor-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditMode ? '✏️ Edit Scenario' : '➕ New Scenario' }}</h2>
          <button class="close-btn" @click="closeEditor">&times;</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveScenario">
            <!-- Basic Info -->
            <div class="form-section">
              <h3>Basic Information</h3>
              <div class="form-group">
                <label for="scenario-id">ID (unique identifier)</label>
                <input 
                  id="scenario-id"
                  v-model="currentScenario.id" 
                  type="text" 
                  placeholder="e.g., prod-incident" 
                  required
                />
              </div>
              <div class="form-group">
                <label for="scenario-title">Title</label>
                <input 
                  id="scenario-title"
                  v-model="currentScenario.title" 
                  type="text" 
                  placeholder="e.g., Production incident (Sunday 03:00)" 
                  required
                />
              </div>
              <div class="form-group">
                <label for="scenario-text">Description</label>
                <textarea 
                  id="scenario-text"
                  v-model="currentScenario.text" 
                  placeholder="Describe the situation..." 
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>

            <!-- Choices -->
            <div class="form-section">
              <div class="choices-header">
                <h3>Choices ({{ currentScenario.choices.length }})</h3>
                <div class="choice-tabs">
                  <button 
                    type="button"
                    class="tab-btn devops-tab"
                    :class="{ active: activeChoiceTab === 'devops' }"
                    @click="activeChoiceTab = 'devops'"
                  >
                    🚀 DevOps Approach
                  </button>
                  <button 
                    type="button"
                    class="tab-btn traditional-tab"
                    :class="{ active: activeChoiceTab === 'traditional' }"
                    @click="activeChoiceTab = 'traditional'"
                  >
                    🏢 Traditional Approach
                  </button>
                </div>
              </div>

              <div class="choices-container">
                <div class="choices-grid">
                  <!-- DevOps Choices Column -->
                  <div 
                    class="choice-column devops-column" 
                    :class="{ active: activeChoiceTab === 'devops' }"
                  >
                    <div class="column-header">
                      <h4>🚀 DevOps Choices</h4>
                      <button 
                        type="button" 
                        class="add-choice-btn devops-btn" 
                        @click="addChoice('devops')"
                        v-if="currentScenario.choices.length < 4"
                      >
                        + Add DevOps Choice
                      </button>
                    </div>
                    
                    <div 
                      v-for="(choice, index) in devopsChoices" 
                      :key="'devops-' + index"
                      class="choice-editor devops-choice"
                    >
                      <div class="choice-header">
                        <span class="choice-badge devops-badge">DevOps</span>
                        <button 
                          type="button" 
                          class="remove-choice-btn" 
                          @click="removeChoice(choice.originalIndex)"
                          v-if="currentScenario.choices.length > 2"
                        >
                          ✕
                        </button>
                      </div>

                      <div class="form-group">
                        <label :for="`choice-${choice.originalIndex}-label`">Choice Text</label>
                        <textarea 
                          :id="`choice-${choice.originalIndex}-label`"
                          v-model="choice.label" 
                          placeholder="Describe the DevOps approach..." 
                          rows="2"
                          required
                        ></textarea>
                      </div>

                      <div class="form-group">
                        <label :for="`choice-${choice.originalIndex}-note`">Explanation</label>
                        <textarea 
                          :id="`choice-${choice.originalIndex}-note`"
                          v-model="choice.note" 
                          placeholder="Why this DevOps choice matters..." 
                          rows="2"
                          required
                        ></textarea>
                      </div>

                      <!-- Impact Settings for DevOps -->
                      <div class="impact-section">
                        <h5>📊 Impact on Metrics</h5>
                        <div class="impact-grid-compact">
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-sat`">Satisfaction</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-sat`"
                              v-model.number="choice.impact.sat" 
                              type="number" 
                              min="-50" 
                              max="50" 
                              step="1"
                            />
                          </div>
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-burn`">Burnout</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-burn`"
                              v-model.number="choice.impact.burn" 
                              type="number" 
                              min="-50" 
                              max="50" 
                              step="1"
                            />
                          </div>
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-lead`">Lead Time</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-lead`"
                              v-model.number="choice.impact.lead" 
                              type="number" 
                              min="-30" 
                              max="30" 
                              step="1"
                            />
                          </div>
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-mttr`">MTTR</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-mttr`"
                              v-model.number="choice.impact.mttr" 
                              type="number" 
                              min="-30" 
                              max="30" 
                              step="1"
                            />
                          </div>
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-cfr`">CFR</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-cfr`"
                              v-model.number="choice.impact.cfr" 
                              type="number" 
                              min="-50" 
                              max="50" 
                              step="1"
                            />
                          </div>
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-cost`">Cost</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-cost`"
                              v-model.number="choice.impact.cost" 
                              type="number" 
                              min="-100" 
                              max="100" 
                              step="5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Traditional Choices Column -->
                  <div 
                    class="choice-column traditional-column" 
                    :class="{ active: activeChoiceTab === 'traditional' }"
                  >
                    <div class="column-header">
                      <h4>🏢 Traditional Choices</h4>
                      <button 
                        type="button" 
                        class="add-choice-btn traditional-btn" 
                        @click="addChoice('nodevops')"
                        v-if="currentScenario.choices.length < 4"
                      >
                        + Add Traditional Choice
                      </button>
                    </div>
                    
                    <div 
                      v-for="(choice, index) in traditionalChoices" 
                      :key="'traditional-' + index"
                      class="choice-editor traditional-choice"
                    >
                      <div class="choice-header">
                        <span class="choice-badge traditional-badge">Traditional</span>
                        <button 
                          type="button" 
                          class="remove-choice-btn" 
                          @click="removeChoice(choice.originalIndex)"
                          v-if="currentScenario.choices.length > 2"
                        >
                          ✕
                        </button>
                      </div>

                      <div class="form-group">
                        <label :for="`choice-${choice.originalIndex}-label`">Choice Text</label>
                        <textarea 
                          :id="`choice-${choice.originalIndex}-label`"
                          v-model="choice.label" 
                          placeholder="Describe the traditional approach..." 
                          rows="2"
                          required
                        ></textarea>
                      </div>

                      <div class="form-group">
                        <label :for="`choice-${choice.originalIndex}-note`">Explanation</label>
                        <textarea 
                          :id="`choice-${choice.originalIndex}-note`"
                          v-model="choice.note" 
                          placeholder="Why this traditional choice matters..." 
                          rows="2"
                          required
                        ></textarea>
                      </div>

                      <!-- Impact Settings for Traditional -->
                      <div class="impact-section">
                        <h5>📊 Impact on Metrics</h5>
                        <div class="impact-grid-compact">
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-sat`">Satisfaction</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-sat`"
                              v-model.number="choice.impact.sat" 
                              type="number" 
                              min="-50" 
                              max="50" 
                              step="1"
                            />
                          </div>
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-burn`">Burnout</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-burn`"
                              v-model.number="choice.impact.burn" 
                              type="number" 
                              min="-50" 
                              max="50" 
                              step="1"
                            />
                          </div>
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-lead`">Lead Time</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-lead`"
                              v-model.number="choice.impact.lead" 
                              type="number" 
                              min="-30" 
                              max="30" 
                              step="1"
                            />
                          </div>
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-mttr`">MTTR</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-mttr`"
                              v-model.number="choice.impact.mttr" 
                              type="number" 
                              min="-30" 
                              max="30" 
                              step="1"
                            />
                          </div>
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-cfr`">CFR</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-cfr`"
                              v-model.number="choice.impact.cfr" 
                              type="number" 
                              min="-50" 
                              max="50" 
                              step="1"
                            />
                          </div>
                          <div class="impact-item">
                            <label :for="`choice-${choice.originalIndex}-cost`">Cost</label>
                            <input 
                              :id="`choice-${choice.originalIndex}-cost`"
                              v-model.number="choice.impact.cost" 
                              type="number" 
                              min="-100" 
                              max="100" 
                              step="5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeEditor">Cancel</button>
              <button type="submit" class="btn-primary">{{ isEditMode ? 'Update' : 'Create' }} Scenario</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- JSON Import Modal -->
    <div v-if="showImportModal" class="modal-overlay" @click="closeImportModal">
      <div class="import-modal" @click.stop>
        <div class="modal-header">
          <h2>📥 Import Scenarios</h2>
          <button class="close-btn" @click="closeImportModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="import-json">Paste JSON data:</label>
            <textarea 
              id="import-json"
              v-model="importJson" 
              placeholder="Paste your scenarios JSON here..."
              rows="10"
              class="json-textarea"
            ></textarea>
          </div>
          <div class="form-actions">
            <button class="btn-secondary" @click="closeImportModal">Cancel</button>
            <button class="btn-primary" @click="processImport">Import</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Utility function to generate unique IDs
const generateId = (prefix = 'field') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Default scenarios (same as the game)
const defaultScenarios = [
  {
    id: 'prod-incident',
    title: 'Production incident (Sunday 03:00)',
    text: 'The payments API returns 500. No runbooks or alerts are configured.',
    choices: [
      { 
        label: 'Page on-call and document a post‑mortem runbook', 
        tag: 'devops', 
        impact: { mttr: -4, burn: 5, cost: 10, sat: -5, cfr: -5 }, 
        note: 'Improves MTTR and prevents repeat failures, but adds some cost and load.' 
      },
      { 
        label: 'Hotfix quickly without documenting', 
        tag: 'nodevops', 
        impact: { mttr: -1, burn: 2, sat: -8, cfr: 8 }, 
        note: 'Fast but fragile; increases CFR and hurts satisfaction.' 
      }
    ]
  },
  {
    id: 'qa-backlog',
    title: 'QA backlog delays releases',
    text: 'Manual testing takes days and blocks releases.',
    choices: [
      { 
        label: 'Introduce automated tests and a minimal coverage gate', 
        tag: 'devops', 
        impact: { lead: -3, cfr: -6, cost: 15, burn: -4, sat: 6 }, 
        note: 'Fewer failures and shorter lead time with an upfront investment.' 
      },
      { 
        label: 'Ask QA for overtime', 
        tag: 'nodevops', 
        impact: { lead: -1, burn: 12, sat: -4, cfr: 3 }, 
        note: 'Buys some time at the cost of burnout and more failures.' 
      }
    ]
  }
]

// State
const scenarios = ref([...defaultScenarios])
const showEditor = ref(false)
const showImportModal = ref(false)
const isEditMode = ref(false)
const editingIndex = ref(-1)
const importJson = ref('')
const message = ref('')
const messageType = ref('success')
const activeChoiceTab = ref('devops')

const currentScenario = reactive({
  id: '',
  title: '',
  text: '',
  choices: []
})

// Methods
function createNewScenario() {
  resetCurrentScenario()
  isEditMode.value = false
  showEditor.value = true
}

function editScenario(index) {
  const scenario = scenarios.value[index]
  Object.assign(currentScenario, JSON.parse(JSON.stringify(scenario)))
  editingIndex.value = index
  isEditMode.value = true
  showEditor.value = true
}

function resetCurrentScenario() {
  currentScenario.id = ''
  currentScenario.title = ''
  currentScenario.text = ''
  currentScenario.choices = [
    createEmptyChoice('devops'),
    createEmptyChoice('nodevops')
  ]
}

function createEmptyChoice(tag = 'devops') {
  return {
    label: '',
    tag,
    impact: { sat: 0, burn: 0, lead: 0, mttr: 0, cfr: 0, cost: 0 },
    note: ''
  }
}

function addChoice(type = 'devops') {
  if (currentScenario.choices.length < 4) {
    const newChoice = createEmptyChoice()
    newChoice.tag = type
    currentScenario.choices.push(newChoice)
  }
}

function removeChoice(index) {
  if (currentScenario.choices.length > 2) {
    currentScenario.choices.splice(index, 1)
  }
}

function saveScenario() {
  // Validation
  if (!currentScenario.id || !currentScenario.title || !currentScenario.text) {
    showMessage('Please fill in all required fields', 'error')
    return
  }

  // Check for duplicate ID (only if creating new or changing ID)
  const existingIndex = scenarios.value.findIndex(s => s.id === currentScenario.id)
  if (existingIndex !== -1 && (!isEditMode.value || existingIndex !== editingIndex.value)) {
    showMessage('Scenario ID already exists', 'error')
    return
  }

  // Validate choices
  for (let i = 0; i < currentScenario.choices.length; i++) {
    const choice = currentScenario.choices[i]
    if (!choice.label || !choice.note) {
      showMessage(`Choice ${i + 1}: Please fill in all fields`, 'error')
      return
    }
  }

  // Save
  const scenarioData = JSON.parse(JSON.stringify(currentScenario))
  
  if (isEditMode.value) {
    scenarios.value[editingIndex.value] = scenarioData
    showMessage('Scenario updated successfully!', 'success')
  } else {
    scenarios.value.push(scenarioData)
    showMessage('Scenario created successfully!', 'success')
  }

  closeEditor()
  saveToLocalStorage()
}

function deleteScenario(index) {
  if (confirm('Are you sure you want to delete this scenario?')) {
    scenarios.value.splice(index, 1)
    showMessage('Scenario deleted successfully!', 'success')
    saveToLocalStorage()
  }
}

function closeEditor() {
  showEditor.value = false
  resetCurrentScenario()
}

function exportScenarios() {
  const dataStr = JSON.stringify(scenarios.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'devops-scenarios.json'
  link.click()
  URL.revokeObjectURL(url)
  showMessage('Scenarios exported successfully!', 'success')
}

function importScenarios() {
  importJson.value = ''
  showImportModal.value = true
}

function closeImportModal() {
  showImportModal.value = false
  importJson.value = ''
}

function processImport() {
  try {
    const importedData = JSON.parse(importJson.value)
    
    if (!Array.isArray(importedData)) {
      throw new Error('JSON must be an array of scenarios')
    }

    // Validate structure
    for (const scenario of importedData) {
      if (!scenario.id || !scenario.title || !scenario.text || !Array.isArray(scenario.choices)) {
        throw new Error('Invalid scenario structure')
      }
    }

    scenarios.value = [...importedData]
    saveToLocalStorage()
    showMessage(`${importedData.length} scenarios imported successfully!`, 'success')
    closeImportModal()
  } catch (error) {
    showMessage(`Import failed: ${error.message}`, 'error')
  }
}

function showMessage(text, type = 'success') {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

function saveToLocalStorage() {
  localStorage.setItem('devops-scenarios', JSON.stringify(scenarios.value))
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('devops-scenarios')
  if (saved) {
    try {
      scenarios.value = JSON.parse(saved)
    } catch (error) {
      console.error('Failed to load scenarios from localStorage:', error)
    }
  }
}

// Computed properties
const devopsChoices = computed(() => {
  return currentScenario.choices
    .map((choice, index) => ({ ...choice, originalIndex: index }))
    .filter(choice => choice.tag === 'devops')
})

const traditionalChoices = computed(() => {
  return currentScenario.choices
    .map((choice, index) => ({ ...choice, originalIndex: index }))
    .filter(choice => choice.tag === 'nodevops')
})

// Initialize
resetCurrentScenario()
loadFromLocalStorage()
</script>

<style scoped>
.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.subtitle {
  font-size: 18px;
  margin: 0 0 24px 0;
}

.header-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: #007acc;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: white;
  border: 2px solid #ddd;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

.scenarios-section {
  margin-bottom: 32px;
}

.scenarios-section h2 {
  font-size: 24px;
  margin: 0 0 24px 0;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.scenario-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scenario-card:hover {
  border-color: #007acc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.scenario-id {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #ddd;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.delete-btn:hover {
  background: #fee2e2;
}

.scenario-card h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
}

.scenario-text {
  margin: 0 0 12px 0;
  font-size: 14px;
  line-height: 1.4;
}

.choices-count {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.editor-modal, .import-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
}

.close-btn {
  background: #f8f9fa;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.close-btn:hover {
  background: #e9ecef;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007acc;
}

.choice-editor {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.choice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.choice-number {
  font-weight: 600;
}

.remove-choice-btn {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.remove-choice-btn:hover {
  background: #fecaca;
}

.impact-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.impact-section h4, .impact-section h5 {
  margin: 0 0 16px 0;
  font-size: 16px;
}

.impact-grid, .impact-grid-compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.impact-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.impact-item label {
  font-size: 12px;
  font-weight: 600;
}

.impact-item input {
  padding: 8px;
}

.add-choice-btn {
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  border: 2px dashed #ddd;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
}

.add-choice-btn:hover {
  border-color: #007acc;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.json-textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: 600;
  z-index: 2000;
}

.message.success {
  background: #d1fae5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.message.error {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Choices Tabs System Styles */
.choices-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.choice-tabs {
  display: flex;
  gap: 8px;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  background: transparent;
}

.tab-btn.active {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.choices-container {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
}

.choices-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.choice-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  min-height: 300px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.column-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

@media (max-width: 768px) {
  .wrap {
    padding: 16px;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .scenarios-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .choices-grid {
    grid-template-columns: 1fr;
  }
}
</style>