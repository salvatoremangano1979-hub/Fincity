---
name: evaluate-player-decision
description: Analizza le decisioni finanziarie del giocatore, calcola le conseguenze a breve e lungo termine, e genera un feedback educativo appropriato al contesto.
---

# Skill: Evaluate Player Decision

## Ruolo

Valuta la qualità finanziaria di una decisione del giocatore e genera conseguenze realistiche e feedback educativo. Non si tratta di giudicare la persona — si tratta di mostrare chiaramente cause ed effetti finanziari.

## Input Atteso

```json
{
  "decision": "Nome della decisione (es. 'invest_etf', 'skip_savings', 'use_debt')",
  "context": {
    "playerMonth": 6,
    "cash": 300,
    "savings": 1200,
    "emergencyFund": 0,
    "investments": 5000,
    "monthlyIncome": 2000,
    "monthlyExpenses": 1400,
    "surplus": 600
  },
  "amount": 500
}
```

## Logica di Valutazione

### Score della Decisione (0-100)

Calcola un punteggio considerando:
- **Sicurezza (30%)**: protegge o mette a rischio la stabilità finanziaria?
- **Crescita (30%)**: la ricchezza netta aumenta nel lungo periodo?
- **Liquidità (20%)**: rimane cash sufficiente per le emergenze?
- **Educazione (20%)**: la decisione insegna comportamenti positivi?

### Conseguenze da Calcolare

Per ogni decisione, calcola:
1. **Impatto immediato**: variazione cash, savings, investments questo mese
2. **Impatto a 12 mesi**: proiezione se il giocatore ripetesse questa decisione ogni mese
3. **Impatto a 5 anni**: valore futuro considerando interesse composto (tasso 5% annuo per investimenti)

## Output

```json
{
  "score": 75,
  "grade": "Buona scelta",
  "immediateImpact": {
    "cash": -500,
    "investments": +500,
    "netWorthChange": 0
  },
  "projections": {
    "months12": { "netWorth": 8200, "description": "Tra 12 mesi il tuo portafoglio potrebbe valere €8.200" },
    "years5": { "netWorth": 14300, "description": "In 5 anni l'interesse composto potrebbe portarti a €14.300" }
  },
  "feedback": "Messaggio educativo basato sulla skill financial-coach",
  "alternatives": [
    "Alternativa che avrebbe dato un risultato migliore (1 frase)"
  ],
  "conceptReinforced": "nome_concetto_finanziario"
}
```

## Matrice di Valutazione Rapida

| Decisione | Condizione | Score | Feedback |
|-----------|-----------|-------|---------|
| Risparmio mensile | Sempre | 80-95 | Ottima abitudine |
| Investimento ETF | Con fondo emergenza ok | 75-90 | Ottima a lungo termine |
| Investimento ETF | Senza fondo emergenza | 40-55 | Attenzione alla priorità |
| Nessun risparmio | Cash basso | 20-35 | Rischio liquidità |
| Nessun risparmio | Cash alto | 35-50 | Opportunità persa |
| Debito per consumo | Sempre | 10-30 | Costo nascosto degli interessi |
| Fondo emergenza | Sempre | 85-100 | Fondamentale |

## Linee Guida per il Feedback

- Non dire mai "hai sbagliato" — di' "considera che..."
- Mostra sempre i numeri: "questo ti costerà €X in interessi nel prossimo anno"
- Dai sempre un'alternativa concreta
- Celebra i progressi: anche una scelta mediocre in un contesto difficile merita riconoscimento
