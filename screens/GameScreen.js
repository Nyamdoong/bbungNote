import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const MAX_BASE_SCORE = 56;
const ALLOWED_NEGATIVE_SCORES = [-100, -21, -27, -33, -39, -45, -51, -57];

export default function GameScreen() {
  const params = useLocalSearchParams();
  const inputRefs = useRef([]);

  const players = useMemo(() => {
    try {
      return JSON.parse(params.players || '[]');
    } catch (error) {
      return [];
    }
  }, [params.players]);

  const totalRounds = Number(params.totalRounds || 15);
  const stopThreshold = Number(params.stopThreshold || 3);

  const [currentRound, setCurrentRound] = useState(1);
  const [totalScores, setTotalScores] = useState(players.map(() => 0));
  const [showRanking, setShowRanking] = useState(false);
  const [roundHistory, setRoundHistory] = useState([]);
  const [roundInputs, setRoundInputs] = useState(
    players.map(() => ({
      baseScore: '',
      bagaji: 0,
    }))
  );
  const [inputErrors, setInputErrors] = useState(players.map(() => ''));

  const validateBaseScore = (value) => {
    const trimmed = String(value).trim();

    if (trimmed === '') {
      return '점수를 입력해주세요.';
    }

    if (!/^-?\d+$/.test(trimmed)) {
      return '숫자만 입력할 수 있어요.';
    }

    const numericValue = Number(trimmed);

    if (numericValue === 1) {
      return '1점은 입력할 수 없어요.';
    }

    if (numericValue < 0) {
      if (!ALLOWED_NEGATIVE_SCORES.includes(numericValue)) {
        return '음수는 -100, -21, -27, -33, -39, -45, -51, -57만 입력할 수 있어요.';
      }
      return '';
    }

    if (numericValue > MAX_BASE_SCORE) {
      return `${MAX_BASE_SCORE}보다 큰 값은 입력할 수 없어요.`;
    }

    return '';
  };

  const updateBaseScore = (index, value) => {
    const nextInputs = [...roundInputs];
    nextInputs[index].baseScore = value;
    setRoundInputs(nextInputs);

    const nextErrors = [...inputErrors];
    nextErrors[index] = validateBaseScore(value);
    setInputErrors(nextErrors);
  };

  const toggleBagaji = (index, amount) => {
    const next = [...roundInputs];
    next[index].bagaji = next[index].bagaji === amount ? 0 : amount;
    setRoundInputs(next);
  };

  const getFinalScore = (input) => {
    const base = Number(input.baseScore || 0);
    return base + input.bagaji;
  };

  const ranking = useMemo(() => {
    return players
      .map((name, index) => ({
        name,
        score: totalScores[index],
      }))
      .sort((a, b) => a.score - b.score);
  }, [players, totalScores]);

  const focusInput = (index) => {
    const target = inputRefs.current[index];
    if (target && typeof target.focus === 'function') {
      target.focus();
    }
  };

  const handleSaveRound = () => {
    const nextErrors = roundInputs.map((input) =>
      validateBaseScore(input.baseScore)
    );

    setInputErrors(nextErrors);

    const firstErrorIndex = nextErrors.findIndex((error) => error !== '');

    if (firstErrorIndex !== -1) {
      focusInput(firstErrorIndex);

      const errorMessage =
        nextErrors[firstErrorIndex] || '입력값을 다시 확인해주세요.';
      Alert.alert('입력 확인', errorMessage);
      return;
    }

    const roundFinalScores = roundInputs.map((input) => getFinalScore(input));

    const nextTotalScores = totalScores.map(
      (score, index) => score + roundFinalScores[index]
    );

    const roundRecord = {
      roundNumber: currentRound,
      scores: players.map((playerName, index) => ({
        playerName,
        baseScore: Number(roundInputs[index].baseScore),
        bagaji: roundInputs[index].bagaji,
        finalScore: roundFinalScores[index],
      })),
    };

    const nextHistory = [...roundHistory, roundRecord];

    if (currentRound >= totalRounds) {
      router.push({
        pathname: '/result',
        params: {
          players: JSON.stringify(players),
          totalScores: JSON.stringify(nextTotalScores),
          roundHistory: JSON.stringify(nextHistory),
          totalRounds: String(totalRounds),
          stopThreshold: String(stopThreshold),
        },
      });
      return;
    }

    setTotalScores(nextTotalScores);
    setRoundHistory(nextHistory);
    setCurrentRound((prev) => prev + 1);
    setRoundInputs(
      players.map(() => ({
        baseScore: '',
        bagaji: 0,
      }))
    );
    setInputErrors(players.map(() => ''));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>게임 진행</Text>
      <Text style={styles.subtitle}>
        {currentRound} / {totalRounds} 판
      </Text>
      <Text style={styles.helperText}>스톱 기준값: {stopThreshold}</Text>

      {players.map((player, index) => {
        const finalScore = getFinalScore(roundInputs[index]);
        const hasError = inputErrors[index] !== '';

        return (
          <View key={index} style={styles.playerCard}>
            <View style={styles.playerHeader}>
              <Text style={styles.playerName}>{player}</Text>
              <Text style={styles.totalScore}>누적 {totalScores[index]}점</Text>
            </View>

            <Text style={styles.label}>이번 판 점수</Text>
            <TextInput
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[styles.input, hasError && styles.inputError]}
              placeholder="예: 20, -100, 0"
              keyboardType="numeric"
              value={roundInputs[index].baseScore}
              onChangeText={(text) => updateBaseScore(index, text)}
              returnKeyType="done"
            />

            {hasError && <Text style={styles.errorText}>{inputErrors[index]}</Text>}

            <Text style={styles.label}>바가지</Text>
            <View style={styles.bagajiRow}>
              <TouchableOpacity
                style={[
                  styles.bagajiButton,
                  roundInputs[index].bagaji === 30 && styles.bagajiButtonSelected,
                ]}
                onPress={() => toggleBagaji(index, 30)}
              >
                <Text
                  style={[
                    styles.bagajiButtonText,
                    roundInputs[index].bagaji === 30 &&
                      styles.bagajiButtonTextSelected,
                  ]}
                >
                  +30
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.bagajiButton,
                  roundInputs[index].bagaji === 50 && styles.bagajiButtonSelected,
                ]}
                onPress={() => toggleBagaji(index, 50)}
              >
                <Text
                  style={[
                    styles.bagajiButtonText,
                    roundInputs[index].bagaji === 50 &&
                      styles.bagajiButtonTextSelected,
                  ]}
                >
                  +50
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.previewText}>최종 점수: {finalScore}점</Text>
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.rankingButton}
        onPress={() => setShowRanking((prev) => !prev)}
      >
        <Text style={styles.rankingButtonText}>
          {showRanking ? '순위 숨기기' : '순위 보기'}
        </Text>
      </TouchableOpacity>

      {showRanking && (
        <View style={styles.rankingCard}>
          <Text style={styles.rankingTitle}>현재 순위</Text>
          {ranking.map((item, index) => (
            <View key={item.name + index} style={styles.rankingRow}>
              <Text style={styles.rankingText}>
                {index + 1}위 {item.name}
              </Text>
              <Text style={styles.rankingText}>{item.score}점</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveRound}>
        <Text style={styles.saveButtonText}>이번 판 저장</Text>
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
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  helperText: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
  },
  playerCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    backgroundColor: '#fafafa',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  totalScore: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  label: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e53935',
    borderWidth: 2,
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#e53935',
    fontWeight: '500',
  },
  bagajiRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bagajiButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#ececec',
  },
  bagajiButtonSelected: {
    backgroundColor: '#222',
  },
  bagajiButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  bagajiButtonTextSelected: {
    color: '#fff',
  },
  previewText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  rankingButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#efefef',
    alignItems: 'center',
  },
  rankingButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  rankingCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#ececec',
  },
  rankingTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  rankingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rankingText: {
    fontSize: 15,
    color: '#222',
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#222',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});