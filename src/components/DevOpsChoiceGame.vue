<template>
  <div class="wrap">
    <!-- Intro Screen -->
    <div v-if="showIntro" class="intro-screen">
      <div class="intro-content">
        <div class="intro-header">
          <h1 class="intro-title">🚀 DevOps Choice Game</h1>
          <p class="intro-subtitle">CTO Decision Simulator</p>
        </div>

        <div class="intro-description">
          <p>Make decisions like a CTO and observe how they affect <strong>DORA metrics</strong>, team well-being, and operational costs.</p>
        </div>

        <div class="metrics-explanation">
          <h2>📊 What are DORA Metrics?</h2>
          <p>The 4 key metrics identified by DORA research to measure software delivery and operational performance:</p>
          
          <div class="metric-cards">
            <div class="metric-card dora-metric">
              <div class="metric-icon">🚀</div>
              <div class="metric-info">
                <h3>Deployment Frequency</h3>
                <p>How often your team deploys code to production</p>
                <div class="metric-range">🎯 Elite: Multiple times per day</div>
              </div>
            </div>

            <div class="metric-card dora-metric">
              <div class="metric-icon">⚡</div>
              <div class="metric-info">
                <h3>Lead Time for Changes</h3>
                <p>Time from code commit to production deployment</p>
                <div class="metric-range">🎯 Elite: < 1 day</div>
              </div>
            </div>

            <div class="metric-card dora-metric">
              <div class="metric-icon">❌</div>
              <div class="metric-info">
                <h3>Change Failure Rate</h3>
                <p>Percentage of deployments that cause production failures</p>
                <div class="metric-range">🎯 Elite: < 15%</div>
              </div>
            </div>

            <div class="metric-card dora-metric">
              <div class="metric-icon">�</div>
              <div class="metric-info">
                <h3>Mean Time to Recovery</h3>
                <p>Average time to recover from a production failure</p>
                <div class="metric-range">🎯 Elite: < 1 hour</div>
              </div>
            </div>
          </div>

          <div class="additional-metrics">
            <h3>📈 Additional Metrics Tracked</h3>
            <p>Beyond the 4 core DORA metrics, this simulation also tracks:</p>
            <div class="extra-metrics">
              <span class="extra-metric">😊 Customer Satisfaction</span>
              <span class="extra-metric">🔥 Team Burnout</span>
              <span class="extra-metric">💰 Operating Costs</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="help-btn" @click="openHelpModal">
            <span class="btn-text">❓ How it Works</span>
          </button>
          <button class="start-game-btn" @click="startGame">
            <span class="btn-text">🚀 Start Simulation</span>
          </button>
        </div>
      </div>

      <!-- Help Modal -->
      <div v-if="showHelpModal" class="modal-overlay" @click="closeHelpModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>🎮 How It Works</h2>
            <button class="close-btn" @click="closeHelpModal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="instruction-steps">
              <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                  <h3>Real Scenarios</h3>
                  <p>Face 5 typical situations from a technology organization</p>
                </div>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                  <h3>Choose Your Strategy</h3>
                  <p>Decide between modern DevOps approaches or traditional methods</p>
                </div>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                  <h3>Observe the Impact</h3>
                  <p>See how your decisions affect metrics in real-time</p>
                </div>
              </div>
              <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                  <h3>Get Your Score</h3>
                  <p>Receive feedback based on industry best practices</p>
                </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <button class="scenario-manager-btn" @click="goToScenarioManager">
                ⚙️ Edit Questions & Scenarios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Screen -->
    <div v-else>
      <header>
        <div>
          <div class="title">DevOps Choice Game – Prototype</div>
          <div class="subtitle">Make CTO-style decisions. See how your choices affect delivery speed, stability and team well‑being.</div>
        </div>
        <div class="chips">
          <span class="chip">MTTR = Mean Time To Recover</span>
          <span class="chip">CFR = Change Failure Rate</span>
          <span class="chip">DORA metrics</span>
        </div>
      </header>

    <div class="grid">
      <aside class="card">
        <div class="status-header">
          <h3>Performance Dashboard</h3>
        </div>
        <div class="kpis">
          <div class="kpi">
            <h4>Customer Satisfaction</h4>
            <div class="val">{{ fmt(state.sat) }}</div>
            <div class="bar"><span :style="{ width: state.sat + '%' }" /></div>
          </div>
          <div class="kpi">
            <h4>Team Burnout</h4>
            <div class="val">{{ fmt(state.burn) }}</div>
            <div class="bar"><span :style="{ width: state.burn + '%' }" /></div>
          </div>
          <div class="kpi">
            <h4>Lead Time (days)</h4>
            <div class="val">{{ fmt(state.lead) }}</div>
            <div class="bar"><span :style="{ width: invLeadBar + '%' }" /></div>
          </div>
          <div class="kpi">
            <h4>MTTR (hours)</h4>
            <div class="val">{{ fmt(state.mttr) }}</div>
            <div class="bar"><span :style="{ width: invMttrBar + '%' }" /></div>
          </div>
          <div class="kpi">
            <h4>CFR (%)</h4>
            <div class="val">{{ fmt(state.cfr) }}%</div>
            <div class="bar"><span :style="{ width: (100 - state.cfr) + '%' }" /></div>
          </div>
          <div class="kpi">
            <h4>Operating Cost</h4>
            <div class="val">{{ fmt(state.cost) }}</div>
            <div class="bar"><span :style="{ width: invCostBar + '%' }" /></div>
          </div>
        </div>
        <div class="log">
          <p v-for="(entry, i) in logTop" :key="i" v-html="entry"></p>
        </div>
      </aside>

      <main class="card">
        <div v-if="isFinished" class="center" style="min-height:420px;flex-direction:column;gap:12px">
          <div class="score">Final score: {{ fmt(score) }} / 100</div>
          <div class="small">(Higher is better. Based on DORA + well‑being + cost)</div>
          <div class="kpis" style="max-width:560px;margin-top:8px">
            <div class="kpi"><h4>Customer Satisfaction</h4><div class="val">{{ fmt(state.sat) }}</div></div>
            <div class="kpi"><h4>Team Burnout</h4><div class="val">{{ fmt(state.burn) }}</div></div>
            <div class="kpi"><h4>Lead Time (days)</h4><div class="val">{{ fmt(state.lead) }}</div></div>
            <div class="kpi"><h4>MTTR (h)</h4><div class="val">{{ fmt(state.mttr) }}</div></div>
            <div class="kpi"><h4>CFR (%)</h4><div class="val">{{ fmt(state.cfr) }}%</div></div>
            <div class="kpi"><h4>Cost</h4><div class="val">{{ fmt(state.cost) }}</div></div>
          </div>
          <div class="list">
            <div class="item" v-for="(p, i) in state.picks" :key="i">
              <div>{{ p.idx + 1 }}. {{ p.title }}</div>
              <div class="pill" :class="p.align==='DevOps' ? 'tag-devops' : 'tag-nodevops'">{{ p.align }}</div>
            </div>
          </div>
          <div class="chips">
            <span class="chip">Tip: prioritize small batches, automation and observability.</span>
            <span class="chip">Next: extend scenarios via JSON.</span>
          </div>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="restart" @click="restart">Play again</button>
          </div>
        </div>

        <template v-else>
          <div class="scenario">
            <div class="row">
              <h3>{{ currentNumber }}. {{ current.title }}</h3>
              <div class="pill scenario-id">{{ current.id }}</div>
            </div>
            <p>{{ current.text }}</p>
            <div class="choices">
              <button
                class="choice"
                v-for="(c,i) in current.choices"
                :key="i"
                :class="{
                  'selected': choiceMade && selectedChoiceIndex === i,
                  'not-selected': choiceMade && selectedChoiceIndex !== i
                }"
                :disabled="choiceMade"
                @click="onChoose(i)"
              >
                <div>
                  <div style="font-weight:600">{{ c.label }}</div>
                </div>
              </button>
            </div>
            <div class="footer">
              <div class="meta">Scenario {{ currentNumber }} of {{ scenarios.length }}</div>
              <button class="next" :disabled="!choiceMade" @click="goNext">Next →</button>
            </div>
          </div>
        </template>
      </main>
    </div>
    </div>

    <!-- Impact Modal -->
    <div v-if="showImpactModal" class="modal-overlay" @click="closeImpactModal">
      <div class="impact-modal-content" @click.stop>
        <div class="modal-header">
          <h2>📊 Impact Analysis</h2>
          <button class="close-btn" @click="closeImpactModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="choice-summary">
            <h3>Your Decision:</h3>
            <div class="choice-text">{{ currentImpact.choice }}</div>
            <div class="choice-alignment">
              <span class="pill" :class="currentImpact.align === 'DevOps' ? 'tag-devops' : currentImpact.align === 'Hybrid' ? 'tag-mixed' : 'tag-nodevops'">
                {{ currentImpact.align }} Approach
              </span>
            </div>
          </div>

          <div class="impact-explanation">
            <h3>Why this matters:</h3>
            <p>{{ currentImpact.note }}</p>
          </div>

          <div class="metrics-impact">
            <h3>📈 Metrics Changes:</h3>
            <div class="impact-grid">
              <div v-if="currentImpact.impact?.sat" class="impact-item">
                <span class="metric-name">Customer Satisfaction</span>
                <span class="impact-value" :class="currentImpact.impact.sat > 0 ? 'positive' : 'negative'">
                  {{ currentImpact.impact.sat > 0 ? '+' : '' }}{{ currentImpact.impact.sat }}
                </span>
              </div>
              <div v-if="currentImpact.impact?.burn" class="impact-item">
                <span class="metric-name">Team Burnout</span>
                <span class="impact-value" :class="currentImpact.impact.burn < 0 ? 'positive' : 'negative'">
                  {{ currentImpact.impact.burn > 0 ? '+' : '' }}{{ currentImpact.impact.burn }}
                </span>
              </div>
              <div v-if="currentImpact.impact?.lead" class="impact-item">
                <span class="metric-name">Lead Time</span>
                <span class="impact-value" :class="currentImpact.impact.lead < 0 ? 'positive' : 'negative'">
                  {{ currentImpact.impact.lead > 0 ? '+' : '' }}{{ currentImpact.impact.lead }} days
                </span>
              </div>
              <div v-if="currentImpact.impact?.mttr" class="impact-item">
                <span class="metric-name">MTTR</span>
                <span class="impact-value" :class="currentImpact.impact.mttr < 0 ? 'positive' : 'negative'">
                  {{ currentImpact.impact.mttr > 0 ? '+' : '' }}{{ currentImpact.impact.mttr }} hours
                </span>
              </div>
              <div v-if="currentImpact.impact?.cfr" class="impact-item">
                <span class="metric-name">Change Failure Rate</span>
                <span class="impact-value" :class="currentImpact.impact.cfr < 0 ? 'positive' : 'negative'">
                  {{ currentImpact.impact.cfr > 0 ? '+' : '' }}{{ currentImpact.impact.cfr }}%
                </span>
              </div>
              <div v-if="currentImpact.impact?.cost" class="impact-item">
                <span class="metric-name">Operating Cost</span>
                <span class="impact-value" :class="currentImpact.impact.cost < 0 ? 'positive' : 'negative'">
                  {{ currentImpact.impact.cost > 0 ? '+' : '' }}{{ currentImpact.impact.cost }}
                </span>
              </div>
            </div>
          </div>

          <div class="continue-section">
            <button class="continue-btn" @click="closeImpactModal">
              Continue to Next Scenario →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

