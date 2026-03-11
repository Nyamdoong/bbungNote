import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { saveGameHistory } from '../storage/storage';
import { addRankToList, getRankLabel } from '../utils/ranking';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const hasSavedRef = useRef(false);
  const [showRoundHistory, setShowRoundHistory] = useState(false);

  const players = useMemo(() => {
    try {
      return JSON.parse(params.players || '[]');
    } catch (error) {
      return [];
    }
  }, [params.players]);

  const totalScores = useMemo(() => {
    try {
      return JSON.parse(params.totalScores || '[]');
    } catch (error) {
      return [];
    }
  }, [params.totalScores]);

  const roundHistory = useMemo(() => {
    try {
      return JSON.parse(params.roundHistory || '[]');
    } catch (error) {
      return [];
    }
  }, [params.roundHistory]);

  const totalRounds = Number(params.totalRounds || 15);

  const ranking = useMemo(() => {
    const sorted = players
        .map((name, index) => ({
            name,
            score: totalScores[index] ?? 0,
        }))
    .sort((a, b) => a.score - b.score);

    return addRankToList(sorted);
    }, [players, totalScores]);

  const winner = ranking[0];

  useEffect(() => {
    const saveResult = async () => {
      if (hasSavedRef.current) return;
      if (players.length === 0 || totalScores.length === 0) return;

      const gameRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('ko-KR'),
        totalRounds,
        winner: winner?.name ?? '',
        winnerScore: winner?.score ?? 0,
        ranking,
        players,
        totalScores,
        roundHistory,
      };

      await saveGameHistory(gameRecord);
      hasSavedRef.current = true;
    };

    saveResult();
   }, [players, totalScores, totalRounds, winner, ranking, roundHistory]);

  const getRoundScoreLabel = (score) => {
    if (score.bagaji === 30) {
      return `${score.finalScore}(뻥바가지!)`;
    }

    if (score.bagaji === 50) {
      return `${score.finalScore}(스톱바가지!)`;
    }

    return `${score.finalScore}`;
  };

  const getRoundDisplayRows = (round) => {
    return round.scores.map((score) => {
      const previousTotal = roundHistory
        .filter((item) => item.roundNumber < round.roundNumber)
        .reduce((sum, prevRound) => {
          const matched = prevRound.scores.find(
            (prevScore) => prevScore.playerName === score.playerName
          );
          return sum + (matched ? matched.finalScore : 0);
        }, 0);

      const currentLabel = getRoundScoreLabel(score);

      if (round.roundNumber === 1) {
        return {
          playerName: score.playerName,
          displayText: currentLabel,
        };
      }

      const nextTotal = previousTotal + score.finalScore;

      return {
        playerName: score.playerName,
        displayText: `${previousTotal} + ${currentLabel} = ${nextTotal}`,
      };
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>게임 결과</Text>
      <Text style={styles.subtitle}>총 {totalRounds}판 완료</Text>

      {winner && (
        <View style={styles.winnerCard}>
          <Text style={styles.winnerLabel}>최종 1등</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerScore}>{winner.score}점</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최종 순위</Text>
        {ranking.map((item, index) => (
          <View key={item.name + index} style={styles.rankRow}>
            <Text style={styles.rankText}>
              {getRankLabel(item)} {item.name}
            </Text>
            <Text style={styles.rankText}>{item.score}점</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowRoundHistory((prev) => !prev)}
      >
        <Text style={styles.toggleButtonText}>
          {showRoundHistory ? '판별 기록 숨기기' : '판별 기록 보기'}
        </Text>
      </TouchableOpacity>

      {showRoundHistory && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>판별 기록</Text>

          {roundHistory.map((round) => {
            const rows = getRoundDisplayRows(round);

            return (
              <View key={round.roundNumber} style={styles.roundCard}>
                <Text style={styles.roundTitle}>{round.roundNumber}판</Text>

                {rows.map((row, index) => (
                  <View key={row.playerName + index} style={styles.scoreRow}>
                    <Text style={styles.playerText}>{row.playerName}</Text>
                    <Text style={styles.scoreText}>{row.displayText}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity
        style={styles.restartButton}
        onPress={() => router.replace('/(tabs)/')}
      >
        <Text style={styles.restartButtonText}>새 게임 시작</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 17,
    color: '#666',
  },
  winnerCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  winnerLabel: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
  },
  winnerScore: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 12,
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rankText: {
    fontSize: 16,
    color: '#222',
  },
  toggleButton: {
    marginTop: 24,
    backgroundColor: '#efefef',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  roundCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ececec',
    backgroundColor: '#fafafa',
    marginBottom: 12,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  playerText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    minWidth: 60,
  },
  scoreText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
    textAlign: 'right',
  },
  restartButton: {
    marginTop: 30,
    backgroundColor: '#222',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});