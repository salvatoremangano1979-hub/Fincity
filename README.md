# FinCity — Educazione Finanziaria attraverso l'Agentic Coding

> Un city builder educativo che insegna la gestione delle finanze personali, sviluppato con il supporto di Claude Code e strutture agentiche.

## Obiettivo

FinCity usa il paradigma del **city builder** per rendere accessibili i concetti di finanza personale a persone con bassa alfabetizzazione finanziaria. Il giocatore costruisce e gestisce la propria "città finanziaria", prendendo decisioni su budget, risparmio e investimenti, supportato da un coach AI alimentato da Claude.

## Struttura del Repository

```
/
├── app/                    # Soluzione sviluppata (prototipo giocabile)
│   ├── index.html          # Entry point del gioco
│   ├── css/style.css       # Stili e temi visivi
│   └── js/
│       ├── game.js         # Logica principale del city builder
│       ├── coach.js        # Coach AI (mock → sostituibile con Claude API)
│       └── scenarios.js    # Database scenari ed eventi finanziari
│
├── agents/                 # Struttura agentica utilizzata
│   ├── CLAUDE.md           # Istruzioni per Claude Code (project instructions)
│   ├── skills/             # Skill definitions
│   │   ├── financial-scenario-generator.md
│   │   ├── financial-coach.md
│   │   ├── evaluate-player-decision.md
│   │   └── game-content-creator.md
│   ├── prompts/
│   │   └── coach-system-prompt.md
│   └── workflow.md         # Come gli agenti collaborano
│
├── presentation/
│   └── index.html          # Presentazione HTML (Accenture brand)
│
└── README.md
```

## Come Giocare

1. Apri `app/index.html` nel browser
2. Inizia il tuo viaggio finanziario con €1.500 di stipendio
3. Costruisci la tua città: aggiungi risparmio, investimenti, protezione
4. Sopravvivi agli eventi imprevisti
5. Raggiungi la libertà finanziaria entro 10 anni (120 turni/mesi)

## Struttura Agentica

Il progetto è stato sviluppato usando **Claude Code** con un'architettura multi-skill:

| Skill | Ruolo |
|-------|-------|
| `financial-scenario-generator` | Genera eventi e sfide finanziarie realistiche |
| `financial-coach` | Fornisce spiegazioni educative personalizzate |
| `evaluate-player-decision` | Analizza le scelte del giocatore e calcola conseguenze |
| `game-content-creator` | Crea testi, tutorial e contenuti di gioco |

## Integrazione Claude API

Il coach AI è attualmente in modalità mock. Per attivare Claude reale:
1. Ottieni una API key da [console.anthropic.com](https://console.anthropic.com)
2. Sostituisci in `app/js/coach.js` la funzione `mockCoachResponse()` con `callClaudeAPI()`
3. Il system prompt è già pronto in `agents/prompts/coach-system-prompt.md`

## Concetti Finanziari Trattati

- **Bilancio mensile**: entrate vs uscite, gestione del surplus
- **Fondo emergenza**: perché costruirlo, quanto tenerne
- **Investimenti base**: interesse composto, ETF, orizzonte temporale
- **Debito**: costi reali, come evitarlo
- **Risparmio sistematico**: il metodo "pagati prima"

## Team

Sviluppato con Claude Code — Accenture AI Hackathon 2026