// Define emits
const emit = defineEmits(['game-started', 'game-restarted', 'manage-scenarios'])

// Default scenarios
const defaultScenarios = [
  {
    id: 'security-incident',
    title: 'Security vulnerability discovered in production',
    text: 'A critical SQL injection vulnerability is found in your user authentication system. Customer data may be at risk.',
    choices: [
      { label: 'Immediately take the system offline for emergency patching', tag: 'nodevops', impact: { mttr: -2, cfr: +15, sat: -12, cost: +25, burn: +8 }, note: 'Secure but causes major downtime and customer frustration.' },
      { label: 'Deploy automated security scanning in CI/CD pipeline', tag: 'devops', impact: { lead: +1, cfr: -8, cost: +18, sat: +3, burn: -2 }, note: 'Prevents future issues with systematic approach.' },
      { label: 'Apply hotfix during maintenance window', tag: 'mixed', impact: { mttr: +2, cfr: -3, sat: -4, cost: +8, burn: +3 }, note: 'Balanced approach but leaves window of vulnerability.' }
    ]
  },
  {
    id: 'database-performance',
    title: 'Database performance degrading under load',
    text: 'Response times are increasing during peak hours. Some queries timeout after 30 seconds.',
    choices: [
      { label: 'Scale vertically by upgrading server hardware', tag: 'nodevops', impact: { mttr: -1, lead: +1, cost: +35, sat: +2, burn: +1 }, note: 'Quick fix but expensive and not sustainable.' },
      { label: 'Implement database sharding strategy', tag: 'devops', impact: { lead: +4, cfr: +5, cost: +28, sat: -3, burn: +6 }, note: 'Long-term solution but complex implementation.' },
      { label: 'Add caching layer and optimize queries', tag: 'devops', impact: { mttr: -2, lead: -1, cfr: -4, cost: +12, sat: +5, burn: -1 }, note: 'Improves performance with manageable complexity.' }
    ]
  },
  {
    id: 'legacy-migration',
    title: 'Legacy system blocking new features',
    text: 'A 10-year-old monolith handles payments. Adding new payment methods requires weeks of changes.',
    choices: [
      { label: 'Continue extending the monolith with workarounds', tag: 'nodevops', impact: { lead: +5, cfr: +8, sat: -6, burn: +5, cost: -5 }, note: 'Cheaper short-term but technical debt grows.' },
      { label: 'Strangler Fig pattern: gradually extract services', tag: 'devops', impact: { lead: -3, cfr: -2, cost: +20, sat: +4, burn: -3 }, note: 'Sustainable modernization with controlled risk.' },
      { label: 'Big-bang rewrite of the entire payment system', tag: 'mixed', impact: { lead: +8, cfr: +12, cost: +45, sat: -8, burn: +10 }, note: 'High risk, high reward approach with major disruption.' }
    ]
  },
  {
    id: 'team-scaling',
    title: 'Engineering team doubled in size',
    text: 'You hired 15 new developers. Coordination is becoming chaotic and code conflicts are frequent.',
    choices: [
      { label: 'Implement trunk-based development with feature flags', tag: 'devops', impact: { lead: -4, cfr: -6, cost: +15, sat: +8, burn: -4 }, note: 'Reduces merge conflicts and improves flow.' },
      { label: 'Create separate teams with individual repositories', tag: 'mixed', impact: { lead: +2, cfr: +3, cost: +8, sat: -2, burn: +2 }, note: 'Reduces conflicts but may create silos.' },
      { label: 'Establish code review gates and approval processes', tag: 'nodevops', impact: { lead: +6, cfr: -2, sat: -5, burn: +4, cost: +5 }, note: 'Quality control but slows down delivery.' }
    ]
  },
  {
    id: 'compliance-audit',
    title: 'SOC 2 compliance audit approaching',
    text: 'Your startup needs SOC 2 certification. Auditors want evidence of security controls and change management.',
    choices: [
      { label: 'Hire compliance consultants and manual documentation', tag: 'nodevops', impact: { cost: +40, lead: +4, sat: -6, burn: +8, cfr: +2 }, note: 'Expensive and doesn\'t improve actual security.' },
      { label: 'Implement GitOps with audit trails and automated policies', tag: 'devops', impact: { cost: +25, lead: -2, cfr: -5, sat: +3, burn: -2 }, note: 'Compliance through better engineering practices.' },
      { label: 'Document existing processes and add manual approvals', tag: 'mixed', impact: { cost: +15, lead: +3, sat: -3, burn: +3, cfr: +1 }, note: 'Meets compliance but adds bureaucracy.' }
    ]
  },
  {
    id: 'cloud-costs',
    title: 'Cloud costs increased 300% last quarter',
    text: 'AWS bill shows runaway compute and storage costs. Finance is demanding immediate action.',
    choices: [
      { label: 'Immediately downsize instances to reduce costs', tag: 'nodevops', impact: { cost: -25, cfr: +10, sat: -8, mttr: +3, burn: +5 }, note: 'Quick savings but performance and reliability suffer.' },
      { label: 'Implement FinOps with cost monitoring and right-sizing', tag: 'devops', impact: { cost: -15, lead: -1, sat: +4, burn: -2, cfr: -2 }, note: 'Sustainable cost optimization with better visibility.' },
      { label: 'Negotiate reserved instances and annual contracts', tag: 'mixed', impact: { cost: -20, lead: +1, sat: +1, burn: +1, cfr: 0 }, note: 'Good savings but less flexibility for growth.' }
    ]
  },
  {
    id: 'api-versioning',
    title: 'Breaking API changes needed for mobile app',
    text: 'The mobile team needs a new API version. Current API has performance issues but 50+ integrations depend on it.',
    choices: [
      { label: 'Version the API and maintain both simultaneously', tag: 'devops', impact: { lead: -2, cost: +20, cfr: -4, sat: +6, burn: +3 }, note: 'Clean evolution path but maintenance overhead.' },
      { label: 'Force all clients to migrate to new API at once', tag: 'nodevops', impact: { lead: +4, cfr: +15, sat: -10, burn: +8, cost: +10 }, note: 'Simplifies codebase but breaks existing integrations.' },
      { label: 'Proxy pattern with gradual feature migration', tag: 'devops', impact: { lead: +1, cost: +15, cfr: -2, sat: +3, burn: +2 }, note: 'Smooth transition with controlled complexity.' }
    ]
  },
  {
    id: 'on-call-fatigue',
    title: 'On-call engineers experiencing burnout',
    text: 'Your team gets paged 15+ times per week. Sleep deprivation is affecting code quality and team morale.',
    choices: [
      { label: 'Hire more engineers to share on-call rotation', tag: 'nodevops', impact: { cost: +30, burn: -3, sat: +2, cfr: +3, mttr: +1 }, note: 'Reduces individual load but doesn\'t fix root causes.' },
      { label: 'Implement SRE practices with SLA/SLI and error budgets', tag: 'devops', impact: { burn: -6, sat: +8, cfr: -8, mttr: -4, cost: +18 }, note: 'Systematic approach to reliability and alert quality.' },
      { label: 'Reduce alert sensitivity to avoid false positives', tag: 'mixed', impact: { burn: -4, sat: +3, cfr: +5, mttr: +2, cost: +2 }, note: 'Less fatigue but may miss real issues.' }
    ]
  },
  {
    id: 'data-pipeline',
    title: 'Analytics pipeline failing silently',
    text: 'Business discovers month-old data gaps in reports. The ETL process has been failing without notifications.',
    choices: [
      { label: 'Add manual data validation checkpoints', tag: 'nodevops', impact: { cost: +12, burn: +6, sat: -2, cfr: +4, lead: +2 }, note: 'Human oversight but slow and error-prone.' },
      { label: 'Implement data observability and automated testing', tag: 'devops', impact: { cost: +22, cfr: -6, mttr: -3, sat: +5, burn: -2 }, note: 'Prevents data quality issues proactively.' },
      { label: 'Schedule periodic manual audits of data quality', tag: 'mixed', impact: { cost: +8, cfr: +2, sat: +1, burn: +2, mttr: -1 }, note: 'Catches issues but reactively.' }
    ]
  },
  {
    id: 'container-strategy',
    title: 'Microservices deployment complexity growing',
    text: 'You have 25 services across different environments. Deployments take hours and configuration drift is common.',
    choices: [
      { label: 'Adopt Kubernetes with GitOps deployment patterns', tag: 'devops', impact: { lead: -5, cfr: -8, cost: +25, sat: +6, burn: +4 }, note: 'Powerful but complex platform with learning curve.' },
      { label: 'Standardize on Docker Compose for all environments', tag: 'mixed', impact: { lead: -2, cfr: -3, cost: +8, sat: +2, burn: +1 }, note: 'Simpler but may not scale for complex needs.' },
      { label: 'Continue with custom deployment scripts', tag: 'nodevops', impact: { lead: +3, cfr: +6, cost: +5, sat: -4, burn: +5 }, note: 'Familiar but increasingly brittle and error-prone.' }
    ]
  }
]

