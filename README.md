# Système de Marchés Publics sur Blockchain

**Système décentralisé de gestion des appels d'offres publics** utilisant des Smart Contracts Ethereum pour garantir transparence et équité.

---

## 📖 Description du Projet

Ce projet implémente une solution blockchain pour gérer les appels d'offres publics de manière transparente et sécurisée. Il remplace les processus traditionnels opaques par un système automatisé et vérifiable sur la blockchain Ethereum.

### Problème Résolu

- ❌ **Traditionnellement** : Processus opaques, risque de corruption, manipulation des offres
- ✅ **Notre Solution** : Enregistrement immuable, pattern commit-reveal anti-manipulation, paiements automatisés par jalons

### Fonctionnalités Principales

1. **Création d'appels d'offres** : Le gouvernement publie des appels d'offres avec budget et délais
2. **Soumission sécurisée** : Les entreprises soumettent leurs offres en mode commit-reveal (anti-front-running)
3. **Sélection automatique** : L'offre valide la plus basse est automatiquement sélectionnée
4. **Paiements par jalons** : Versements progressifs validés par un auditeur indépendant
5. **Sécurité renforcée** : Protection contre les attaques (reentrancy, front-running, DoS)

---

## 🏗️ Architecture Technique

### Smart Contracts

Le projet contient **2 versions** du contrat :

| Contrat                         | Description                             | Usage                           |
| ------------------------------- | --------------------------------------- | ------------------------------- |
| **SecureProcurementSystem.sol** | Version **SÉCURISÉE** avec OpenZeppelin | 🟢 **Production**               |
| **ProcurementSystem.sol**       | Version **VULNÉRABLE** (éducative)      | 🔴 **Apprentissage uniquement** |

### Technologies Utilisées

- **Solidity 0.8.28** : Langage de smart contracts
- **Hardhat** : Framework de développement et tests
- **OpenZeppelin** : Bibliothèques de sécurité (Ownable, ReentrancyGuard, Pausable)
- **Ethers.js** : Interaction avec la blockchain
- **Chai** : Framework de tests

### Sécurité

- ✅ **OpenZeppelin Ownable** : Contrôle d'accès
- ✅ **ReentrancyGuard** : Protection contre les attaques de réentrance
- ✅ **Pausable** : Mécanisme d'arrêt d'urgence
- ✅ **Commit-Reveal Pattern** : Empêche la manipulation des offres (front-running)
- ✅ **Boucles bornées** : Protection contre les attaques DoS

---

## 🚀 Installation et Configuration

### Prérequis

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/abadouayoub/Public_procurement_processes_smart_contracts.git
cd MarchePublicSmartContracts

# 2. Installer les dépendances
npm install

# 3. Vérifier l'installation
npx hardhat version
```

**Installation réussie si vous voyez** : `Hardhat version X.X.X`

---

## 🧪 Comment Tester le Projet

### 1️⃣ Tests Unitaires Complets

Exécute tous les tests du projet (couverture complète des fonctionnalités) :

```bash
npx hardhat test
```

**Résultat attendu** : ~50+ tests qui passent ✅

### 2️⃣ Tests de Sécurité (Vulnérabilités)

Vérifie que le contrat sécurisé résiste aux attaques :

```bash
npx hardhat test test/VulnerabilityTests.test.js
```

**Ce qui est testé** :

- ✅ Protection contre reentrancy attacks
- ✅ Protection contre front-running
- ✅ Contrôle d'accès strict
- ✅ Gestion des cas limites

### 3️⃣ Analyse des Coûts de Gas

Mesure les coûts de chaque opération :

```bash
# Analyse détaillée
npx hardhat test test/ComprehensiveGasAnalysis.test.js

# Analyse simple
npx hardhat test test/SimpleGasAnalysis.test.js
```

**Résultat** : Tableau des coûts en gas pour chaque opération

### 4️⃣ Tests avec Couverture de Code

```bash
npx hardhat coverage
```

**Résultat** : Pourcentage de code testé (objectif : >90%)

### 5️⃣ Test Interactif (CLI)

Déployer et interagir avec le contrat en mode interactif :

```bash
# Terminal 1 : Démarrer un nœud local
npx hardhat node

