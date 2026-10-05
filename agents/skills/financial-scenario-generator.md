---
name: financial-scenario-generator
description: Genera eventi e scenari finanziari realistici per il gioco FinCity. Ogni scenario deve essere educativo, realistico e appropriato per il livello del giocatore.
---

# Skill: Financial Scenario Generator

## Ruolo

Genera eventi finanziari che accadono durante il gioco. Gli eventi devono essere realistici, educativi e bilanciati tra eventi positivi (opportunità) e negativi (sfide).

## Struttura di un Evento

Ogni evento generato deve avere questo formato JSON:

```json
{
  "id": "unique_snake_case_id",
  "type": "emergency | opportunity | market | life",
  "title": "Titolo breve (max 5 parole)",
  "description": "Descrizione situazione in 1-2 frasi. Usa il presente.",
  "impact": {
    "cash": -800,
    "investments": 0,
    "savings": 0,
    "income": 0,
    "happiness": -10
  },
  "choices": [
    {
      "id": "choice_a",
      "label": "Etichetta breve",
      "description": "Cosa succede se scegli questo",
      "impact": { "cash": -800, "savings": 0 },
      "educationalNote": "Breve spiegazione del concetto finanziario"
    }
  ],
  "coachMessage": "Messaggio del coach dopo l'evento (usa le linee guida della skill financial-coach)",
  "conceptTaught": "nome_concetto"
}
```

## Tipi di Evento

### emergency (eventi negativi imprevisti)
- Guasto auto, spesa medica, riparazione casa
- Impatto: perdita di cash immediata
- Insegna: importanza del fondo emergenza

### opportunity (opportunità finanziarie)
- Bonus aziendale, eredità piccola, side hustle
- Impatto: extra cash con decisione da prendere
- Insegna: come gestire denaro extra

### market (eventi di mercato)
- Fluttuazioni investimenti, inflazione, tassi
- Impatto: variazione valore investimenti
- Insegna: volatilità, orizzonte temporale, non vendere in panico

### life (eventi di vita)
- Cambio lavoro, figlio, trasloco
- Impatto: cambio strutturale di income/expenses
- Insegna: pianificazione, adattamento

## Linee Guida

- **Realismo**: usa cifre reali per l'Italia (stipendio medio €1.800-2.500, affitto città media €700-900)
- **Progressione**: eventi più complessi compaiono dopo il mese 12
- **Bilanciamento**: ratio 60% negativi / 40% positivi per creare tensione educativa
- **Specificità**: evita eventi vaghi — ogni situazione deve essere riconoscibile

## Esempio Output

```json
{
  "id": "car_breakdown_01",
  "type": "emergency",
  "title": "La macchina si è rotta!",
  "description": "Tornando dal lavoro il motore della tua auto ha avuto un guasto. Il meccanico ti chiede €900 per la riparazione.",
  "impact": { "cash": -900, "happiness": -15 },
  "choices": [
    {
      "id": "use_emergency_fund",
      "label": "Usa il fondo emergenza",
      "description": "Preleva dal fondo emergenza",
      "impact": { "cash": 0, "emergencyFund": -900 },
      "educationalNote": "Esatto! Il fondo emergenza esiste proprio per questo."
    },
    {
      "id": "use_savings",
      "label": "Usa i risparmi",
      "description": "Preleva dal conto risparmio",
      "impact": { "cash": 0, "savings": -900 },
      "educationalNote": "Funziona, ma ora devi ricostruire i risparmi. Meglio tenere separato il fondo emergenza."
    },
    {
      "id": "take_debt",
      "label": "Fai un prestito",
      "description": "Chiedi un prestito personale",
      "impact": { "cash": 0, "debt": 900 },
      "educationalNote": "Attenzione: oltre ai €900 dovrai restituire anche gli interessi. Un prestito da €900 al 12% annuo ti costerà €108 extra."
    }
  ],
  "coachMessage": "🛡️ Questo è uno di quegli imprevisti che capitano a tutti. Senza un fondo emergenza, gli imprevisti diventano crisi. L'obiettivo ideale è avere da parte l'equivalente di 3 mesi di spese — nel tuo caso circa €3.000. Inizia con piccoli passi: €50-100 al mese in un conto separato.",
  "conceptTaught": "emergency_fund"
}
```
