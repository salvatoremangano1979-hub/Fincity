// FinCity — Financial Coach
// Mock implementation — replace callClaudeAPI() to use real Claude API
// System prompt: agents/prompts/coach-system-prompt.md

const COACH_MESSAGES = {
  // Onboarding
  welcome: '👋 Benvenuto in FinCity! Sono il tuo coach finanziario personale. Ti guiderò mese dopo mese nelle tue scelte. Non esistono decisioni "giuste" o "sbagliate" — esistono conseguenze. Inizia costruendo la tua città!',

  // Monthly tips based on financial state
  monthly: {
    no_emergency_fund: '🛡️ Nota che non hai ancora un fondo emergenza. È la tua priorità numero uno — prima ancora di investire. Prova a mettere da parte €100 questo mese.',
    low_cash: '⚠️ La tua liquidità è bassa. Fai attenzione alle spese impreviste questo mese — potresti trovarti in difficoltà.',
    good_savings: '✅ Stai risparmiando con costanza. Ottimo! Ora potresti considerare di destinare una parte anche agli investimenti.',
    high_debt: '💳 Il tuo debito sta crescendo. Ogni euro di debito ti costa interessi. Considera di fare un piano per ridurlo prima di nuovi investimenti.',
    first_investment: '📈 Hai fatto il tuo primo investimento! Il tempo è il tuo alleato: più aspetti, più l\'interesse composto lavora per te.',
    on_track: '🌟 Stai andando bene! Budget bilanciato, risparmi in crescita. Continua così.',
    great_networth: '🏆 Il tuo patrimonio netto sta crescendo in modo costante. Sei sulla strada giusta per la libertà finanziaria.',
  },

  // Milestone messages
  milestones: {
    first_save: '🎉 Primo risparmio! Ogni grande patrimonio è iniziato con il primo euro messo da parte. Continua così.',
    emergency_500: '🛡️ Hai €500 nel fondo emergenza! Sei già più protetto della maggior parte delle persone. L\'obiettivo è 3-6 mesi di spese.',
    emergency_complete: '🏆 Fondo emergenza completo! Ora puoi investire con serenità sapendo di avere una rete di sicurezza.',
    first_investment: '📈 Benvenuto nel mondo degli investitori! Ricorda: la borsa nel breve termine è imprevedibile, nel lungo termine tende a crescere. Pazienza è la parola chiave.',
    savings_1000: '💰 €1.000 risparmiati! Questo è un traguardo importante. Stai costruendo la tua sicurezza finanziaria.',
    year_one: '🎂 Un anno di FinCity! Hai imparato a gestire il budget, affrontare imprevisti e pianificare il futuro. Queste abitudini, nella vita reale, fanno una differenza enorme.',
    debt_free: '🎊 Hai estinto tutti i debiti! Ora ogni euro che guadagni lavora per te, non per le banche.',
    networth_10k: '🌟 €10.000 di patrimonio netto! Stai costruendo una vera base di sicurezza finanziaria.',
  },

  // Decision feedback
  decisions: {
    invest_etf: '📈 Investire in ETF è una delle strategie più efficaci per chi inizia. Basso costo, alta diversificazione. Il segreto è la costanza nel tempo.',
    use_emergency_fund: '✅ Hai fatto la cosa giusta! Il fondo emergenza esiste esattamente per questo. Ora ricostruiscilo gradualmente.',
    took_debt: '💳 Il debito è uno strumento — non necessariamente negativo. Ma fai attenzione agli interessi: un prestito al 12% annuo ti costerà molto più del capitale.',
    saved_instead: '🏦 Hai scelto di risparmiare invece di spendere. Nel lungo periodo, questa abitudine è la differenza tra chi costruisce ricchezza e chi no.',
    paid_off_debt: '🎊 Hai estinto un debito! Il tasso di interesse che pagavi era il tuo "investimento al contrario" — eliminarlo è come un guadagno garantito.',
    sold_investments: '📉 Hai venduto durante un calo. In finanza si dice: "Non è una perdita finché non vendi." I mercati storicamente si riprendono sempre. La prossima volta, prova a tenere duro.',
    bought_dip: '💡 Comprare quando i prezzi scendono richiede coraggio ma può migliorare i rendimenti futuri. Strategia avanzata!',
  },

  // Concept explanations
  concepts: {
    emergency_fund: '🛡️ Il fondo emergenza è una riserva di 3-6 mesi di spese fisse, tenuta in un conto separato e facilmente accessibile. Non è un investimento — è assicurazione.',
    compound_interest: '📈 L\'interesse composto significa che i guadagni generano altri guadagni. €1.000 al 7% annuo diventano €2.000 in 10 anni, €4.000 in 20 — senza aggiungere nulla.',
    diversification: '🎯 "Non mettere tutte le uova nello stesso paniere." Distribuire gli investimenti riduce il rischio: se un settore crolla, gli altri possono compensare.',
    etf: '📊 Un ETF (Exchange Traded Fund) è un fondo che replica un indice di mercato (es. le 500 maggiori aziende USA). Costi bassi, diversificazione automatica, accesso semplice.',
    budget: '📋 Un budget non è una prigione — è una mappa. Sapere dove vanno i tuoi soldi è il primo passo per decidere dove vuoi che vadano.',
    inflation: '💸 L\'inflazione erode il potere d\'acquisto del denaro nel tempo. €1.000 oggi comprano più di €1.000 fra 10 anni. Tenere tutto in cash "perde" valore reale ogni anno.',
  }
};

