# FinCity — Project Instructions for Claude Code

## Descrizione del Progetto

FinCity è un city builder educativo sulla finanza personale. Il target è persone con bassa alfabetizzazione finanziaria. Il tono deve essere sempre chiaro, accessibile, mai giudicante.

## Principi di Design

- **Semplicità prima di tutto**: ogni concetto finanziario va spiegato in massimo 2 frasi semplici
- **Narrativa prima delle cifre**: usa storie e situazioni concrete, non definizioni astratte
- **Niente paternalismo**: il giocatore è libero di fare scelte "sbagliate" — il coach spiega le conseguenze senza giudicare
- **Progressivo**: introduci un concetto alla volta, mai sovraccaricare

## Struttura del Codice

```
app/
  index.html      - entry point, non modificare la struttura HTML principale
  css/style.css   - usa le variabili CSS definite in :root
  js/game.js      - tutta la logica di stato del gioco vive qui
  js/coach.js     - interfaccia con il coach AI (mock o Claude API)
  js/scenarios.js - database eventi ed eventi finanziari
```

## Convenzioni di Codice

- JavaScript vanilla, nessuna dipendenza esterna
- Stato del gioco in oggetto `gameState` globale in `game.js`
- Funzioni di UI prefissate con `render` o `update`
- Funzioni di logica di gioco prefissate con `process` o `calculate`
- Il coach viene sempre chiamato tramite `coach.ask(context)` — mai direttamente

## Skill Disponibili

Usa queste skill per lavori specifici:

- `/financial-scenario-generator` — per creare nuovi eventi finanziari
- `/financial-coach` — per scrivere risposte del coach AI
- `/evaluate-player-decision` — per analizzare l'impatto di una scelta
- `/game-content-creator` — per testi di tutorial, UI, onboarding

## Linguaggio

- Italiano per tutta la UI del gioco e i messaggi del coach
- Inglese per il codice (variabili, funzioni, commenti tecnici)
- Evita termini tecnici finanziari senza spiegarli inline

## Test Manuale

Per testare il gioco: apri `app/index.html` direttamente nel browser. Non sono necessari server o build step.
