import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Modal,
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
    const nextInputs = [...roundInputs];
    nextInputs[index].bagaji = nextInputs[index].bagaji === amount ? 0 : amount;
    setRoundInputs(nextInputs);
  };

  const getFinalScore = (input) => {
    const base = Number(input.baseScore || 0);
    return base + input.bagaji;
  };

  const getBagajiMeta = (bagaji) => {
    if (bagaji === 30) {
      return {
        label: '뻥바가지!',
        emoji: '💥',
        short: '뻥!',
      };
    }

    if (bagaji === 50) {
      return {
        label: '스톱바가지!',
        emoji: '🛑',
        short: '스톱!',
      };
    }

    return {
      label: '',
      emoji: '🎴',
      short: '',
    };
  };

  const getPreviewText = (input) => {
    const base = Number(input.baseScore || 0);
    const bagaji = input.bagaji;
    const finalScore = base + bagaji;

    if (!input.baseScore) {
      if (bagaji === 30) return '💥 뻥바가지 적용 대기 중!';
      if (bagaji === 50) return '🛑 스톱바가지 적용 대기 중!';
      return '🎴 이번 판 점수를 입력해주세요';
    }

    if (bagaji === 30) {
      return `${base} + 30 = ${finalScore}  ·  💥 뻥바가지!`;
    }

    if (bagaji === 50) {
      return `${base} + 50 = ${finalScore}  ·  🛑 스톱바가지!`;
    }

    return `🎴 이번 판 합계 ${finalScore}`;
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
      Alert.alert('입력 확인', nextErrors[firstErrorIndex]);
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
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topCard}>
          <Text style={styles.title}>🎴 게임 진행</Text>

          <View style={styles.roundWrap}>
            <View style={styles.roundLine} />
            <Text style={styles.roundText}>
              현재 <Text style={styles.roundHighlight}>{currentRound}</Text> / {totalRounds} 판
            </Text>
            <View style={styles.roundLine} />
          </View>

          <Text style={styles.helperText}>스톱 기준값 {stopThreshold}</Text>
        </View>

        {players.map((player, index) => {
          const hasError = inputErrors[index] !== '';
          const isBbungSelected = roundInputs[index].bagaji === 30;
          const isStopSelected = roundInputs[index].bagaji === 50;
          const bagajiMeta = getBagajiMeta(roundInputs[index].bagaji);

          return (
            <View key={index} style={styles.playerCard}>
              <View style={styles.playerHeaderRow}>
                <View>
                  <Text style={styles.playerName}>{player}</Text>
                  <Text style={styles.totalScore}>
                    누적 점수 <Text style={styles.totalScoreValue}>{totalScores[index]}</Text>
                  </Text>
                </View>

                {roundInputs[index].bagaji > 0 ? (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeEmoji}>{bagajiMeta.emoji}</Text>
                    <Text style={styles.activeBadgeText}>{bagajiMeta.short}</Text>
                  </View>
                ) : (
                  <View style={styles.idleBadge}>
                    <Text style={styles.idleBadgeText}>🎴 대기</Text>
                  </View>
                )}
              </View>

              <View style={styles.sectionBox}>
                <Text style={styles.sectionLabel}>기본 점수</Text>
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[styles.input, hasError && styles.inputError]}
                  placeholder="점수 입력"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  value={roundInputs[index].baseScore}
                  onChangeText={(text) => updateBaseScore(index, text)}
                  returnKeyType="done"
                />
                {hasError && <Text style={styles.errorText}>{inputErrors[index]}</Text>}
              </View>

              <View style={styles.sectionBox}>
                <Text style={styles.sectionLabel}>바가지 선택</Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.bagajiButton,
                      styles.bbungButton,
                      isBbungSelected && styles.bbungButtonSelected,
                    ]}
                    onPress={() => toggleBagaji(index, 30)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.bagajiTopRow}>
                      <Text style={styles.bagajiEmoji}>💥</Text>
                      <Text
                        style={[
                          styles.bagajiChip,
                          isBbungSelected && styles.bagajiChipSelectedLight,
                        ]}
                      >
                        +30
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.bagajiLabel,
                        isBbungSelected && styles.bagajiLabelSelectedLight,
                      ]}
                    >
                      뻥바가지!
                    </Text>
                    <Text
                      style={[
                        styles.bagajiSubText,
                        isBbungSelected && styles.bagajiSubTextSelectedLight,
                      ]}
                    >
                      앗, 나를 씌우다니 +30!
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.bagajiButton,
                      styles.stopButton,
                      isStopSelected && styles.stopButtonSelected,
                    ]}
                    onPress={() => toggleBagaji(index, 50)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.bagajiTopRow}>
                      <Text style={styles.bagajiEmoji}>🛑</Text>
                      <Text
                        style={[
                          styles.bagajiChip,
                          isStopSelected && styles.bagajiChipSelectedDark,
                        ]}
                      >
                        +50
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.bagajiLabel,
                        isStopSelected && styles.bagajiLabelSelectedDark,
                      ]}
                    >
                      스톱바가지!
                    </Text>
                    <Text
                      style={[
                        styles.bagajiSubText,
                        isStopSelected && styles.bagajiSubTextSelectedDark,
                      ]}
                    >
                      이런, 또 당했다 +50!
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  styles.previewBox,
                  roundInputs[index].bagaji === 30 && styles.previewBoxBbung,
                  roundInputs[index].bagaji === 50 && styles.previewBoxStop,
                ]}
              >
                <Text
                  style={[
                    styles.previewText,
                    roundInputs[index].bagaji > 0 && styles.previewTextAccent,
                  ]}
                >
                  {getPreviewText(roundInputs[index])}
                </Text>
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowRanking(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>🎴 순위 보기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveRound}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>
            {currentRound === totalRounds ? '결과 보기' : '이번 판 확정!'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showRanking}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRanking(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🎴 현재 순위</Text>

            {ranking.map((item, index) => (
              <View key={item.name + index} style={styles.rankRow}>
                <View style={styles.rankLeft}>
                  <Text style={[styles.rankMedal, index === 0 && styles.rankMedalFirst]}>
                    {index === 0 ? '🏆' : '•'}
                  </Text>
                  <Text
                    style={[
                      styles.rankText,
                      index === 0 && styles.firstRankText,
                    ]}
                  >
                    {index + 1}위 {item.name}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.rankScore,
                    index === 0 && styles.firstRankText,
                  ]}
                >
                  {item.score}
                </Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRanking(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF7F3',
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  topCard: {
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#F1DDD7',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginTop: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },
  roundWrap: {
    marginTop: 18,
    marginBottom: 4,
    alignItems: 'center',
  },
  roundLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#E9D5CF',
  },
  roundText: {
    marginVertical: 12,
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
  },
  roundHighlight: {
    color: '#D93A2F',
  },
  helperText: {
    fontSize: 14,
    color: '#7A6B66',
    textAlign: 'center',
  },
  playerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0DEDA',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  playerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playerName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111111',
  },
  totalScore: {
    marginTop: 6,
    fontSize: 14,
    color: '#666666',
  },
  totalScoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },
  activeBadge: {
    minWidth: 72,
    backgroundColor: '#FFF0EE',
    borderWidth: 1,
    borderColor: '#F2C2BC',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadgeEmoji: {
    fontSize: 14,
    marginBottom: 2,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D93A2F',
  },
  idleBadge: {
    backgroundColor: '#F8F1EE',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  idleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7A73',
  },
  sectionBox: {
    marginTop: 16,
  },
  sectionLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#463C39',
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E1D4CF',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111111',
    backgroundColor: '#FFFDFC',
  },
  inputError: {
    borderColor: '#E53935',
    borderWidth: 2,
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    color: '#E53935',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bagajiButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1.5,
  },
  bbungButton: {
    backgroundColor: '#FFF2F0',
    borderColor: '#F1B8AF',
  },
  stopButton: {
    backgroundColor: '#FFF6EC',
    borderColor: '#EDC98D',
  },
  bbungButtonSelected: {
    backgroundColor: '#FFE0DB',
    borderColor: '#D93A2F',
  },
  stopButtonSelected: {
    backgroundColor: '#2A211F',
    borderColor: '#2A211F',
  },
  bagajiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bagajiEmoji: {
    fontSize: 22,
  },
  bagajiChip: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555555',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bagajiChipSelectedLight: {
    backgroundColor: '#D93A2F',
    color: '#FFFFFF',
  },
  bagajiChipSelectedDark: {
    backgroundColor: '#FFFFFF',
    color: '#111111',
  },
  bagajiLabel: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  bagajiLabelSelectedLight: {
    color: '#B7251B',
  },
  bagajiLabelSelectedDark: {
    color: '#FFFFFF',
  },
  bagajiSubText: {
    marginTop: 6,
    fontSize: 13,
    color: '#7A6B66',
    fontWeight: '600',
  },
  bagajiSubTextSelectedLight: {
    color: '#8F2A21',
  },
  bagajiSubTextSelectedDark: {
    color: '#E7D9D4',
  },
  previewBox: {
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9F3F1',
    borderWidth: 1,
    borderColor: '#F0DEDA',
  },
  previewBoxBbung: {
    backgroundColor: '#FFF0ED',
    borderColor: '#F1B8AF',
  },
  previewBoxStop: {
    backgroundColor: '#FFF7EA',
    borderColor: '#EDC98D',
  },
  previewText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2A2220',
  },
  previewTextAccent: {
    color: '#B92B20',
  },
  secondaryButton: {
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: '#1F1A18',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1A18',
  },
  saveButton: {
    marginTop: 14,
    backgroundColor: '#D93A2F',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 17, 17, 0.38)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFDFC',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0DEDA',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 16,
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3ECE9',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankMedal: {
    width: 24,
    fontSize: 14,
    color: '#A08B84',
  },
  rankMedalFirst: {
    fontSize: 16,
  },
  rankText: {
    fontSize: 16,
    color: '#111111',
    fontWeight: '600',
  },
  rankScore: {
    fontSize: 16,
    color: '#111111',
    fontWeight: '500',
  },
  firstRankText: {
    color: '#D93A2F',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#1F1A18',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});