class FinancialCoach {
  constructor() {
    this.messageHistory = [];
    this.lastMessageTime = 0;
    // To use real Claude API: set apiKey and use callClaudeAPI()
    this.apiKey = null;
  }

  // Main entry point — call this from the game
  async getMessage(trigger, context = {}) {
    const message = this.selectMessage(trigger, context);
    this.messageHistory.push({ trigger, message, month: context.month });
    return message;
  }

  selectMessage(trigger, context) {
    // Scenario-specific coach messages take priority
    if (trigger === 'scenario' && context.scenario?.coachMessage) {
      return context.scenario.coachMessage;
    }

    // Decision feedback
    if (trigger === 'decision' && context.decisionId) {
      const key = context.decisionId.replace(/-/g, '_');
      if (COACH_MESSAGES.decisions[key]) return COACH_MESSAGES.decisions[key];
      if (context.scenario?.choices) {
        const choice = context.scenario.choices.find(c => c.id === context.decisionId);
        if (choice?.note) return `💡 ${choice.note}`;
      }
    }

    // Milestone messages
    if (trigger === 'milestone' && context.milestone) {
      return COACH_MESSAGES.milestones[context.milestone] || COACH_MESSAGES.monthly.on_track;
    }

    // Monthly state-based messages
    if (trigger === 'monthly') {
      return this.getMonthlyMessage(context);
    }

    // Concept explanations
    if (trigger === 'concept' && context.concept) {
      return COACH_MESSAGES.concepts[context.concept] || '';
    }

    return COACH_MESSAGES.welcome;
  }

  getMonthlyMessage(state) {
    if (state.debt > state.monthlyIncome * 3) return COACH_MESSAGES.monthly.high_debt;
    if (state.emergencyFund < 500 && state.month > 3) return COACH_MESSAGES.monthly.no_emergency_fund;
    if (state.cash < 200) return COACH_MESSAGES.monthly.low_cash;
    if (state.investments > 0 && state.month <= 2) return COACH_MESSAGES.monthly.first_investment;
    if (state.savings > state.monthlyIncome && state.investments === 0) return COACH_MESSAGES.monthly.good_savings;
    if (state.netWorth > 15000) return COACH_MESSAGES.monthly.great_networth;
    return COACH_MESSAGES.monthly.on_track;
  }

  // --- Real Claude API integration (activate when API key available) ---
  async callClaudeAPI(context) {
    if (!this.apiKey) return null;

    const systemPrompt = `Sei il coach finanziario personale dell'utente nel gioco educativo FinCity.
Il tuo ruolo è insegnare concetti di finanza personale a persone con bassa alfabetizzazione finanziaria.
Rispondi sempre in italiano, in modo informale (tu), max 100 parole, 1 emoji all'inizio.
Tono: amichevole, incoraggiante, mai giudicante. Usa analogie concrete della vita quotidiana.`;

    const userMessage = `Situazione del giocatore:
- Mese ${context.month} di gioco
- Cash: €${context.cash} | Risparmi: €${context.savings} | Investimenti: €${context.investments}
- Fondo emergenza: €${context.emergencyFund} | Debito: €${context.debt}
- Evento: ${context.lastEvent || 'nessuno'} | Decisione: ${context.lastDecision || 'nessuna'}
Fornisci un feedback educativo breve e motivante.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 200,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }]
        })
      });
      const data = await response.json();
      return data.content[0].text;
    } catch (err) {
      console.warn('Claude API unavailable, using mock:', err);
      return null;
    }
  }
}

const coach = new FinancialCoach();