// Load scenarios from localStorage or use defaults
function loadScenarios() {
  const saved = localStorage.getItem('devops-scenarios')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultScenarios
    } catch (error) {
      console.error('Failed to load scenarios from localStorage:', error)
    }
  }
  return defaultScenarios
}

const scenarios = loadScenarios()

const state = reactive({
  idx: 0,
  sat: 70,
  burn: 30,
  lead: 10,
  mttr: 8,
  cfr: 30,
  cost: 100,
  log: [],
  picks: []
})

const showIntro = ref(true)
const showHelpModal = ref(false)
const showImpactModal = ref(false)
const choiceMade = ref(false)
const selectedChoiceIndex = ref(-1)
const pickedAlign = ref('')
const pickedNote = ref('')
const currentImpact = ref({})
const pendingChoice = ref(null)

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const fmt = (n) => Number.isInteger(n) ? n : n.toFixed(1)

const current = computed(() => scenarios[state.idx])
const currentNumber = computed(() => state.idx + 1)
const isFinished = computed(() => state.idx >= scenarios.length)

const invLeadBar = computed(() => 100 - (state.lead / 60) * 100)
const invMttrBar = computed(() => 100 - (state.mttr / 72) * 100)
const invCostBar = computed(() => 100 - ((state.cost - 50) / (400 - 50)) * 100)
const logTop = computed(() => state.log.slice(0, 10))

