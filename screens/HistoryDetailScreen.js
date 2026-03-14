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
        <View style={styles.errorCard}>
          <Text style={styles.errorEmoji}>📂</Text>
          <Text style={styles.errorTitle}>기록을 불러올 수 없어요</Text>
          <Text style={styles.errorText}>
            저장된 게임 정보를 다시 확인한 뒤 돌아가주세요
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.backButtonText}>뒤로가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topCard}>
        <Text style={styles.title}>🎴 게임 기록 상세</Text>
        <Text style={styles.date}>{game.date}</Text>
        <Text style={styles.subtitle}>총 {game.totalRounds}판</Text>
      </View>

      {winner && (
        <View style={styles.winnerCard}>
          <Text style={styles.winnerLabel}>최종 1등</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerScore}>{winner.score}점</Text>

          <View style={styles.winnerBadge}>
            <Text style={styles.winnerBadgeText}>🏆 가장 낮은 점수로 승리!</Text>
          </View>
        </View>
      )}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>최종 순위</Text>

        {game.ranking.map((item, index) => (
          <View key={item.name + index} style={styles.rankRow}>
            <View style={styles.rankLeft}>
              <Text style={styles.rankIcon}>
                {index === 0 ? '🏆' : `${index + 1}️⃣`}
              </Text>
              <Text style={[styles.rankText, index === 0 && styles.firstRankText]}>
                {getRankLabel(item)} {item.name}
              </Text>
            </View>

            <Text style={[styles.rankScore, index === 0 && styles.firstRankText]}>
              {item.score}점
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
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
        activeOpacity={0.85}
      >
        <Text style={styles.backButtonText}>뒤로가기</Text>
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
  errorContainer: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
    backgroundColor: '#FFF7F3',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0DEDA',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  errorEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#7A6B66',
    textAlign: 'center',
    lineHeight: 22,
  },
  topCard: {
    marginTop: 8,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: '#F1DDD7',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
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
  },
  date: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#8B7A73',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '500',
    color: '#5C514D',
  },
  winnerCard: {
    marginTop: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0DEDA',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  winnerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B7A73',
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },
  winnerScore: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '600',
    color: '#D93A2F',
  },
  winnerBadge: {
    marginTop: 14,
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#F1C9C1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  winnerBadgeText: {
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
    marginBottom: 12,
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
    flexShrink: 1,
  },
  rankIcon: {
    width: 28,
    fontSize: 15,
    color: '#A08B84',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2A211F',
  },
  rankScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A211F',
  },
  firstRankText: {
    color: '#D93A2F',
    fontWeight: '700',
  },
  roundCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1E2DD',
    backgroundColor: '#FFFCFB',
    marginBottom: 12,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111111',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 7,
    gap: 12,
  },
  playerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2A211F',
    minWidth: 60,
  },
  scoreText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#5C514D',
    textAlign: 'right',
    lineHeight: 22,
  },
  backButton: {
    marginTop: 24,
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
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});