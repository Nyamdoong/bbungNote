import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_HISTORY_KEY = 'gameHistory';
const SETTINGS_KEY = 'gameSettings';
const RECENT_PLAYERS_KEY = 'recentPlayers';

export async function saveGameHistory(newGame) {
  try {
    const existing = await AsyncStorage.getItem(GAME_HISTORY_KEY);
    const parsed = existing ? JSON.parse(existing) : [];

    const updated = [newGame, ...parsed];
    await AsyncStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('히스토리 저장 실패:', error);
  }
}

export async function getGameHistory() {
  try {
    const data = await AsyncStorage.getItem(GAME_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('히스토리 불러오기 실패:', error);
    return [];
  }
}

export async function clearGameHistory() {
  try {
    await AsyncStorage.removeItem(GAME_HISTORY_KEY);
  } catch (error) {
    console.error('히스토리 삭제 실패:', error);
  }
}

export async function deleteGameHistoryById(targetId) {
  try {
    const existing = await AsyncStorage.getItem(GAME_HISTORY_KEY);
    const parsed = existing ? JSON.parse(existing) : [];

    const updated = parsed.filter((game) => game.id !== targetId);
    await AsyncStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('선택 히스토리 삭제 실패:', error);
  }
}

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('설정 저장 실패:', error);
  }
}

export async function getSettings() {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);

    if (!data) {
      return {
        defaultRounds: 15,
        stopThreshold: 3,
      };
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('설정 불러오기 실패:', error);
    return {
      defaultRounds: 15,
      stopThreshold: 3,
    };
  }
}

export async function saveRecentPlayers(playerNames) {
  try {
    const cleanedNames = playerNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (cleanedNames.length === 0) {
      return;
    }

    const existing = await AsyncStorage.getItem(RECENT_PLAYERS_KEY);
    const parsed = existing ? JSON.parse(existing) : [];

    const merged = [...cleanedNames, ...parsed];
    const unique = [];

    for (const name of merged) {
      const alreadyExists = unique.some(
        (savedName) => savedName.toLowerCase() === name.toLowerCase()
      );

      if (!alreadyExists) {
        unique.push(name);
      }
    }

    await AsyncStorage.setItem(
      RECENT_PLAYERS_KEY,
      JSON.stringify(unique.slice(0, 12))
    );
  } catch (error) {
    console.error('최근 플레이어 저장 실패:', error);
  }
}

export async function getRecentPlayers() {
  try {
    const data = await AsyncStorage.getItem(RECENT_PLAYERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('최근 플레이어 불러오기 실패:', error);
    return [];
  }
}