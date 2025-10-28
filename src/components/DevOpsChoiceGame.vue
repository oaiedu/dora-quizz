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
              <div class="pill">{{ current.id }}</div>
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
}

function openHelpModal() {
  showHelpModal.value = true
}

function closeHelpModal() {
  showHelpModal.value = false
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
}
</script>

<style scoped>
:root{
  --bg:#0f172a;
  --panel:#111827;
  --muted:#94a3b8;
  --text:#e5e7eb;
  --accent:#22d3ee;
  --good:#10b981;
  --bad:#ef4444;
  --warn:#f59e0b;
}
*{box-sizing:border-box}

.wrap{
  max-width:1200px;
  margin:20px auto;
  padding:24px;
  position:relative;
  z-index:1;
}
header{display:flex;gap:24px;align-items:flex-start;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap}
.title{font-weight:800;font-size:32px;letter-spacing:-.02em;line-height:1.1;background:linear-gradient(135deg,#3b82f6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.subtitle{color:#ffffff;font-size:15px;line-height:1.5;margin-top:6px;max-width:480px}
.grid{display:grid;grid-template-columns:380px 1fr;gap:32px;align-items:start}
@media (max-width: 1024px){
  .grid{grid-template-columns:1fr;gap:24px}
}
.card{background:linear-gradient(145deg,rgba(15,23,42,0.7) 0%,rgba(30,41,59,0.6) 100%);backdrop-filter:blur(20px);border:1px solid rgba(59,130,246,0.3);border-radius:24px;padding:28px;box-shadow:0 8px 32px rgba(59,130,246,0.2)}
.status-header{margin-bottom:24px}
.status-header h3{margin:0;font-size:18px;font-weight:700;color:#ffffff;display:flex;align-items:center;gap:8px}
.kpis{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.kpi{background:linear-gradient(135deg,rgba(15,23,42,0.8) 0%,rgba(30,41,59,0.7) 100%);border:1px solid rgba(59,130,246,0.4);padding:18px;border-radius:16px;transition:all 0.3s ease;position:relative}


.kpi h4{margin:0 0 8px 0;font-size:12px;color:#ffffff;font-weight:600;letter-spacing:0.05em}
.kpi .val{font-size:20px;font-weight:700;margin-bottom:8px;color:#ffffff}
.bar{height:8px;border-radius:99px;background:rgba(15,23,42,0.6);overflow:hidden;border:1px solid rgba(59,130,246,0.2)}
.bar>span{display:block;height:100%;background:linear-gradient(90deg,#10b981 0%,#3b82f6 50%,#06b6d4 100%);border-radius:99px;transition:width 0.6s cubic-bezier(0.4,0,0.2,1);box-shadow:0 0 10px rgba(59,130,246,0.4)}
.scenario{display:flex;flex-direction:column;gap:24px}
.scenario h3{margin:0;font-size:20px;line-height:1.3;font-weight:700;color:#ffffff}
.scenario p{margin:0;color:#ffffff;line-height:1.5;font-size:15px}
.choices{
  display:flex;
  flex-direction:column;
  gap:20px;
  margin-top:20px;
  padding:0 4px;
}
button.choice{
  all:unset;
  display:block;
  background:linear-gradient(145deg,rgba(15,23,42,0.8) 0%,rgba(30,41,59,0.7) 100%);
  border:2px solid rgba(59,130,246,0.3);
  padding:28px;
  border-radius:24px;
  cursor:pointer;
  transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
  position:relative;
  overflow:hidden;
  backdrop-filter:blur(10px);
  box-shadow:0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05);
}

button.choice::before{
  content:'';
  position:absolute;
  top:0;left:0;right:0;bottom:0;
  background:linear-gradient(135deg,rgba(59,130,246,0.1),rgba(16,185,129,0.1));
  opacity:0;
  transition:all 0.3s ease;
  border-radius:24px;
}

button.choice:hover:not(:disabled){
  transform:translateY(-2px);
  box-shadow:0 12px 40px rgba(59,130,246,0.2), 0 0 0 1px rgba(255,255,255,0.1);
  border-color:rgba(59,130,246,0.5);
}

button.choice:hover::before{opacity:1}

button.choice.selected{
  background:linear-gradient(145deg,rgba(16,185,129,0.15) 0%,rgba(59,130,246,0.15) 100%);
  border:2px solid rgba(16,185,129,0.6);
  box-shadow:0 0 30px rgba(16,185,129,0.3), 0 8px 32px rgba(0,0,0,0.1);
  transform:translateY(-1px);
}

button.choice.selected::before{
  background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(59,130,246,0.2));
  opacity:1;
}

button.choice.not-selected{
  opacity:0.4;
  background:linear-gradient(145deg,rgba(15,23,42,0.4) 0%,rgba(30,41,59,0.3) 100%);
  border:2px solid rgba(148,163,184,0.15);
  transform:none;
  box-shadow:0 4px 16px rgba(0,0,0,0.05);
}

button.choice:disabled{
  opacity:0.6;
  cursor:not-allowed;
  transform:none;
}

button.choice div{
  font-weight:600;
  font-size:16px;
  color:#ffffff;
  line-height:1.5;
  position:relative;
  z-index:1;
}
.pill{font-size:16px;font-weight:600;padding:12px 24px;border-radius:24px;border:2px solid rgba(255,255,255,.25);color:#ffffff;background:rgba(255,255,255,.1);backdrop-filter:blur(8px);text-transform:uppercase;letter-spacing:0.5px}
.row{display:flex;align-items:center;justify-content:space-between}
.footer{display:flex;gap:16px;align-items:center;justify-content:space-between;margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1)}
.meta{font-size:13px;color:#ffffff;font-weight:500}
.tag-devops{
  color:#0ea5e9;
  background:rgba(14,165,233,.15);
  border-color:rgba(14,165,233,.4);
  box-shadow:0 4px 12px rgba(14,165,233,.2);
}
.tag-nodevops{
  color:#f87171;
  background:rgba(248,113,113,.15);
  border-color:rgba(248,113,113,.4);
  box-shadow:0 4px 12px rgba(248,113,113,.2);
}
.tag-mixed{
  color:#fbbf24;
  background:rgba(251,191,36,.15);
  border-color:rgba(251,191,36,.4);
  box-shadow:0 4px 12px rgba(251,191,36,.2);
}
.chips{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.chip{font-size:11px;padding:8px 12px;border-radius:999px;background:rgba(15,23,42,0.8);border:1px solid rgba(59,130,246,0.5);color:#ffffff;font-weight:600;text-transform:uppercase;letter-spacing:0.05em}
.next{all:unset;background:linear-gradient(135deg,#3b82f6,#06b6d4);padding:16px 24px;border-radius:12px;color:#ffffff;font-weight:700;cursor:pointer;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(59,130,246,0.4);border:1px solid rgba(255,255,255,0.1)}

.next[disabled]{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
.log{max-height:240px;overflow-y:auto;font-size:11px;color:#ffffff;background:linear-gradient(135deg,rgba(59,130,246,0.08),rgba(16,185,129,0.05));border:1px solid rgba(59,130,246,0.25);border-radius:16px;padding:16px;margin-top:20px;font-family:ui-monospace,'SF Mono',Consolas,monospace;backdrop-filter:blur(10px)}
.log p{margin:0 0 6px 0;line-height:1.4;padding:2px 0}
.log::-webkit-scrollbar{width:6px}
.log::-webkit-scrollbar-track{background:transparent}
.log::-webkit-scrollbar-thumb{background:rgba(148,163,184,0.3);border-radius:3px}
.log::-webkit-scrollbar-thumb:hover{background:rgba(148,163,184,0.5)}
.impact{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.score{font-size:28px;font-weight:800}
.center{display:flex;align-items:center;justify-content:center;text-align:center}
.restart{all:unset;background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(16,185,129,0.2));border:2px solid rgba(255,255,255,0.2);padding:14px 20px;border-radius:12px;color:#ffffff;cursor:pointer;font-weight:600;transition:all 0.3s ease}

.small{font-size:12px;color:#ffffff}
.feedback{margin-top:24px;padding:24px;border-radius:20px;background:linear-gradient(135deg,rgba(16,185,129,0.15),rgba(59,130,246,0.12));border:2px solid rgba(16,185,129,0.4);animation:slideIn 0.5s ease-out;box-shadow:0 8px 25px rgba(16,185,129,0.1);backdrop-filter:blur(15px)}
@keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
.list{margin-top:8px;display:grid;gap:6px}
.list .item{display:flex;justify-content:space-between;align-items:center;background:#0b1222;border:1px solid rgba(255,255,255,.08);padding:10px;border-radius:10px}

/* Intro Screen Styles */
.intro-screen{
  min-height:calc(100vh - 80px);
  display:flex;
  align-items:flex-start;
  justify-content:center;
  padding:0;
}
.intro-content{
  max-width:900px;
  width:100%;
  background:linear-gradient(145deg,rgba(15,23,42,0.8) 0%,rgba(30,41,59,0.7) 100%);
  backdrop-filter:blur(20px);
  border:1px solid rgba(59,130,246,0.3);
  border-radius:24px;
  padding:20px;
  box-shadow:0 20px 60px rgba(59,130,246,0.2);
}

.intro-header{text-align:center;margin-bottom:16px}
.intro-title{font-size:36px;font-weight:800;margin:0;background:linear-gradient(135deg,#3b82f6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.1}
.intro-subtitle{font-size:16px;color:#94a3b8;margin:4px 0 0 0;font-weight:500}

.intro-description{text-align:center;margin-bottom:18px}
.intro-description p{font-size:18px;color:#ffffff;line-height:1.6;margin:0}

.metrics-explanation{margin-bottom:18px}
.metrics-explanation h2{font-size:20px;color:#ffffff;margin:0 0 10px 0;text-align:center}
.metrics-explanation > p{font-size:14px;color:#cbd5e1;text-align:center;margin:0 0 14px 0;line-height:1.4}

.metric-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
.metric-card{background:linear-gradient(135deg,rgba(15,23,42,0.6) 0%,rgba(30,41,59,0.5) 100%);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:14px;display:flex;gap:10px}
.metric-card.dora-metric{border:2px solid rgba(16,185,129,0.4);background:linear-gradient(135deg,rgba(16,185,129,0.1) 0%,rgba(59,130,246,0.1) 100%)}
.metric-icon{font-size:26px;flex-shrink:0}
.metric-info h3{margin:0 0 4px 0;font-size:15px;color:#ffffff;font-weight:700}
.metric-info p{margin:0 0 7px 0;font-size:13px;color:#cbd5e1;line-height:1.3}
.metric-range{font-size:11px;color:#10b981;font-weight:600;background:rgba(16,185,129,0.1);padding:3px 6px;border-radius:4px;display:inline-block}

.additional-metrics{margin-top:10px;padding:14px;background:linear-gradient(135deg,rgba(30,41,59,0.3) 0%,rgba(15,23,42,0.3) 100%);border:1px solid rgba(148,163,184,0.2);border-radius:12px}
.additional-metrics h3{margin:0 0 6px 0;font-size:14px;color:#ffffff;text-align:center}
.additional-metrics p{margin:0 0 8px 0;font-size:12px;color:#cbd5e1;text-align:center}
.extra-metrics{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.extra-metric{font-size:12px;padding:6px 12px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:20px;color:#ffffff;font-weight:500}

.game-instructions{margin-bottom:40px}
.game-instructions h2{font-size:24px;color:#ffffff;margin:0 0 24px 0;text-align:center}
.instruction-steps{display:grid;gap:20px}
.step{display:flex;gap:16px;align-items:flex-start}
.step-number{background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#ffffff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}
.step-content h3{margin:0 0 4px 0;font-size:16px;color:#ffffff;font-weight:700}
.step-content p{margin:0;font-size:14px;color:#cbd5e1;line-height:1.5}

.action-buttons{display:flex;gap:16px;justify-content:center;align-items:center;flex-wrap:wrap}
.start-game-btn{all:unset;background:linear-gradient(135deg,#3b82f6,#06b6d4);padding:20px 40px;border-radius:16px;color:#ffffff;font-weight:700;cursor:pointer;font-size:18px;box-shadow:0 8px 25px rgba(59,130,246,0.4);border:2px solid rgba(255,255,255,0.1);transition:all 0.3s ease}
.start-game-btn:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(59,130,246,0.5)}
.help-btn{all:unset;background:linear-gradient(135deg,rgba(148,163,184,0.2),rgba(100,116,139,0.2));padding:20px 32px;border-radius:16px;color:#cbd5e1;font-weight:600;cursor:pointer;font-size:16px;border:2px solid rgba(148,163,184,0.3);transition:all 0.3s ease}
.help-btn:hover{background:linear-gradient(135deg,rgba(148,163,184,0.3),rgba(100,116,139,0.3));color:#ffffff;transform:translateY(-1px)}
.btn-text{display:flex;align-items:center;gap:8px}

/* Modal Styles */
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px}
.modal-content{background:linear-gradient(145deg,rgba(15,23,42,0.95) 0%,rgba(30,41,59,0.95) 100%);backdrop-filter:blur(20px);border:1px solid rgba(59,130,246,0.3);border-radius:24px;padding:32px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
.modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid rgba(148,163,184,0.2)}
.modal-header h2{margin:0;font-size:24px;color:#ffffff}
.close-btn{all:unset;width:32px;height:32px;border-radius:50%;background:rgba(148,163,184,0.2);color:#cbd5e1;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:bold;transition:all 0.2s ease}
.close-btn:hover{background:rgba(239,68,68,0.3);color:#ffffff}
.modal-body{color:#cbd5e1}

/* Impact Modal Styles */
.impact-modal-content{background:linear-gradient(145deg,rgba(15,23,42,0.95) 0%,rgba(30,41,59,0.95) 100%);backdrop-filter:blur(20px);border:1px solid rgba(59,130,246,0.3);border-radius:24px;padding:32px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
.choice-summary{margin-bottom:24px;padding:20px;background:linear-gradient(135deg,rgba(59,130,246,0.1) 0%,rgba(16,185,129,0.1) 100%);border:1px solid rgba(59,130,246,0.3);border-radius:16px}
.choice-summary h3{margin:0 0 12px 0;font-size:16px;color:#ffffff}
.choice-text{font-size:15px;color:#e2e8f0;margin-bottom:12px;font-weight:600}
.choice-alignment{display:flex;justify-content:center;margin:16px 0}
.impact-explanation{margin-bottom:24px}
.impact-explanation h3{margin:0 0 12px 0;font-size:16px;color:#ffffff}
.impact-explanation p{margin:0;font-size:14px;color:#cbd5e1;line-height:1.5}
.metrics-impact h3{margin:0 0 16px 0;font-size:16px;color:#ffffff}
.impact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:24px}
.impact-item{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:linear-gradient(135deg,rgba(15,23,42,0.7) 0%,rgba(30,41,59,0.6) 100%);border:1px solid rgba(148,163,184,0.2);border-radius:12px}
.metric-name{font-size:13px;color:#cbd5e1;font-weight:600}
.impact-value{font-size:14px;font-weight:700;padding:4px 8px;border-radius:6px}
.impact-value.positive{color:#10b981;background:rgba(16,185,129,0.2)}
.impact-value.negative{color:#ef4444;background:rgba(239,68,68,0.2)}
.continue-section{text-align:center}
.continue-btn{all:unset;background:linear-gradient(135deg,#3b82f6,#06b6d4);padding:16px 32px;border-radius:12px;color:#ffffff;font-weight:700;cursor:pointer;font-size:16px;box-shadow:0 4px 15px rgba(59,130,246,0.4);border:1px solid rgba(255,255,255,0.1);transition:all 0.3s ease}
.continue-btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(59,130,246,0.5)}

@media (max-width: 1024px){
  .metric-cards{grid-template-columns:repeat(2,1fr);gap:8px}
}

@media (max-width: 768px){
  .intro-content{padding:14px 16px}
  .intro-title{font-size:28px}
  .intro-subtitle{font-size:14px}
  .metric-cards{grid-template-columns:1fr;gap:10px}
  .intro-description p{font-size:13px}
  .intro-screen{padding:6px 12px;padding-top:14px}
  .intro-header{margin-bottom:12px}
  .intro-description{margin-bottom:14px}
  .metrics-explanation{margin-bottom:14px}
}
</style>