const score = computed(() => {
  const sat = state.sat
  const burn = 100 - state.burn
  const lead = 100 - ((state.lead - 1) / (60 - 1)) * 100
  const mttr = 100 - ((state.mttr - 1) / (72 - 1)) * 100
  const cfr = 100 - state.cfr
  const cost = 100 - ((state.cost - 50) / (400 - 50)) * 100
  const s = (sat * 0.2 + burn * 0.2 + lead * 0.2 + mttr * 0.2 + cfr * 0.15 + cost * 0.05)
  return clamp(s, 0, 100)
})

function applyImpact(impact) {
  const before = { ...state }
  for (const [k, delta] of Object.entries(impact)) {
    if (k in state) state[k] += delta
  }
  state.sat = clamp(state.sat, 0, 100)
  state.burn = clamp(state.burn, 0, 100)
  state.lead = clamp(state.lead, 1, 60)
  state.mttr = clamp(state.mttr, 1, 72)
  state.cfr = clamp(state.cfr, 0, 100)
  state.cost = clamp(state.cost, 50, 400)
}

function onChoose(i) {
  const choice = current.value.choices[i]
  const align = choice.tag === 'devops' ? 'DevOps' : choice.tag === 'mixed' ? 'Hybrid' : 'No DevOps'
  const beforeState = { ...state }
  
  // Store the choice but don't apply impact yet
  pendingChoice.value = choice
  selectedChoiceIndex.value = i
  pickedAlign.value = align
  pickedNote.value = choice.note
  
  currentImpact.value = {
    choice: choice.label,
    align,
    note: choice.note,
    impact: choice.impact,
    before: beforeState,
    after: null // Will be calculated when impact is applied
  }
  
  choiceMade.value = true
}

