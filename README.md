# 📌 뻥노트 (BbungNote)

> 나이롱 뻥(화투 게임) 중 번거로운 점수 계산을 더 빠르고 직관적으로 해결하기 위해 만든 MVP 앱

![React Native](https://img.shields.io/badge/React%20Native-Expo-000000?logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![Storage](https://img.shields.io/badge/Storage-AsyncStorage-4A90E2)
![Status](https://img.shields.io/badge/Status-MVP-success)

![bbungnote-cover](./assets/icon.png)

## 📚 Table of Contents

- [Overview](#-overview)
- [Problem](#-problem)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [UX Design Focus](#-ux-design-focus)
- [User Flow](#-user-flow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Future Improvements](#-future-improvements)


## 🧩 Overview

뻥노트는 화투 게임 중 발생하는 **점수 계산의 번거로움과 실수 문제를 해결하기 위해 기획 및 개발된 모바일 앱**입니다.

단순한 점수 계산 도구가 아니라,  
👉 **게임의 몰입을 방해하지 않는 UX**를 목표로 설계되었습니다.

---

## 🎯 Problem

화투 게임을 진행하면서 다음과 같은 문제를 발견했습니다.

- 점수 계산 과정이 번거롭다  
- 수기로 기록 시 계산 실수가 발생한다  
- 점수 정리 과정에서 게임 흐름이 끊긴다  

👉 특히 “재미보다 계산이 먼저”가 되는 경험이 문제였습니다.

---

## 💡 Solution

뻥노트는 다음과 같은 방식으로 문제를 해결합니다.

- 점수 입력 → 자동 누적 계산  
- ‘바가지’ 기능을 통한 추가 점수 반영  
- 결과를 한눈에 확인 가능한 UI  
- 게임 종료 후 자동 히스토리 저장  

👉 **최소한의 입력으로 최대한의 편의성 제공**

---

## 🚀 Key Features

### 🎮 Game Management
- 플레이어 등록 및 게임 시작
- 게임 설정 (판 수, 기준값)

### 🧮 Score System
- 판별 점수 입력
- 자동 누적 계산
- 실시간 점수 반영

### 💥 Special Rule
- ‘바가지’ 기능을 통한 추가 점수 처리

### 🏆 Result
- 최종 점수 및 순위 제공
- 직관적인 결과 화면

### 🗂 History
- 게임 결과 자동 저장
- 이전 기록 조회 및 상세 확인

### ⚙️ Settings
- 기본값 설정 및 사용자 환경 커스터마이징

---

## 🧠 UX Design Focus

본 프로젝트에서 가장 중요하게 고려한 UX 포인트는 다음과 같습니다.

- 입력 최소화 → 게임 흐름 유지  
- 즉시 피드백 → 점수 입력과 동시에 결과 반영  
- 단순한 구조 → 누구나 쉽게 사용 가능  

👉 **“게임을 멈추지 않게 하는 것”이 핵심 목표**

---

## 🔄 User Flow

앱 실행  
→ 홈 화면  

→ 새 게임 시작  
→ 플레이어 입력  
→ 게임 진행 (점수 입력)  
→ 바가지 적용  
→ 점수 누적 계산  
→ 결과 화면  
→ 히스토리 저장  

→ 히스토리 조회  
→ 상세 결과 확인  

→ 설정  
→ 기본값 수정  

→ 룰 보기  

---

## 📱 Screen Structure

- Home  
- Game  
- Result  
- History  
- Settings  
- Rules  

---

## 🛠 Tech Stack

- React Native (Expo)  
- JavaScript  
- AsyncStorage  

---

## 📂 Project Structure
```
bbungnote/
├── screens/
│ ├── HomeScreen.js
│ ├── GameScreen.js
│ ├── ResultScreen.js
│ ├── HistoryScreen.js
│ ├── SettingsScreen.js
│ └── RulesScreen.js
│
├── components/
├── utils/
└── assets/
```



---

## ⚙️ Getting Started

### 1. Install dependencies

npm install


### 2. Start the app

npx expo start



---

## 📸 Preview

> (스크린샷 또는 GIF 추가 예정)

---

## 💡 What I Learned

- 사용자 경험은 기능보다 우선될 수 있다  
- 단순한 앱일수록 UX 설계가 더 중요하다  
- MVP는 빠르게 만들고 실제 사용을 통해 개선해야 한다  

---

## 🔧 Future Improvements

- 게이미피케이션 요소 추가  
- 애니메이션 및 인터랙션 강화  
- 멀티 플레이 / 공유 기능  
- 클라우드 데이터 저장  
- 다양한 카드 게임 확장  

---

## 🙋‍♀️ Summary

> 뻥노트는 단순한 점수 기록 앱이 아니라,  
> **게임의 몰입을 유지하기 위한 UX 중심 서비스**입니다.

