// FinCity — Main Game Logic

const MONTHS_IT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

const BUILDINGS = {
  HOME: {
    id: 'HOME', emoji: '🏠', name: 'Casa',
    description: 'La tua abitazione. Spesa fissa ogni mese.',
    monthlyCost: 800, placed: true, locked: true,
    tooltip: 'Spesa fissa mensile: €800 (affitto + utenze)'
  },
  WORK: {
    id: 'WORK', emoji: '💼', name: 'Lavoro',
    description: 'La tua fonte di reddito principale.',
    monthlyIncome: 2000, placed: true, locked: true,
    tooltip: 'Stipendio mensile netto: €2.000'
  },
  SAVINGS: {
    id: 'SAVINGS', emoji: '🏦', name: 'Conto Risparmio',
    description: 'Metti da parte una quota ogni mese. Interesse annuo 2%.',
    buildCost: 0, monthlySaving: 200, interestRate: 0.02,
    placed: false,
    tooltip: 'Risparmio mensile: €200 | Interesse: 2% annuo\nIl metodo "pagati prima": accantona prima di spendere.'
  },
  EMERGENCY: {
    id: 'EMERGENCY', emoji: '🛡️', name: 'Fondo Emergenza',
    description: 'La tua rete di sicurezza per gli imprevisti.',
    buildCost: 0, monthlyContribution: 150,
    placed: false,
    tooltip: 'Contributo mensile: €150\nObiettivo: 3 mesi di spese (€3.000)\nProtegge da guasti, spese mediche, imprevisti.'
  },
  ETF: {
    id: 'ETF', emoji: '📈', name: 'Investimento ETF',
    description: 'Fondi diversificati a basso costo. Rendimento atteso: ~7% annuo.',
    buildCost: 200, monthlyInvestment: 200,
    placed: false,
    tooltip: 'Investimento mensile: €200 | Rendimento atteso: 7%/anno\nETF = paniere di azioni diversificate.\nMigliore con orizzonte > 10 anni.'
  },
  EDUCATION: {
    id: 'EDUCATION', emoji: '🎓', name: 'Formazione',
    description: 'Investi in te stesso. Aumenta il reddito nel tempo.',
    buildCost: 500, incomeBoost: 150, unlockMonth: 6,
    placed: false,
    tooltip: 'Costo una tantum: €500\n+€150/mese al tuo stipendio dopo 3 mesi\nROI: si ripaga in ~3 mesi.'
  },
  PARK: {
    id: 'PARK', emoji: '🌳', name: 'Qualità della vita',
    description: 'Spendi un po\' per il benessere. La felicità conta!',
    buildCost: 0, monthlyCost: 100, happinessBoost: 20,
    placed: false,
    tooltip: 'Costo mensile: €100 | +20 felicità\nIl benessere influenza la produttività.'
  }
};

let gameState = {
  month: 1,
  year: 2024,
  cash: 300,
  monthlyIncome: 2000,
  monthlyExpenses: 800,
  savings: 0,
  monthlySavings: 0,
  emergencyFund: 0,
  monthlyEmergency: 0,
  investments: 0,
  monthlyInvestments: 0,
  debt: 0,
  happiness: 60,
  financialScore: 0,
  buildings: { HOME: true, WORK: true },
  currentScenario: null,
  history: [],
  milestones: new Set(),
  gamePhase: 'playing', // 'playing' | 'event' | 'game_over' | 'victory'
  pendingIncomeBoost: 0,
  educationCountdown: 0,
};

function calculateNetWorth() {
  return gameState.cash + gameState.savings + gameState.emergencyFund + gameState.investments - gameState.debt;
}

function calculateScore() {
  let score = 0;
  const nw = calculateNetWorth();
  const monthlyBuffer = gameState.monthlyIncome - gameState.monthlyExpenses;

  score += Math.min(30, (gameState.emergencyFund / (gameState.monthlyExpenses * 3)) * 30);
  score += Math.min(30, (gameState.savings / (gameState.monthlyIncome * 6)) * 30);
  score += Math.min(25, (gameState.investments / (gameState.monthlyIncome * 12)) * 25);
  score += gameState.debt === 0 ? 10 : Math.max(0, 10 - (gameState.debt / 1000));
  score += gameState.happiness > 60 ? 5 : 0;

  return Math.round(Math.min(100, Math.max(0, score)));
}