# Terminal 2 : Déployer le contrat
npx hardhat run scripts/deploy-secure.js --network localhost

# Terminal 3 : Interface interactive
node scripts/interact.js
```

**Menu interactif disponible** :

- Créer un appel d'offres
- Soumettre une offre
- Révéler une offre
- Sélectionner le gagnant
- Approuver/payer les jalons

---

## 📊 Scénario de Test Complet (Manuel)

Suivez ces étapes pour tester le cycle complet :

### Étape 1 : Démarrer le réseau local

```bash
# Terminal 1
npx hardhat node
```

Gardez ce terminal ouvert ⚠️

### Étape 2 : Déployer le contrat

```bash
# Terminal 2
npx hardhat run scripts/deploy-secure.js --network localhost
```

**Notez l'adresse du contrat** affichée : `0x...`

### Étape 3 : Tester avec la console Hardhat

```bash
npx hardhat console --network localhost
```

Puis dans la console :

```javascript
// Charger le contrat
const Contract = await ethers.getContractFactory("SecureProcurementSystem");
const contract = await Contract.attach("ADRESSE_DU_CONTRAT");

// Obtenir les comptes de test
const [owner, company1, company2, auditor] = await ethers.getSigners();

// 1. Créer un appel d'offres
const budget = ethers.parseEther("10");
const submissionDeadline = Math.floor(Date.now() / 1000) + 86400; // +1 jour
const revealDeadline = submissionDeadline + 86400; // +2 jours
await contract.createTender(budget, submissionDeadline, revealDeadline);
console.log("✅ Appel d'offres créé");

// 2. Soumettre une offre (Company1)
const bidAmount = ethers.parseEther("8");
const secret = ethers.id("secret123");
const commitment = ethers.keccak256(
  ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "bytes32"],
    [bidAmount, secret]
  )
);
await contract.connect(company1).submitBid(0, commitment);
console.log("✅ Offre soumise (commit)");

// 3. Révéler l'offre (après submission deadline)
await ethers.provider.send("evm_increaseTime", [86400]);
await contract.connect(company1).revealBid(0, bidAmount, secret);
console.log("✅ Offre révélée");

// 4. Sélectionner le gagnant
await ethers.provider.send("evm_increaseTime", [86400]);
await contract.selectWinner(0);
console.log("✅ Gagnant sélectionné");

