# 📅 INeedMedic - Application de prise de rendez-vous avec praticiens

## 📋 Table des matières

- [Présentation du projet](#-présentation-du-projet)
- [Contexte & problématique](#-contexte--problématique)
- [Objectifs](#-objectifs)
- [Stack technique](#-stack-technique)
- [Utilisateurs & rôles](#-utilisateurs--rôles)
- [Fonctionnalités principales](#-fonctionnalités-principales-mvp)
- [Logique métier](#-logique-métier)
- [Sécurité & bonnes pratiques](#-sécurité--bonnes-pratiques)

---

## 🎯 Présentation du projet

**Nom** : INeedMedic  
**Type** : Application Web Full-Stack  
**Statut** : Projet personnel en développement

### Description

Application de prise de rendez-vous en ligne pour des praticiens de santé et bien-être, conçue comme un produit prêt pour la production.

### Démonstration de compétences

- ✅ Conception d'un produit web de bout en bout
- ✅ Implémentation d'une logique métier réaliste
- ✅ Utilisation d'une stack JavaScript moderne
- ✅ Architecture backend propre et maintenable

---

## 🔍 Contexte & problématique

### Situation actuelle

De nombreux praticiens (kinésithérapeutes, psychologues, coachs, etc.) utilisent encore :

- 🔧 Des outils peu flexibles
- 💰 Des solutions coûteuses ou surdimensionnées

### Problèmes identifiés

| Problème                              | Impact                     |
| ------------------------------------- | -------------------------- |
| Gestion manuelle des créneaux         | Perte de temps             |
| Annulations mal gérées                | Mauvaise expérience client |
| Manque de visibilité pour les clients | Barrière à l'accessibilité |

---

## 🎯 Objectifs

### Objectifs fonctionnels

- 📅 Permettre aux clients de réserver un rendez-vous en ligne
- 📧 Automatiser les confirmations et annulations par email

### Objectifs techniques

- 🏗️ Construire une application full-stack avec Next.js
- ⚙️ Implémenter une logique métier côté serveur
- 🗄️ Concevoir une base de données cohérente
- 🚀 Déployer une application prête à la production

---

## 🛠️ Stack technique

### Frontend

| Technologie              | Usage                 |
| ------------------------ | --------------------- |
| **Next.js (App Router)** | Framework React       |
| **React**                | Interface utilisateur |
| **TypeScript**           | Typage statique       |
| **Tailwind CSS**         | Styles                |
| **shadcn/ui**            | Composants UI         |

### Backend

- **Next.js Backend**
  - Server Actions
  - Route Handlers
- **Prisma ORM** - Gestion de la base de données
- **PostgreSQL** - Base de données relationnelle

### Authentification

- **Next-Auth** - Gestion de l'authentification
- Gestion des rôles : `client`, `praticien`

### Notifications

- **Resend** - Service d'envoi d'emails
- Templates d'emails en React

### Déploiement

- **Vercel** - Hébergement de l'application
- **Neon** - Base de données PostgreSQL managée

---

## 👥 Utilisateurs & rôles

### 👤 Client

- ✅ Créer un compte
- 🔍 Consulter les praticiens disponibles
- 📅 Réserver / annuler un rendez-vous
- 📧 Recevoir des emails de confirmation

### 👨‍⚕️ Praticien

- 🕐 Gérer ses disponibilités
- 👀 Voir les rendez-vous à venir
- ❌ Annuler un rendez-vous

---

## ⚡ Fonctionnalités principales (MVP)

### 🔐 Authentification

- Inscription / connexion sécurisée
- Gestion des rôles utilisateurs
- Protection des routes par authentification

### 👨‍⚕️ Gestion des praticiens

- Création et modification du profil praticien
- Définition des horaires de travail
- Gestion des indisponibilités (congés, jours fériés)

### 📅 Prise de rendez-vous

- Affichage dynamique des créneaux disponibles
- Prévention des doubles réservations
- Système de réservation / annulation
- Règles d'annulation (ex : délai de 24h minimum)

### 📧 Notifications automatiques

- ✅ Confirmation de rendez-vous
- ❌ Notification d'annulation

---

## 📐 Logique métier

### Règles de gestion

| Règle                       | Description                                                              |
| --------------------------- | ------------------------------------------------------------------------ |
| **Unicité des créneaux**    | Un créneau ne peut être réservé qu'une seule fois                        |
| **Prévention des conflits** | Un praticien ne peut pas avoir deux rendez-vous simultanés               |
| **Rendez-vous passés**      | Les rendez-vous passés ne sont pas modifiables                           |
| **Délai d'annulation**      | Les annulations sont bloquées en-dessous d'un délai défini (ex: 24h)     |
| **Validation des horaires** | Les rendez-vous ne peuvent être pris que pendant les horaires de travail |

---
