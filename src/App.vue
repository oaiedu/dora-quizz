<script setup>
import { ref } from 'vue'
import DevOpsChoiceGame from './components/DevOpsChoiceGame.vue'
import ScenarioManager from './components/ScenarioManager.vue'

const currentView = ref('game')
const gameStarted = ref(false)

function showGame() {
  currentView.value = 'game'
}

function showManager() {
  currentView.value = 'manager'
}

function onGameStarted() {
  gameStarted.value = true
}

function onGameRestarted() {
  gameStarted.value = false
}

function onManageScenarios() {
  currentView.value = 'manager'
}

const shouldShowNavigation = ref(false)

// Update navigation visibility
function updateNavigation() {
  shouldShowNavigation.value = currentView.value === 'manager' || gameStarted.value
}

// Watch for changes
import { watch } from 'vue'
watch([currentView, gameStarted], updateNavigation, { immediate: true })
</script>

<template>
  <div class="app">
    <nav v-if="shouldShowNavigation" class="navigation">
      <button 
        @click="showGame" 
        :class="{ active: currentView === 'game' }"
      >
        🎮 DevOps Game
      </button>
      <button 
        @click="showManager" 
        :class="{ active: currentView === 'manager' }"
      >
        ⚙️ Manage Scenarios
      </button>
    </nav>
    
    <DevOpsChoiceGame 
      v-if="currentView === 'game'" 
      @game-started="onGameStarted"
      @game-restarted="onGameRestarted"
      @manage-scenarios="onManageScenarios"
    />
    <ScenarioManager v-if="currentView === 'manager'" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.navigation {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: center;
}

.navigation button {
  padding: 12px 24px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.navigation button:hover {
  border-color: #007acc;
  background: #f8f9fa;
}

.navigation button.active {
  border-color: #007acc;
  background: #007acc;
  color: white;
}
</style>