// 5. Approuver et payer le jalon
await contract.approveMilestone(0, 0);
await contract.releasePayment(0, 0, { value: ethers.parseEther("4") });
console.log("✅ Premier jalon payé");
```

---

## 📊 Résultats des Tests

### Couverture de Tests

Le projet dispose d'une suite de tests complète :

| Type de Tests     | Fichier                            | Nombre de Tests | Objectif                   |
| ----------------- | ---------------------------------- | --------------- | -------------------------- |
| Tests Unitaires   | `ProcurementSystem.test.js`        | ~30 tests       | Fonctionnalités de base    |
| Tests de Sécurité | `VulnerabilityTests.test.js`       | ~15 tests       | Attaques et vulnérabilités |
| Analyse Gas       | `ComprehensiveGasAnalysis.test.js` | ~10 tests       | Coûts d'opération          |
| Analyse Simple    | `SimpleGasAnalysis.test.js`        | ~5 tests        | Benchmark rapide           |

### Coûts Moyens (Gas)

_Prix estimés : 50 Gwei, ETH @ $2000_

| Opération                       | Gas Utilisé  | Coût (USD)  |
| ------------------------------- | ------------ | ----------- |
| 🏗️ Créer un appel d'offres      | ~340,000     | ~$10.20     |
| 📝 Soumettre une offre (commit) | ~85,000      | ~$2.55      |
| 🔓 Révéler une offre            | ~48,000      | ~$1.44      |
| 🏆 Sélectionner le gagnant      | ~55,000      | ~$1.65      |
| ✅ Approuver un jalon           | ~47,000      | ~$1.41      |
| 💰 Payer un jalon               | ~38,000      | ~$1.14      |
| **📊 Cycle complet**            | **~950,000** | **~$28.50** |

### Score de Sécurité

**Score Global : 9.0/10** ✅

- ✅ Aucune vulnérabilité critique
- ✅ Protection OpenZeppelin (>$500B TVL protégé)
- ✅ Pattern commit-reveal anti-front-running
- ✅ Tests de sécurité complets
- ⚠️ Audit professionnel recommandé avant mainnet

---

## 📁 Structure du Projet

```
MarchePublicSmartContracts/
│
├── contracts/                          # Smart Contracts Solidity
│   ├── SecureProcurementSystem.sol    # ✅ Version SÉCURISÉE (production)
│   ├── ProcurementSystem.sol          # ⚠️ Version VULNÉRABLE (éducative)
│   └── README.md                       # Documentation technique
│
├── scripts/                            # Scripts de déploiement
│   ├── deploy-secure.js               # Déployer version sécurisée
│   ├── deploy.js                      # Déployer version vulnérable
│   └── interact.js                    # CLI interactif
│
├── test/                               # Suite de tests
│   ├── ProcurementSystem.test.js      # Tests unitaires complets
│   ├── VulnerabilityTests.test.js     # Tests de sécurité
│   ├── ComprehensiveGasAnalysis.test.js # Analyse détaillée gas
│   ├── SimpleGasAnalysis.test.js      # Benchmark gas rapide
│   └── GasAnalysis.test.js            # Analyse gas supplémentaire
│
├── artifacts/                          # Artefacts de compilation Hardhat (auto-généré)
├── cache/                              # Cache Hardhat (auto-généré)
├── node_modules/                       # Dépendances npm (auto-généré)
│
├── .gitignore                          # Fichiers à ignorer par Git
├── hardhat.config.js                   # Configuration Hardhat
├── package.json                        # Dépendances npm
├── package-lock.json                   # Versions exactes des dépendances
├── setup.ps1                          # Script d'installation Windows
│
├── README.md                           # 📖 CE FICHIER (guide principal)
├── CLI_README.md                       # Documentation CLI interactif
├── ProjectGLD2026.md                   # Spécification académique complète
├── SECURITY_ANALYSIS_COMPLETE.md       # Analyse de sécurité (100+ pages)
├── BLOCKCHAIN_FORENSICS.md             # Analyse forensique blockchain
├── AI_CRITIQUE.md                      # Critique des outils d'audit IA
├── REPORT.md                           # Rapport technique
│
├── smartimage.png                      # Image du smart contract
├── transaction1.png                    # Screenshot transaction forensique 1
├── transaction2.png                    # Screenshot transaction forensique 2
├── transaction3.png                    # Screenshot transaction forensique 3
├── transaction4.png                    # Screenshot transaction forensique 4
└── transaction5.png                    # Screenshot transaction forensique 5

```

---

## 🎓 Contexte Académique

**Projet Universitaire** - Blockchain & Smart Contracts

- **Année Académique** : 2025-2026
- **Groupe** : ABADOU - ETTOUMI
- **Contrainte Principale** : Empêcher les attaques de front-running

### Paramètres du Projet

| Paramètre            | Valeur                         |
| -------------------- | ------------------------------ |
| Budget Maximum       | 12 ETH                         |
| Délai de soumission  | 2 jours                        |
| Délai de révélation  | +1 jour (3 jours total)        |
| Nombre d'entreprises | 3                              |
| Nombre de jalons     | 2 (50% + 50%)                  |
| Règle d'audit        | Auditeur approuve les 2 jalons |

---

## 🔒 Documentation de Sécurité

### Vulnérabilités Corrigées

Le contrat **SecureProcurementSystem.sol** protège contre :

1. ✅ **Reentrancy Attacks** : `ReentrancyGuard` d'OpenZeppelin
2. ✅ **Front-Running** : Pattern commit-reveal personnalisé
3. ✅ **Accès Non Autorisé** : `Ownable` + modificateurs personnalisés
4. ✅ **Integer Overflow** : Solidity 0.8+ (protections natives)
5. ✅ **Denial of Service** : Boucles bornées, pattern check-effects-interactions

### Recommandations avant Déploiement Mainnet

Avant de déployer en production sur Ethereum mainnet :

1. 🔍 **Audit Professionnel** : $15,000 - $30,000 (obligatoire)
   - Recommandé : Trail of Bits, ConsenSys Diligence, OpenZeppelin
2. 🔐 **Multi-Signature Wallet** : Gnosis Safe pour le rôle owner
3. 🛡️ **Assurance** : Nexus Mutual ou similaire
4. 🎁 **Bug Bounty** : Programme Immunefi (~10% TVL)
5. 📊 **Monitoring** : Tenderly, OpenZeppelin Defender

Voir [SECURITY_ANALYSIS_COMPLETE.md](SECURITY_ANALYSIS_COMPLETE.md) pour l'analyse complète.

---

## 🛠️ Commandes Utiles

### Développement

```bash
# Compiler les contrats
npx hardhat compile