function goNext() {
  showImpactModal.value = true
}

function closeImpactModal() {
  // Apply the impact when user confirms to continue
  if (pendingChoice.value) {
    applyImpact(pendingChoice.value.impact)
    
    // Update the currentImpact with the actual after state
    currentImpact.value.after = { ...state }
    
    // Add to picks history
    state.picks.push({ 
      idx: state.idx, 
      title: current.value.title, 
      align: pickedAlign.value 
    })
    
    pendingChoice.value = null
  }
  
  showImpactModal.value = false
  state.idx++
  choiceMade.value = false
  selectedChoiceIndex.value = -1
  pickedAlign.value = ''
  pickedNote.value = ''
  currentImpact.value = {}
}

function startGame() {
  showIntro.value = false
  emit('game-started')
}

function openHelpModal() {
  showHelpModal.value = true
}

function closeHelpModal() {
  showHelpModal.value = false
}

function goToScenarioManager() {
  showHelpModal.value = false
  emit('manage-scenarios')
}

function restart() {
  state.idx = 0
  state.sat = 70
  state.burn = 30
  state.lead = 10
  state.mttr = 8
  state.cfr = 30
  state.cost = 100
  state.log = []
  state.picks = []
  choiceMade.value = false
  selectedChoiceIndex.value = -1
  pickedAlign.value = ''
  pickedNote.value = ''
  showIntro.value = true
  showHelpModal.value = false
  showImpactModal.value = false
  currentImpact.value = {}
  pendingChoice.value = null
  emit('game-restarted')
}