function processMonth() {
  if (gameState.gamePhase === 'event') return;

  // Income
  gameState.cash += gameState.monthlyIncome;

  // Fixed expenses
  gameState.cash -= gameState.monthlyExpenses;

  // Savings contribution
  if (gameState.monthlySavings > 0 && gameState.cash >= gameState.monthlySavings) {
    const actual = Math.min(gameState.monthlySavings, gameState.cash);
    gameState.cash -= actual;
    gameState.savings += actual;
    gameState.savings *= (1 + BUILDINGS.SAVINGS.interestRate / 12);
  }

  // Emergency fund contribution
  if (gameState.monthlyEmergency > 0 && gameState.cash >= gameState.monthlyEmergency) {
    const actual = Math.min(gameState.monthlyEmergency, gameState.cash);
    gameState.cash -= actual;
    gameState.emergencyFund += actual;
  }

  // Investment contribution + market return
  if (gameState.monthlyInvestments > 0 && gameState.cash >= gameState.monthlyInvestments) {
    const actual = Math.min(gameState.monthlyInvestments, gameState.cash);
    gameState.cash -= actual;
    gameState.investments += actual;
  }
  if (gameState.investments > 0) {
    const monthlyReturn = getMarketReturn();
    gameState.investments = Math.round(gameState.investments * (1 + monthlyReturn));
  }

  // Debt interest (12% annual)
  if (gameState.debt > 0) {
    gameState.debt = Math.round(gameState.debt * (1 + 0.01));
    // Minimum payment
    const payment = Math.min(200, gameState.cash, gameState.debt);
    gameState.cash -= payment;
    gameState.debt -= payment;
  }

  // Education income boost
  if (gameState.educationCountdown > 0) {
    gameState.educationCountdown--;
    if (gameState.educationCountdown === 0) {
      gameState.monthlyIncome += gameState.pendingIncomeBoost;
      gameState.pendingIncomeBoost = 0;
      showNotification('🎓 La formazione paga! Il tuo stipendio è aumentato.');
    }
  }

  // Cash floor check
  if (gameState.cash < 0) {
    gameState.debt += Math.abs(gameState.cash);
    gameState.cash = 0;
  }

  // Record history
  const nw = calculateNetWorth();
  gameState.history.push({
    month: gameState.month,
    cash: gameState.cash,
    savings: gameState.savings,
    emergencyFund: gameState.emergencyFund,
    investments: gameState.investments,
    debt: gameState.debt,
    netWorth: nw
  });

  // Check milestones
  checkMilestones();

  // Random scenario
  const scenario = pickScenario(gameState);
  if (scenario) {
    gameState.currentScenario = scenario;
    gameState.gamePhase = 'event';
  }

  // Advance month
  gameState.month++;
  if (gameState.month > 12) {
    gameState.month = 1;
    gameState.year++;
  }

  // Victory condition: 10 years
  if (gameState.month === 1 && gameState.year >= 2034) {
    gameState.gamePhase = 'victory';
  }

  renderAll();

  // Coach monthly message (only if no event)
  if (gameState.gamePhase === 'playing') {
    coach.getMessage('monthly', gameState).then(msg => showCoachMessage(msg));
  }
}

async function applyChoice(choiceId) {
  if (!gameState.currentScenario) return;

  const scenario = gameState.currentScenario;
  const choice = scenario.choices.find(c => c.id === choiceId);
  if (!choice) return;

  // Apply impact
  const impact = choice.impact;
  if (impact.cash) gameState.cash += impact.cash;
  if (impact.savings) gameState.savings = Math.max(0, gameState.savings + impact.savings);
  if (impact.emergencyFund) gameState.emergencyFund = Math.max(0, gameState.emergencyFund + impact.emergencyFund);
  if (impact.debt) gameState.debt += impact.debt;
  if (impact.happiness) gameState.happiness = Math.min(100, Math.max(0, gameState.happiness + impact.happiness));
  if (impact.investments && !impact.isPercent) gameState.investments += impact.investments;
  if (impact.investments && impact.isPercent) gameState.investments = Math.max(0, Math.round(gameState.investments * (1 + impact.investments)));
  if (impact.investmentsSell) { gameState.cash += gameState.investments; gameState.investments = 0; }
  if (impact.monthlyIncome) gameState.monthlyIncome += impact.monthlyIncome;
  if (impact.monthlyExpenses) gameState.monthlyExpenses += impact.monthlyExpenses;
  if (impact.monthlySavings) gameState.monthlySavings = Math.max(0, gameState.monthlySavings + impact.monthlySavings);
  if (impact.monthlyInvestments) gameState.monthlyInvestments = Math.max(0, gameState.monthlyInvestments + impact.monthlyInvestments);

  // Coach feedback
  const msg = await coach.getMessage('scenario', { scenario, decisionId: choiceId });
  showCoachMessage(msg);

  gameState.currentScenario = null;
  gameState.gamePhase = 'playing';
  renderAll();
  hideEventModal();
}

