# 🚀 DevOps Choice Game - DORA Metrics Simulator

A **CTO Decision Simulator** that helps you understand how different approaches to software delivery affect DORA metrics, team well-being, and operational costs.

## 🎯 What is this?

This interactive game presents real-world scenarios that CTOs face daily. Make decisions and see how they impact the 4 key DORA metrics:

- **Deployment Frequency** 🚀 - How often your team deploys code to production
- **Lead Time for Changes** ⚡ - Time from code commit to production deployment  
- **Change Failure Rate** ❌ - Percentage of deployments that cause production failures
- **Mean Time to Recovery** 🔧 - How quickly you can recover from production incidents

## 🎮 Game Features

- **10 challenging scenarios** covering security, performance, scaling, compliance, and more
- **3 response options** per scenario: DevOps, Traditional, or Hybrid approaches
- **Visual impact analysis** showing how decisions affect metrics
- **Scenario management system** for creating custom questions
- **Real-time DORA metrics tracking** with interactive charts

## 🛠️ Tech Stack

- **Vue 3** with Composition API
- **Vite** for fast development and building
- **CSS Grid & Flexbox** for responsive design
- **LocalStorage** for data persistence
- **Modular components** for maintainability

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/devops-choice-game.git
cd devops-choice-game

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── DevOpsChoiceGame.vue    # Main game component
│   └── ScenarioManager.vue     # Admin interface for scenarios
├── App.vue                     # Root component
├── main.js                     # Application entry point
└── style.css                   # Global styles
```

## 🎲 Game Scenarios

Scenarios are defined in `src/components/DevOpsChoiceGame.vue` in the `defaultScenarios` array. Each scenario includes:

```javascript
{
  id: 'unique-identifier',
  title: 'Scenario Title',
  text: 'Scenario description...',
  choices: [
    {
      label: 'Choice description',
      tag: 'devops|nodevops|mixed',
      impact: { 
        lead: -2,    // Lead Time change
        cfr: -4,     // Change Failure Rate change
        mttr: -1,    // Mean Time to Recovery change
        sat: +3,     // Team Satisfaction change
        burn: -2,    // Burnout change
        cost: +10    // Cost change
      },
      note: 'Explanation of the choice impact'
    }
  ]
}
```

## 🔧 Scenario Management

Access the scenario management interface by navigating to `/scenario-manager` in your browser. Features include:

- **Create new scenarios** with custom questions and answers
- **Edit existing scenarios** with form validation
- **Import/Export** scenarios as JSON
- **Side-by-side tabs** for DevOps vs Traditional choices
- **Real-time preview** of changes

## 🎨 Customization

### Adding New Scenarios
1. Open `src/components/DevOpsChoiceGame.vue`
2. Add new scenario objects to the `defaultScenarios` array
3. Follow the existing format for consistency

### Styling
- Global styles: `src/style.css`
- Component styles: Scoped styles in each `.vue` file
- CSS variables for consistent theming

### Metrics Configuration
Modify the initial state and constraints in the `state` object:

```javascript
const state = reactive({
  sat: 70,    // Team Satisfaction (0-100)
  burn: 30,   // Burnout (0-100)
  lead: 10,   // Lead Time (days)
  mttr: 8,    // Mean Time to Recovery (hours)
  cfr: 30,    // Change Failure Rate (percentage)
  cost: 100   // Cost Index (50-400)
})
```

## 🚀 Deployment

### GitHub Pages

1. **Create GitHub repository**:
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: DevOps Choice Game"

# Add remote repository
git remote add origin https://github.com/yourusername/devops-choice-game.git
git push -u origin main
```

2. **Configure GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as source
   - Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
        with:
          folder: dist
```

3. **Update Vite config** for GitHub Pages:

```javascript
// vite.config.js
export default {
  base: '/devops-choice-game/', // Replace with your repo name
  build: {
    outDir: 'dist'
  }
}
```

### Other Platforms

- **Netlify**: Connect repository and deploy automatically
- **Vercel**: Import project and deploy with zero config
- **Firebase Hosting**: Use Firebase CLI to deploy the `dist` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Understanding DORA Metrics

The game teaches the 4 key metrics from the [DORA State of DevOps](https://dora.dev/) research:

| Metric | Elite Performance | High Performance | Medium Performance | Low Performance |
|--------|------------------|------------------|-------------------|-----------------|
| **Deployment Frequency** | Multiple times/day | Between once/day and once/week | Between once/week and once/month | Fewer than once/month |
| **Lead Time** | Less than 1 day | Between 1 day and 1 week | Between 1 week and 1 month | More than 1 month |
| **Change Failure Rate** | 0-15% | 0-15% | 0-15% | 46-60% |
| **Recovery Time** | Less than 1 hour | Less than 1 day | Between 1 day and 1 week | More than 1 week |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the [DORA State of DevOps Report](https://dora.dev/)
- Built with [Vue.js](https://vuejs.org/) and [Vite](https://vitejs.dev/)
- Scenarios based on real-world CTO experiences

---

**Made with ❤️ for the DevOps community**