// Expose showIntro to parent component
defineExpose({
  showIntro
})
</script>

<style scoped>
.wrap {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
}

.subtitle {
  font-size: 16px;
  margin-top: 8px;
  max-width: 480px;
}

.grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 32px;
  align-items: start;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .grid > aside {
    order: 2;
  }
  .grid > main {
    order: 1;
  }
}

.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.kpis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.kpi {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
}

.kpi h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
}

.kpi .val {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.bar {
  height: 8px;
  border-radius: 4px;
  background: #f0f0f0;
  overflow: hidden;
}

.bar > span {
  display: block;
  height: 100%;
  background: #007acc;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.scenario {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.scenario h3 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.scenario p {
  margin: 0;
  line-height: 1.5;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

button.choice {
  padding: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  background: white;
}

button.choice:hover:not(:disabled) {
  border-color: #007acc;
}

button.choice.selected {
  border-color: #28a745;
  background: #f8fff9;
}

button.choice.not-selected {
  opacity: 0.5;
}

button.choice:disabled {
  cursor: not-allowed;
}

.pill {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #ddd;
  background: #f8f9fa;
}

.pill.scenario-id {
  font-size: 10px;
  padding: 4px 8px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.next {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background: #007acc;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.next:hover:not(:disabled) {
  background: #0056b3;
}

.next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.score {
  font-size: 32px;
  font-weight: bold;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.restart {
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-weight: 600;
}

.restart:hover {
  background: #f8f9fa;
}

.intro-screen {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.intro-content {
  max-width: 800px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 32px;
}

.intro-header {
  text-align: center;
  margin-bottom: 24px;
}

.intro-title {
  font-size: 36px;
  font-weight: bold;
  margin: 0;
}

.intro-subtitle {
  font-size: 18px;
  margin: 8px 0 0 0;
}

.intro-description {
  text-align: center;
  margin-bottom: 24px;
}

.metrics-explanation {
  margin-bottom: 32px;
}

.metrics-explanation h2 {
  font-size: 24px;
  margin: 0 0 16px 0;
  text-align: center;
}

.metric-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
}

.metric-card.dora-metric {
  border-color: #28a745;
  background: #f8fff9;
}

.metric-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.metric-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
}

.metric-info p {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.start-game-btn {
  padding: 16px 32px;
  border: none;
  border-radius: 8px;
  background: #007acc;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 18px;
}

.start-game-btn:hover {
  background: #0056b3;
}

.help-btn {
  padding: 16px 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: 600;
}

.help-btn:hover {
  background: #f8f9fa;
}

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

.modal-content,
.impact-modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f8f9fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.close-btn:hover {
  background: #e9ecef;
}

.choice-summary {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.choice-summary h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
}

.impact-explanation {
  margin-bottom: 20px;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.impact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.impact-value.positive {
  color: #28a745;
  font-weight: bold;
}

.impact-value.negative {
  color: #dc3545;
  font-weight: bold;
}

.continue-section {
  text-align: center;
}

.continue-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background: #007acc;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.continue-btn:hover {
  background: #0056b3;
}

.modal-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  text-align: center;
}

.scenario-manager-btn {
  padding: 12px 24px;
  border: 2px solid #28a745;
  border-radius: 8px;
  background: white;
  color: #28a745;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.scenario-manager-btn:hover {
  background: #28a745;
  color: white;
}

@media (max-width: 768px) {
  .metric-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .intro-title {
    font-size: 28px;
  }
}
</style>
