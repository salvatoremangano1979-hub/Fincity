// FinCity — Financial Scenarios Database
// Generated using the financial-scenario-generator skill

const SCENARIOS = [
  {
    id: 'car_breakdown',
    type: 'emergency',
    title: '🚗 Macchina rotta!',
    description: 'Tornando dal lavoro il motore della tua auto ha avuto un guasto. Il meccanico ti chiede €900 per la riparazione.',
    minMonth: 1,
    probability: 0.15,
    choices: [
      {
        id: 'emergency_fund',
        label: '🛡️ Usa il fondo emergenza',
        available: (state) => state.emergencyFund >= 900,
        impact: { emergencyFund: -900 },
        note: 'Perfetto! È esattamente per questo che esiste il fondo emergenza.'
      },
      {
        id: 'savings',
        label: '🏦 Preleva dai risparmi',
        available: (state) => state.savings >= 900,
        impact: { savings: -900 },
        note: 'Funziona, ma ora devi ricostruire i risparmi. Considera di tenere separato un fondo emergenza.'
      },
      {
        id: 'debt',
        label: '💳 Fai un prestito',
        available: () => true,
        impact: { debt: 900 },
        note: 'Attenzione: oltre ai €900 dovrai restituire anche gli interessi (~€108 in un anno al 12%).'
      },
      {
        id: 'cash',
        label: '💵 Paga cash',
        available: (state) => state.cash >= 900,
        impact: { cash: -900 },
        note: 'Hai usato la liquidità disponibile. Metti da parte un po\' ogni mese per gli imprevisti.'
      }
    ],
    coachMessage: '🛡️ Questo imprevisto capita a tutti. Senza un fondo emergenza, le spese inattese diventano crisi. L\'obiettivo è avere 3 mesi di spese da parte (€3.000-4.000 nel tuo caso). Anche €50-100 al mese in un conto separato fanno la differenza in 2-3 anni.',
    conceptTaught: 'emergency_fund'
  },
  {
    id: 'bonus',
    type: 'opportunity',
    title: '🎉 Bonus aziendale!',
    description: 'La tua azienda ti ha riconosciuto un bonus di €800 per le ottime performance. Come lo gestisci?',
    minMonth: 3,
    probability: 0.12,
    choices: [
      {
        id: 'invest_all',
        label: '📈 Investi tutto',
        available: () => true,
        impact: { investments: 800 },
        note: 'Ottima idea! L\'interesse composto fa crescere questo investimento nel tempo.'
      },
      {
        id: 'split',
        label: '⚖️ Metà risparmio, metà investimento',
        available: () => true,
        impact: { savings: 400, investments: 400 },
        note: 'Strategia equilibrata: sicurezza e crescita insieme. Approccio molto valido.'
      },
      {
        id: 'emergency',
        label: '🛡️ Rinforza il fondo emergenza',
        available: () => true,
        impact: { emergencyFund: 800 },
        note: 'Prima la sicurezza. Con un buon fondo emergenza puoi investire con più serenità.'
      },
      {
        id: 'spend',
        label: '🛍️ Concediti qualcosa',
        available: () => true,
        impact: { cash: 800, happiness: 15 },
        note: 'Puoi farlo! Ma considera di destinarne almeno il 50% al futuro la prossima volta.'
      }
    ],
    coachMessage: '🎉 Un bonus è una grande opportunità! La regola del 50/30/20 dice: 50% bisogni, 30% desideri, 20% risparmio/investimento. Con un extra come questo, considera di invertire un po\' la proporzione a favore del futuro — il tuo "io" di fra 10 anni te ne sarà grato.',
    conceptTaught: 'windfall_management'
  },
  {
    id: 'market_drop',
    type: 'market',
    title: '📉 Mercati in calo!',
    description: 'I mercati finanziari hanno perso il 15% questo mese. Il valore dei tuoi investimenti è sceso.',
    minMonth: 6,
    probability: 0.10,
    choices: [
      {
        id: 'hold',
        label: '⏳ Mantieni gli investimenti',
        available: () => true,
        impact: { investments: -0.15, isPercent: true },
        note: 'La scelta giusta! I mercati oscillano ma nel lungo periodo tendono a salire.'
      },
      {
        id: 'sell',
        label: '🚨 Vendi tutto',
        available: (state) => state.investments > 0,
        impact: { investmentsSell: true },
        note: 'Hai "cristallizzato" la perdita. In finanza si dice: "Non è una perdita finché non vendi."'
      },
      {
        id: 'buy_more',
        label: '🛒 Compra di più (prezzi bassi!)',
        available: (state) => state.cash >= 200,
        impact: { cash: -200, investments: 200 },
        note: 'Strategia avanzata: comprare quando i prezzi scendono può aumentare i rendimenti futuri.'
      }
    ],
    coachMessage: '📉 I cali di mercato fanno paura, ma fanno parte del gioco. Chi ha investito in borsa durante la crisi del 2008 e ha mantenuto i propri investimenti, ha poi visto triplicare il valore in 10 anni. Il nemico dell\'investitore non è il mercato — è il panico.',
    conceptTaught: 'market_volatility'
  },
  {
    id: 'rent_increase',
    type: 'life',
    title: '🏠 Affitto aumentato!',
    description: 'Il tuo proprietario di casa ha aumentato l\'affitto di €150 al mese. Come ti adatti?',
    minMonth: 4,
    probability: 0.12,
    choices: [
      {
        id: 'accept',
        label: '✅ Accetta e riduci spese',
        available: () => true,
        impact: { monthlyExpenses: 150 },
        note: 'Giusta scelta. Rivedi il budget mensile per compensare l\'aumento.'
      },
      {
        id: 'reduce_savings',
        label: '📉 Riduci i risparmi mensili',
        available: (state) => state.monthlySavings > 50,
        impact: { monthlySavings: -150 },
        note: 'Attenzione: ridurre i risparmi oggi ha un costo nascosto nel lungo periodo.'
      },
      {
        id: 'side_hustle',
        label: '💡 Cerca entrate extra',
        available: () => true,
        impact: { monthlyIncome: 150, happiness: -5 },
        note: 'Ottima mentalità! Aumentare le entrate è più efficace che tagliare solo le spese.'
      }
    ],
    coachMessage: '🏠 Un aumento delle spese fisse richiede una risposta strategica. Prima di tagliare i risparmi (che proteggono il tuo futuro), valuta se ci sono spese discrezionali da ridurre — abbonamenti non usati, spese impulsive. Un\'app di budget può aiutarti a vedere dove vanno davvero i soldi.',
    conceptTaught: 'budget_adjustment'
  },
  {
    id: 'job_promotion',
    type: 'opportunity',
    title: '🚀 Promozione!',
    description: 'Hai ricevuto una promozione! Il tuo stipendio aumenta di €300 al mese. Come gestisci l\'aumento?',
    minMonth: 8,
    probability: 0.10,
    choices: [
      {
        id: 'lifestyle_inflation',
        label: '🛍️ Migliora il tenore di vita',
        available: () => true,
        impact: { monthlyExpenses: 300, happiness: 20 },
        note: 'Attenzione al "lifestyle inflation": quando le spese crescono con il reddito, non si accumula mai ricchezza.'
      },
      {
        id: 'invest_raise',
        label: '📈 Investi l\'intero aumento',
        available: () => true,
        impact: { monthlyInvestments: 300 },
        note: 'Perfetto! Questo si chiama "vivere come prima e investire la differenza." Strategia molto efficace.'
      },
      {
        id: 'split_raise',
        label: '⚖️ Metà vita, metà futuro',
        available: () => true,
        impact: { monthlyExpenses: 150, monthlyInvestments: 150 },
        note: 'Approccio equilibrato. Ti godi un po\' l\'aumento e costruisci anche il futuro.'
      }
    ],
    coachMessage: '🚀 Congratulazioni! Ora arriva la vera sfida: il "lifestyle inflation". Quando aumenta il reddito, le spese tendono ad aumentare allo stesso ritmo — e alla fine non si risparmia di più. La strategia più efficace: vivi come prima e investi la differenza. In 10 anni la differenza sarà enorme.',
    conceptTaught: 'lifestyle_inflation'
  },
  {
    id: 'medical_expense',
    type: 'emergency',
    title: '🏥 Spesa medica imprevista',
    description: 'Hai bisogno di una visita specialistica urgente non coperta dal SSN. Costo: €450.',
    minMonth: 2,
    probability: 0.12,
    choices: [
      {
        id: 'emergency_fund',
        label: '🛡️ Usa il fondo emergenza',
        available: (state) => state.emergencyFund >= 450,
        impact: { emergencyFund: -450 },
        note: 'Esatto! Il fondo emergenza ti protegge anche in questo caso.'
      },
      {
        id: 'savings',
        label: '🏦 Preleva dai risparmi',
        available: (state) => state.savings >= 450,
        impact: { savings: -450 },
        note: 'Va bene, ma ora devi ricostruire. Considera un fondo separato per le emergenze.'
      },
      {
        id: 'delay',
        label: '⏸️ Rimanda la visita',
        available: () => true,
        impact: { happiness: -20 },
        note: 'Rimandare le cure di salute per ragioni economiche è un segnale che il fondo emergenza è prioritario.'
      }
    ],
    coachMessage: '🏥 La salute non si rimanda. Questa situazione mostra perché il fondo emergenza è la priorità numero uno — prima ancora degli investimenti. Target: 3 mesi di spese fisse (circa €3.000-4.000). Con €100 al mese ci arrivi in 2-3 anni.',
    conceptTaught: 'emergency_fund'
  },
  {
    id: 'investment_opportunity',
    type: 'opportunity',
    title: '📊 Scopri gli ETF!',
    description: 'Un amico ti parla degli ETF: fondi d\'investimento diversificati, a basso costo. Vuoi iniziare?',
    minMonth: 3,
    probability: 0.15,
    choices: [
      {
        id: 'start_etf',
        label: '📈 Inizia con €200/mese',
        available: (state) => state.cash >= 200 || state.savings >= 200,
        impact: { monthlyInvestments: 200 },
        note: 'Ottima decisione! La costanza è più importante dell\'importo. €200/mese per 20 anni a 7% = circa €100.000.'
      },
      {
        id: 'small_start',
        label: '🌱 Inizia con €50/mese',
        available: () => true,
        impact: { monthlyInvestments: 50 },
        note: 'Perfetto per iniziare! L\'importante è creare l\'abitudine. Puoi aumentare nel tempo.'
      },
      {
        id: 'learn_first',
        label: '📚 Prima voglio capire meglio',
        available: () => true,
        impact: { happiness: 5 },
        note: 'Saggia prudenza! Ma attenzione: aspettare troppo ha un costo. Il tempo è il fattore più importante.'
      }
    ],
    coachMessage: '📊 Gli ETF sono uno strumento semplice e potente. Comprano un "paniere" di azioni diversificate automaticamente, a costi bassi (0.1-0.5% annuo vs 2-3% dei fondi tradizionali). L\'investimento automatico mensile si chiama PAC (Piano di Accumulo) e annulla il rischio di "entrare al momento sbagliato".',
    conceptTaught: 'etf_investing'
  }
];

// Monthly market performance (random within realistic range)
function getMarketReturn() {
  const annualReturn = 0.07; // 7% average annual
  const monthlyBase = annualReturn / 12;
  const volatility = 0.04; // monthly volatility
  return monthlyBase + (Math.random() - 0.5) * volatility;
}

// Pick a random scenario based on month and probability
function pickScenario(gameState) {
  const eligible = SCENARIOS.filter(s =>
    gameState.month >= s.minMonth &&
    Math.random() < s.probability
  );
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}
