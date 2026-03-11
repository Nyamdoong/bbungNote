import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getRankLabel } from '../utils/ranking';

export default function HistoryDetailScreen() {
  const params = useLocalSearchParams();

  const game = useMemo(() => {
    try {
      return JSON.parse(params.game || '{}');
    } catch {
      return {};
    }
  }, [params.game]);

  const winner = game?.ranking?.[0];

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
    const roundHistory = game.roundHistory || [];

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

  if (!game.players || !game.ranking || !game.roundHistory) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>기록을 불러올 수 없어요.</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>게임 기록 상세</Text>

      <Text style={styles.date}>{game.date}</Text>
      <Text style={styles.subtitle}>총 {game.totalRounds}판</Text>

      {winner && (
        <View style={styles.winnerCard}>
          <Text style={styles.winnerLabel}>최종 1등</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerScore}>{winner.score}점</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최종 순위</Text>

        {game.ranking.map((item, index) => (
          <View key={item.name + index} style={styles.rankRow}>
            <Text style={styles.rankText}>
              {getRankLabel(item)} {item.name}
            </Text>
            <Text style={styles.rankText}>{item.score}점</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>판별 기록</Text>

        {game.roundHistory.map((round) => {
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

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>뒤로가기</Text>
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
  errorContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    color: '#111',
  },
  date: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#444',
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
    color: '#111',
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
  backButton: {
    marginTop: 30,
    backgroundColor: '#222',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});