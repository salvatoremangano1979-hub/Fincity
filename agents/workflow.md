# Workflow Agentico — FinCity

## Panoramica

Il progetto FinCity utilizza Claude Code con un'architettura multi-skill per generare e gestire contenuti di gioco educativi. Ogni skill opera in modo indipendente ma coordinato attraverso un workflow definito.

## Agenti e Skill

```
┌─────────────────────────────────────────────────────────────┐
│                    FINCITY AGENT SYSTEM                      │
├─────────────────┬────────────────────┬───────────────────────┤
│  CONTENT LAYER  │   DECISION LAYER   │    FEEDBACK LAYER     │
│                 │                    │                       │
│ game-content-   │ financial-scenario-│ evaluate-player-      │
│ creator         │ generator          │ decision              │
│                 │                    │                       │
│ Genera: testi   │ Genera: eventi,    │ Analizza: scelta +    │
│ UI, onboarding, │ sfide, opportunità │ contesto → score +    │
│ tutorial,       │ di gioco           │ proiezioni            │
│ milestone       │                    │                       │
└────────┬────────┴──────────┬─────────┴───────────┬───────────┘
         │                   │                     │
         └───────────────────▼─────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ financial-coach  │
                    │                 │
                    │ Sintetizza tutto │
                    │ in feedback per  │
                    │ il giocatore     │
                    └─────────────────┘
```

## Flusso di una Sessione di Gioco

```
TURNO MENSILE
     │
     ├─→ [financial-scenario-generator]
     │        Genera evento del mese (se probabilità > 0.4)
     │        Output: oggetto evento con impact e choices
     │
     ├─→ Giocatore vede l'evento e prende una decisione
     │
     ├─→ [evaluate-player-decision]
     │        Input: decisione + stato corrente giocatore
     │        Output: impatto calcolato + score + proiezioni
     │
     ├─→ Stato del gioco aggiornato
     │
     ├─→ [financial-coach]
     │        Input: contesto completo (evento + decisione + stato)
     │        Output: messaggio educativo personalizzato
     │
     └─→ UI aggiornata, nuovo turno disponibile
```

## Workflow di Sviluppo (Claude Code)

Quando si usa Claude Code per sviluppare FinCity:

```
1. PIANIFICAZIONE
   └─→ Usa skill game-content-creator per definire nuovi contenuti
   
2. GENERAZIONE SCENARI
   └─→ Usa skill financial-scenario-generator
   └─→ Valida output con skill evaluate-player-decision
   
3. RAFFINAMENTO COACH
   └─→ Usa skill financial-coach per verificare tono e qualità risposte
   
4. INTEGRAZIONE
   └─→ Incolla JSON generati in app/js/scenarios.js
   └─→ Testa nel browser (app/index.html)
```

## Comandi Claude Code Disponibili

| Comando | Skill invocata | Quando usarla |
|---------|---------------|---------------|
| `/financial-scenario-generator` | financial-scenario-generator | Aggiungere nuovi eventi |
| `/financial-coach` | financial-coach | Verificare/migliorare messaggi coach |
| `/evaluate-player-decision` | evaluate-player-decision | Calibrare impatti economici |
| `/game-content-creator` | game-content-creator | Scrivere testi UI e tutorial |

## Decisioni Architetturali

### Perché mock invece di API reale?
Il gioco funziona offline e senza costi API. La struttura del `coach.js` è progettata per essere sostituita con una vera chiamata API in modo minimale (cambia solo la funzione `getCoachMessage`).

### Perché skill separate invece di un unico agente?
La separazione permette di iterare su ogni componente indipendentemente. Puoi migliorare gli scenari senza toccare il coach, e viceversa.

### Perché JavaScript vanilla?
Zero dipendenze = zero problemi di deploy. Il gioco si apre con un doppio click su `index.html`.