# Nettoyer les artefacts
npx hardhat clean

# Lancer un nœud local
npx hardhat node

# Console interactive
npx hardhat console --network localhost
```

### Tests

```bash
# Tous les tests
npm test

# Tests avec rapport gas
REPORT_GAS=true npx hardhat test

# Test spécifique
npx hardhat test test/ProcurementSystem.test.js

# Couverture de code
npx hardhat coverage

# Tests de sécurité uniquement
npx hardhat test test/VulnerabilityTests.test.js
```

### Déploiement

```bash
# Réseau local
npx hardhat run scripts/deploy-secure.js --network localhost

# Testnet (Sepolia)
npx hardhat run scripts/deploy-secure.js --network sepolia

# Mainnet (production)
npx hardhat run scripts/deploy-secure.js --network mainnet
```

---

## 🐛 Dépannage

### Problème : `Error: network does not exist`

**Solution** : Vérifiez `hardhat.config.js`, assurez-vous que le réseau est configuré.

### Problème : `Error: cannot find module`

**Solution** : Réinstallez les dépendances

```bash
rm -rf node_modules package-lock.json
npm install
```

### Problème : Tests échouent avec `timeout`

**Solution** : Augmentez le timeout dans `hardhat.config.js`

```javascript
mocha: {
  timeout: 100000;
}
```

### Problème : Gas trop élevé

**Solution** : Optimisez le code ou utilisez un réseau layer-2 (Arbitrum, Optimism)

---

## 📚 Documentation Complémentaire

| Document                                                       | Description                               |
| -------------------------------------------------------------- | ----------------------------------------- |
| [ProjectGLD2026.md](ProjectGLD2026.md)                         | Spécification complète du projet          |
| [CLI_README.md](CLI_README.md)                                 | Guide d'utilisation CLI interactif        |
| [SECURITY_ANALYSIS_COMPLETE.md](SECURITY_ANALYSIS_COMPLETE.md) | Analyse de sécurité approfondie           |
| [contracts/README.md](contracts/README.md)                     | Documentation technique des contrats      |
| [BLOCKCHAIN_FORENSICS.md](BLOCKCHAIN_FORENSICS.md)             | Analyse forensique de transactions        |
| [AI_CRITIQUE.md](AI_CRITIQUE.md)                               | Évaluation critique des outils d'audit IA |

---

## 📜 Licence

MIT License - Voir fichier `LICENSE` pour détails.

---

## 👥 Auteur

**Ayoub Abadou**

- GitHub : [@abadouayoub](https://github.com/abadouayoub)
- Repository : [Public_procurement_processes_smart_contracts](https://github.com/abadouayoub/Public_procurement_processes_smart_contracts)

---

## ⚠️ Avertissement

**Version Éducative** : Ce projet contient une version intentionnellement vulnérable (`ProcurementSystem.sol`) à des fins d'apprentissage. **NE JAMAIS** déployer cette version en production.

**Version Production** : Utilisez **TOUJOURS** `SecureProcurementSystem.sol` avec un audit professionnel préalable.

---

## 🚀 Démarrage Rapide (TL;DR)

```bash
# Installation
npm install

# Tester le projet
npx hardhat test

# Déployer localement
npx hardhat node                                      # Terminal 1
npx hardhat run scripts/deploy-secure.js --network localhost  # Terminal 2
node scripts/interact.js                              # Terminal 3 (CLI)
```

**✅ Projet testé et fonctionnel** - Prêt pour démonstration académique
