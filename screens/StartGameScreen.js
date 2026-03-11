import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function StartGameScreen() {
  const [playerCount, setPlayerCount] = useState(4);
  const [players, setPlayers] = useState(['', '', '', '']);
  const [totalRounds, setTotalRounds] = useState('15');
  const [stopThreshold, setStopThreshold] = useState('3');
  const [showRoundOptions, setShowRoundOptions] = useState(false);

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
  };

  const handlePlayerNameChange = (text, index) => {
    const nextPlayers = [...players];
    nextPlayers[index] = text;
    setPlayers(nextPlayers);
  };

  const handleStartGame = () => {
    const normalizedPlayers = players.map((name, index) => {
      const trimmed = name.trim();
      return trimmed.length > 0 ? trimmed : `플레이어 ${index + 1}`;
    });

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>뻥노트</Text>
      <Text style={styles.subtitle}>새 게임 시작</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>플레이어 수</Text>
        <View style={styles.optionRow}>
          {[3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.optionButton,
                playerCount === num && styles.optionButtonSelected,
              ]}
              onPress={() => handlePlayerCountChange(num)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  playerCount === num && styles.optionButtonTextSelected,
                ]}
              >
                {num}명
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>플레이어 이름</Text>
        {players.map((player, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`플레이어 ${index + 1}`}
            value={player}
            onChangeText={(text) => handlePlayerNameChange(text, index)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>게임 설정</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>총 판 수</Text>
            <Text style={styles.settingValue}>{totalRounds}판</Text>
          </View>

          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setShowRoundOptions((prev) => !prev)}
          >
            <Text style={styles.changeButtonText}>
              {showRoundOptions ? '판 수 변경 닫기' : '판 수 변경'}
            </Text>
          </TouchableOpacity>

          {showRoundOptions && (
            <>
              <View style={[styles.optionRow, { marginTop: 12 }]}>
                {[10, 15, 20].map((round) => (
                  <TouchableOpacity
                    key={round}
                    style={[
                      styles.optionButton,
                      totalRounds === String(round) && styles.optionButtonSelected,
                    ]}
                    onPress={() => setTotalRounds(String(round))}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        totalRounds === String(round) &&
                          styles.optionButtonTextSelected,
                      ]}
                    >
                      {round}판
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.input, { marginTop: 12 }]}
                placeholder="직접 입력"
                keyboardType="numeric"
                value={totalRounds}
                onChangeText={setTotalRounds}
              />
            </>
          )}
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>스톱 기준값</Text>
          <TextInput
            style={[styles.input, { marginTop: 10, marginBottom: 0 }]}
            placeholder="기본값 3"
            keyboardType="numeric"
            value={stopThreshold}
            onChangeText={setStopThreshold}
          />
          <Text style={styles.helperText}>
            손패 합이 이 값 이하일 때 스톱 가능
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
        <Text style={styles.startButtonText}>게임 시작</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
  },
  optionButtonSelected: {
    backgroundColor: '#222',
  },
  optionButtonText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  settingCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  changeButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e9e9e9',
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  helperText: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
  },
  startButton: {
    marginTop: 30,
    backgroundColor: '#222',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});