function buildBuilding(buildingId) {
  const building = BUILDINGS[buildingId];
  if (!building || gameState.buildings[buildingId]) return;

  if (building.unlockMonth && gameState.month < building.unlockMonth) {
    showNotification(`🔒 Disponibile dal mese ${building.unlockMonth}`);
    return;
  }

  if (building.buildCost > 0 && gameState.cash < building.buildCost) {
    showNotification(`💸 Non hai abbastanza liquidità. Servono €${building.buildCost}.`);
    return;
  }

  if (building.buildCost > 0) gameState.cash -= building.buildCost;

  gameState.buildings[buildingId] = true;

  if (building.monthlySaving) gameState.monthlySavings += building.monthlySaving;
  if (building.monthlyContribution) gameState.monthlyEmergency += building.monthlyContribution;
  if (building.monthlyInvestment) gameState.monthlyInvestments += building.monthlyInvestment;
  if (building.monthlyCost) gameState.monthlyExpenses += building.monthlyCost;
  if (building.happinessBoost) gameState.happiness = Math.min(100, gameState.happiness + building.happinessBoost);
  if (building.incomeBoost) {
    gameState.pendingIncomeBoost = building.incomeBoost;
    gameState.educationCountdown = 3;
  }

  checkMilestones();
  renderAll();

  coach.getMessage('monthly', gameState).then(msg => showCoachMessage(msg));
}

function checkMilestones() {
  const nw = calculateNetWorth();
  const milestones = gameState.milestones;

  const checks = [
    { id: 'first_save', cond: gameState.savings > 0 || gameState.monthlySavings > 0 },
    { id: 'emergency_500', cond: gameState.emergencyFund >= 500 },
    { id: 'emergency_complete', cond: gameState.emergencyFund >= 3000 },
    { id: 'first_investment', cond: gameState.investments > 0 },
    { id: 'savings_1000', cond: gameState.savings >= 1000 },
    { id: 'year_one', cond: gameState.year > 2024 },
    { id: 'debt_free', cond: gameState.debt === 0 && gameState.month > 3 },
    { id: 'networth_10k', cond: nw >= 10000 },
  ];

  checks.forEach(({ id, cond }) => {
    if (cond && !milestones.has(id)) {
      milestones.add(id);
      const msg = COACH_MESSAGES.milestones[id];
      if (msg) showCoachMessage(msg);
    }
  });
}

// ---- UI Rendering ----

function renderAll() {
  renderStats();
  renderCity();
  renderShop();
  renderChart();
  if (gameState.gamePhase === 'event') showEventModal(gameState.currentScenario);
  if (gameState.gamePhase === 'victory') showVictoryScreen();
}

function renderStats() {
  const nw = calculateNetWorth();
  gameState.financialScore = calculateScore();

  const monthLabel = `${MONTHS_IT[gameState.month - 1]} ${gameState.year}`;
  document.getElementById('stat-month').textContent = monthLabel;
  document.getElementById('stat-cash').textContent = formatEuro(gameState.cash);
  document.getElementById('stat-savings').textContent = formatEuro(gameState.savings);
  document.getElementById('stat-emergency').textContent = formatEuro(gameState.emergencyFund);
  document.getElementById('stat-investments').textContent = formatEuro(gameState.investments);
  document.getElementById('stat-debt').textContent = formatEuro(gameState.debt);
  document.getElementById('stat-networth').textContent = formatEuro(nw);
  document.getElementById('stat-income').textContent = formatEuro(gameState.monthlyIncome);
  document.getElementById('stat-expenses').textContent = formatEuro(gameState.monthlyExpenses + gameState.monthlySavings + gameState.monthlyEmergency + gameState.monthlyInvestments);
  document.getElementById('stat-score').textContent = gameState.financialScore;

  const scoreEl = document.getElementById('score-ring');
  scoreEl.style.setProperty('--score', gameState.financialScore);

  const emergencyProgress = Math.min(100, (gameState.emergencyFund / 3000) * 100);
  document.getElementById('emergency-progress').style.width = emergencyProgress + '%';
  document.getElementById('emergency-label').textContent = `${Math.round(emergencyProgress)}% dell'obiettivo (€3.000)`;
}

