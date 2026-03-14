import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getRecentPlayers,
  getSettings,
  saveRecentPlayers,
} from '../storage/storage';

export default function StartGameScreen() {
  const [playerCount, setPlayerCount] = useState(4);
  const [players, setPlayers] = useState(['', '', '', '']);
  const [totalRounds, setTotalRounds] = useState('15');
  const [stopThreshold, setStopThreshold] = useState('3');
  const [showRoundOptions, setShowRoundOptions] = useState(false);

  const [recentPlayers, setRecentPlayers] = useState([]);
  const [activeInputIndex, setActiveInputIndex] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  async function loadInitialData() {
    try {
      const [settings, savedRecentPlayers] = await Promise.all([
        getSettings(),
        getRecentPlayers(),
      ]);

      setTotalRounds(String(settings?.defaultRounds ?? 15));
      setStopThreshold(String(settings?.stopThreshold ?? 3));
      setRecentPlayers(savedRecentPlayers ?? []);
    } catch (error) {
      console.error('시작 화면 데이터 불러오기 실패:', error);
    }
  }

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);

    setPlayers((prev) => {
      const nextPlayers = [...prev];

      if (count > nextPlayers.length) {
        while (nextPlayers.length < count) {
          nextPlayers.push('');
        }
      } else {
        nextPlayers.length = count;
      }

      return nextPlayers;
    });

    if (activeInputIndex !== null && activeInputIndex >= count) {
      setActiveInputIndex(null);
    }
  };

  const handlePlayerNameChange = (text, index) => {
    const nextPlayers = [...players];
    nextPlayers[index] = text;
    setPlayers(nextPlayers);
    setActiveInputIndex(index);
  };

  const handleSelectSuggestion = (name, index) => {
    const nextPlayers = [...players];
    nextPlayers[index] = name;
    setPlayers(nextPlayers);
    setActiveInputIndex(null);
  };

  const getSuggestionsForIndex = (index) => {
    const currentValue = players[index]?.trim() ?? '';
    const usedNames = players
      .filter((_, i) => i !== index)
      .map((name) => name.trim().toLowerCase())
      .filter(Boolean);

    const filtered = recentPlayers.filter((name) => {
      const lowerName = name.toLowerCase();

      if (usedNames.includes(lowerName)) {
        return false;
      }

      if (!currentValue) {
        return true;
      }

      return lowerName.includes(currentValue.toLowerCase());
    });

    return filtered.slice(0, 5);
  };

  const handleStartGame = async () => {
    const normalizedPlayers = players.map((name, index) => {
      const trimmed = name.trim();
      return trimmed.length > 0 ? trimmed : `플레이어 ${index + 1}`;
    });

    try {
      await saveRecentPlayers(players);
    } catch (error) {
      console.error('최근 플레이어 저장 실패:', error);
    }

    router.push({
      pathname: '/game',
      params: {
        players: JSON.stringify(normalizedPlayers),
        totalRounds,
        stopThreshold,
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.heroCard}>
        <Text style={styles.title}>🎴 뻥노트</Text>
        <Text style={styles.subtitle}>가볍게 시작하고, 깔끔하게 점수 기록하기</Text>

        <View style={styles.heroBadgeRow}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>새 게임</Text>
          </View>
          <View style={styles.heroBadgeSoft}>
            <Text style={styles.heroBadgeSoftText}>화투 감성 기록장</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>플레이어 수</Text>
        <View style={styles.optionRow}>
          {[3, 4, 5].map((num) => {
            const selected = playerCount === num;

            return (
              <TouchableOpacity
                key={num}
                style={[
                  styles.optionButton,
                  selected && styles.optionButtonSelected,
                ]}
                onPress={() => handlePlayerCountChange(num)}
                activeOpacity={0.85}
              >
                <Text style={styles.optionEmoji}>🎴</Text>
                <Text
                  style={[
                    styles.optionButtonText,
                    selected && styles.optionButtonTextSelected,
                  ]}
                >
                  {num}명
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>플레이어 이름</Text>
        <Text style={styles.sectionHelper}>
          비워두면 플레이어 1, 2, 3...으로 자동 시작돼요
        </Text>

        {players.map((player, index) => {
          const suggestions =
            activeInputIndex === index ? getSuggestionsForIndex(index) : [];

          return (
            <View key={index} style={styles.playerBlock}>
              <View style={styles.nameRow}>
                <View style={styles.nameBadge}>
                  <Text style={styles.nameBadgeText}>{index + 1}</Text>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder={`플레이어 ${index + 1}`}
                  placeholderTextColor="#9A8D87"
                  value={player}
                  onFocus={() => setActiveInputIndex(index)}
                  onBlur={() => {
                    setTimeout(() => {
                      setActiveInputIndex((prev) =>
                        prev === index ? null : prev
                      );
                    }, 120);
                  }}
                  onChangeText={(text) => handlePlayerNameChange(text, index)}
                  returnKeyType={index === playerCount - 1 ? 'done' : 'next'}
                />
              </View>

              {suggestions.length > 0 && (
                <View style={styles.suggestionBox}>
                  <Text style={styles.suggestionTitle}>최근 플레이어</Text>

                  <View style={styles.suggestionList}>
                    {suggestions.map((name) => (
                      <Pressable
                        key={`${index}-${name}`}
                        style={({ pressed }) => [
                          styles.suggestionChip,
                          pressed && styles.suggestionChipPressed,
                        ]}
                        onPress={() => handleSelectSuggestion(name, index)}
                      >
                        <Text style={styles.suggestionChipText}>{name}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <Pressable
          style={({ pressed }) => [
            styles.quickStartButton,
            pressed && styles.quickStartButtonPressed,
          ]}
          onPress={handleStartGame}
        >
          <Text style={styles.quickStartButtonText}>기본 이름으로 바로 시작</Text>
        </Pressable>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>게임 설정</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>총 판 수</Text>
              <Text style={styles.settingDescription}>몇 판까지 진행할지 정해요</Text>
            </View>
            <View style={styles.valuePill}>
              <Text style={styles.valuePillText}>{totalRounds}판</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setShowRoundOptions((prev) => !prev)}
            activeOpacity={0.85}
          >
            <Text style={styles.changeButtonText}>
              {showRoundOptions ? '판 수 옵션 닫기' : '판 수 변경'}
            </Text>
          </TouchableOpacity>

          {showRoundOptions && (
            <View style={styles.optionArea}>
              <View style={styles.optionRow}>
                {[10, 15, 20].map((round) => {
                  const selected = totalRounds === String(round);

                  return (
                    <TouchableOpacity
                      key={round}
                      style={[
                        styles.optionButton,
                        selected && styles.optionButtonSelected,
                      ]}
                      onPress={() => setTotalRounds(String(round))}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.optionEmoji}>🃏</Text>
                      <Text
                        style={[
                          styles.optionButtonText,
                          selected && styles.optionButtonTextSelected,
                        ]}
                      >
                        {round}판
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                style={[styles.input, styles.extraInput]}
                placeholder="직접 입력"
                placeholderTextColor="#9A8D87"
                keyboardType="numeric"
                value={totalRounds}
                onChangeText={setTotalRounds}
              />
            </View>
          )}
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingRowTop}>
            <View>
              <Text style={styles.settingLabel}>스톱 기준값</Text>
              <Text style={styles.settingDescription}>
                손패 합이 이 값 이하일 때 스톱 가능
              </Text>
            </View>
            <View style={styles.valuePillSoft}>
              <Text style={styles.valuePillSoftText}>{stopThreshold || '3'}</Text>
            </View>
          </View>

          <TextInput
            style={[styles.input, styles.extraInput]}
            placeholder="기본값 3"
            placeholderTextColor="#9A8D87"
            keyboardType="numeric"
            value={stopThreshold}
            onChangeText={setStopThreshold}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartGame}
        activeOpacity={0.85}
      >
        <Text style={styles.startButtonText}>🎴 게임 시작</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 40,
    backgroundColor: '#FFF7F3',
  },
  heroCard: {
    marginTop: 8,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#F1DDD7',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111111',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#7A6B66',
    lineHeight: 22,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  heroBadge: {
    backgroundColor: '#D93A2F',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  heroBadgeSoft: {
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#F1C9C1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroBadgeSoftText: {
    color: '#B33A30',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0DEDA',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F1A18',
  },
  sectionHelper: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#8B7A73',
    lineHeight: 20,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 14,
  },
  optionButton: {
    minWidth: 92,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#FFF3F0',
    borderWidth: 1.5,
    borderColor: '#F1C9C1',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#2A211F',
    borderColor: '#2A211F',
  },
  optionEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  optionButtonText: {
    fontSize: 15,
    color: '#2A211F',
    fontWeight: '600',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },
  playerBlock: {
    marginTop: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nameBadge: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#F1C9C1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B33A30',
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E1D4CF',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
    backgroundColor: '#FFFDFC',
  },
  suggestionBox: {
    marginTop: 8,
    marginLeft: 44,
    backgroundColor: '#FFF9F7',
    borderWidth: 1,
    borderColor: '#F1E2DD',
    borderRadius: 14,
    padding: 12,
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8C5A4F',
    marginBottom: 8,
  },
  suggestionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#F1C9C1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  suggestionChipPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  suggestionChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B33A30',
  },
  quickStartButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#F8EEEB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  quickStartButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  quickStartButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B4A45',
  },
  settingCard: {
    borderWidth: 1,
    borderColor: '#F1E2DD',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    backgroundColor: '#FFFCFB',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A211F',
  },
  settingDescription: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#8B7A73',
  },
  valuePill: {
    backgroundColor: '#D93A2F',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  valuePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  valuePillSoft: {
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#F1C9C1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  valuePillSoftText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B33A30',
  },
  changeButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F7EEEB',
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#463C39',
  },
  optionArea: {
    marginTop: 2,
  },
  extraInput: {
    marginTop: 12,
  },
  startButton: {
    marginTop: 22,
    backgroundColor: '#D93A2F',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});