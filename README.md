# ─── Playwright Enterprise Automation Framework ───────────────────────────────
#
# Production-ready Hybrid POM framework
# Playwright + TypeScript | Allure + HTML Reports | GitHub Actions + Jenkins
# ─────────────────────────────────────────────────────────────────────────────

## 📐 Architecture

```
playwright-enterprise-framework/
├── src/
│   ├── config/
│   │   └── env.config.ts           # Typed, env-aware configuration
│   ├── pages/
│   │   ├── base.page.ts            # Abstract base page (navigation, URL utils)
│   │   ├── login.page.ts           # LoginPage POM
│   │   └── dashboard.page.ts       # DashboardPage POM (composes NavbarComponent)
│   ├── components/
│   │   ├── navbar.component.ts     # Reusable Navbar (menu, cart, logout)
│   │   └── modal.component.ts      # Reusable Modal (confirm/cancel/close)
│   ├── services/
│   │   ├── api.client.ts           # Generic API client (GET/POST/PUT/DELETE)
│   │   └── auth.service.ts         # Auth-domain API service
│   ├── fixtures/
│   │   └── base.fixture.ts         # Custom fixtures (loginPage, dashboardPage,
│   │                               #   authService, authenticatedPage)
│   ├── utils/
│   │   ├── logger.ts               # Winston logger (console + file + errors.log)
│   │   ├── wait.helper.ts          # Explicit wait helpers (no hard waits)
│   │   ├── dropdown.helper.ts      # Native & custom dropdown helpers
│   │   ├── date.helper.ts          # Date formatting & timestamp utilities
│   │   └── screenshot.helper.ts   # Full-page & element screenshots w/ attachment
│   ├── test-data/
│   │   └── users.data.ts           # Centralised, typed test data
│   └── tests/
│       ├── auth/
│       │   └── login.spec.ts       # 5 login tests (@smoke / @regression)
│       ├── dashboard/
│       │   └── dashboard.spec.ts   # 7 dashboard tests (@smoke / @regression)
│       ├── api/
│       │   └── auth.api.spec.ts    # 3 pure API tests (@api)
│       └── e2e/
│           └── full-flow.spec.ts   # Full E2E journey (@smoke @e2e)
├── .github/
│   └── workflows/
│       └── playwright.yml          # GH Actions: type-check → 4-shard → Allure Pages
├── reports/
│   ├── logs/                       # Winston log files
│   └── screenshots/                # Manual screenshots
├── allure-results/                 # Raw Allure data
├── playwright-report/              # Playwright HTML report
├── .env                            # Local QA secrets (git-ignored)
├── .env.example                    # Template for team onboarding
├── .env.dev / .env.prod            # Per-environment overrides (git-ignored)
├── playwright.config.ts            # Multi-project, multi-reporter config
├── tsconfig.json                   # Strict TypeScript + path aliases
├── package.json                    # Scripts + dependencies
├── Jenkinsfile                     # Declarative Jenkins pipeline
└── .gitignore
```

---

## 🚀 Quick Start

### 1. Install

```bash
npm install
npx playwright install --with-deps
```

### 2. Configure

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Run Tests

| Command | Purpose |
|---|---|
| `npm test` | All tests, headless |
| `npm run test:headed` | All tests, visible browser |
| `npm run test:smoke` | Smoke suite only (`@smoke`) |
| `npm run test:regression` | Regression suite (`@regression`) |
| `npm run test:api` | API tests only (`@api`) |
| `npm run test:debug` | Single test with Playwright Inspector |

### 4. Multi-Environment

```bash
# Run against dev
ENV=dev npm test

# Run against prod
ENV=prod npm test
```

### 5. Sharded CI run (local simulation)

```bash
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

---

## 📊 Reporting

### Playwright HTML Report

```bash
npm run report          # Open built-in HTML report
```

### Allure Report

```bash
npm run allure:generate   # Build report from allure-results/
npm run allure:open       # Open in browser
npm run allure:serve      # Live-serve from allure-results/
```

---

## 🏗️ Key Design Decisions

| Principle | Implementation |
|---|---|
| **SOLID — Single Responsibility** | Each class has one job: Page ≠ Component ≠ Service |
| **Open/Closed** | `BasePage` extended by all pages — never modified |
| **No Hard Waits** | Only `WaitHelper`, Playwright auto-waiting, `waitFor()` |
| **Test Independence** | `authenticatedPage` fixture handles own teardown (logout) |
| **Secret Safety** | Credentials via `.env` / CI secrets — never committed |
| **Tagging Strategy** | `@smoke`, `@regression`, `@api`, `@e2e` — run subsets in CI |
| **Path Aliases** | `@pages/*`, `@utils/*` etc. — clean imports, no `../../` |

---

## 🔧 CI/CD

### GitHub Actions
- **TypeScript gate** runs before tests (fast fail on type errors)
- **4-shard matrix** runs tests in parallel across 4 workers
- Artifacts uploaded per shard, merged for Allure
- Allure history deployed to **GitHub Pages** on `main` push

### Jenkins
- Parameterised: choose `ENV`, `BROWSER`, `SMOKE_ONLY`
- Stages: Checkout → Install → Type-check → Test → Allure → Archive
- Credentials injected from Jenkins credentials store (never in code)

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `@playwright/test` | Core test runner + browser automation |
| `allure-playwright` | Allure reporter integration |
| `winston` | Structured logging |
| `dotenv` | `.env` file loading |
| `typescript` | Type safety |