function renderCity() {
  const cityEl = document.getElementById('city-grid');
  cityEl.innerHTML = '';

  const allBuildings = Object.values(BUILDINGS);
  allBuildings.forEach(b => {
    const placed = gameState.buildings[b.id];
    const el = document.createElement('div');
    el.className = `city-tile ${placed ? 'placed' : 'empty'}`;
    el.innerHTML = `
      <span class="tile-emoji">${b.emoji}</span>
      <span class="tile-name">${b.name}</span>
      ${placed ? '<span class="tile-check">✓</span>' : ''}
    `;
    el.title = b.tooltip || b.description;
    cityEl.appendChild(el);
  });
}

function renderShop() {
  const shopEl = document.getElementById('shop-list');
  shopEl.innerHTML = '';

  const buildable = Object.values(BUILDINGS).filter(b => !b.locked && !gameState.buildings[b.id]);
  if (buildable.length === 0) {
    shopEl.innerHTML = '<p class="shop-empty">🏆 Hai costruito tutto!</p>';
    return;
  }

  buildable.forEach(b => {
    const canAfford = gameState.cash >= (b.buildCost || 0);
    const locked = b.unlockMonth && gameState.month < b.unlockMonth;
    const el = document.createElement('div');
    el.className = `shop-item ${canAfford && !locked ? '' : 'disabled'}`;
    el.innerHTML = `
      <div class="shop-item-header">
        <span>${b.emoji} ${b.name}</span>
        <span class="shop-cost">${b.buildCost > 0 ? `€${b.buildCost}` : 'Gratis'}</span>
      </div>
      <p class="shop-desc">${b.description}</p>
      ${locked ? `<p class="shop-locked">🔒 Disponibile al mese ${b.unlockMonth}</p>` : ''}
      <button onclick="buildBuilding('${b.id}')" ${canAfford && !locked ? '' : 'disabled'}>
        ${locked ? 'Bloccato' : canAfford ? '+ Costruisci' : 'Liquidità insufficiente'}
      </button>
    `;
    shopEl.appendChild(el);
  });
}

function renderChart() {
  const canvas = document.getElementById('chart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const history = gameState.history.slice(-24); // last 24 months
  if (history.length < 2) return;

  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 100;
  ctx.clearRect(0, 0, W, H);

  const values = history.map(h => h.netWorth);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const toY = v => H - 8 - ((v - min) / range) * (H - 16);
  const toX = i => (i / (history.length - 1)) * W;

  ctx.strokeStyle = '#00D4A3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  history.forEach((h, i) => {
    i === 0 ? ctx.moveTo(toX(i), toY(h.netWorth)) : ctx.lineTo(toX(i), toY(h.netWorth));
  });
  ctx.stroke();

  // Fill
  ctx.fillStyle = 'rgba(0, 212, 163, 0.1)';
  ctx.lineTo(toX(history.length - 1), H);
  ctx.lineTo(toX(0), H);
  ctx.closePath();
  ctx.fill();
}

function showEventModal(scenario) {
  const modal = document.getElementById('event-modal');
  modal.classList.remove('hidden');
  document.getElementById('event-title').textContent = scenario.title;
  document.getElementById('event-description').textContent = scenario.description;

  const choicesEl = document.getElementById('event-choices');
  choicesEl.innerHTML = '';
  scenario.choices.forEach(choice => {
    const available = choice.available(gameState);
    const btn = document.createElement('button');
    btn.className = `choice-btn ${available ? '' : 'disabled'}`;
    btn.disabled = !available;
    btn.innerHTML = `
      <strong>${choice.label}</strong>
      ${!available ? '<span class="choice-unavailable">(non disponibile)</span>' : ''}
    `;
    if (available) btn.onclick = () => applyChoice(choice.id);
    choicesEl.appendChild(btn);
  });
}

function hideEventModal() {
  document.getElementById('event-modal').classList.add('hidden');
}

function showCoachMessage(message) {
  const el = document.getElementById('coach-message');
  el.textContent = message;
  el.classList.add('coach-animate');
  setTimeout(() => el.classList.remove('coach-animate'), 500);
}

function showNotification(message) {
  const el = document.getElementById('notification');
  el.textContent = message;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 3000);
}

function showVictoryScreen() {
  document.getElementById('victory-overlay').classList.remove('hidden');
  const nw = calculateNetWorth();
  document.getElementById('victory-networth').textContent = formatEuro(nw);
  document.getElementById('victory-score').textContent = gameState.financialScore;
}

function formatEuro(n) {
  return '€' + Math.round(n).toLocaleString('it-IT');
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  renderAll();
  coach.getMessage('welcome', gameState).then(msg => showCoachMessage(msg));
  document.getElementById('next-month-btn').addEventListener('click', processMonth);
});
