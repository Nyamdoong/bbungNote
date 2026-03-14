import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  clearGameHistory,
  deleteGameHistoryById,
  getGameHistory,
} from '../storage/storage';
import { getRankLabel } from '../utils/ranking';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);

  const loadHistory = async () => {
    const data = await getGameHistory();
    setHistory(data);
  };

  const handleClearAllHistory = async () => {
    await clearGameHistory();
    setHistory([]);
    setShowDeleteAllModal(false);
  };

  const handleDeleteSingleHistory = async () => {
    if (!selectedGameId) return;

    await deleteGameHistoryById(selectedGameId);
    setHistory((prev) => prev.filter((game) => game.id !== selectedGameId));
    setSelectedGameId(null);
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topCard}>
          <Text style={styles.title}>🎴 히스토리</Text>
          <Text style={styles.subtitle}>이전 게임 기록을 모아볼 수 있어요</Text>
        </View>

        {history.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setShowDeleteAllModal(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.clearButtonText}>기록 전체 삭제</Text>
          </TouchableOpacity>
        )}

        {history.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🗂️</Text>
            <Text style={styles.emptyTitle}>아직 저장된 기록이 없어요</Text>
            <Text style={styles.emptyText}>
              게임이 끝나면 결과가 여기에 차곡차곡 저장돼요
            </Text>
          </View>
        ) : (
          history.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: '/historyDetail',
                  params: {
                    game: JSON.stringify(game),
                  },
                })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.date}>{game.date}</Text>

                <TouchableOpacity
                  style={styles.deleteOneButton}
                  onPress={(e) => {
                    e.stopPropagation?.();
                    setSelectedGameId(game.id);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.deleteOneButtonText}>삭제</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.summaryRow}>
                <View style={styles.summaryBadge}>
                  <Text style={styles.summaryBadgeText}>{game.totalRounds}판</Text>
                </View>
                <View style={styles.winnerBadge}>
                  <Text style={styles.winnerBadgeText}>🏆 1등 {game.winner}</Text>
                </View>
              </View>

              <Text style={styles.mainText}>
                가장 낮은 점수: {game.winnerScore}점
              </Text>

              <View style={styles.rankingBox}>
                {game.ranking.map((item, index) => (
                  <View key={item.name + index} style={styles.rankRow}>
                    <Text style={[styles.rankText, index === 0 && styles.firstRankText]}>
                      {getRankLabel(item)} {item.name}
                    </Text>
                    <Text
                      style={[styles.rankScoreText, index === 0 && styles.firstRankText]}
                    >
                      {item.score}점
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showDeleteAllModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteAllModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>기록 전체 삭제</Text>
            <Text style={styles.modalMessage}>
              저장된 게임 기록을 모두 삭제할까요?
            </Text>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteAllModal(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleClearAllHistory}
              >
                <Text style={styles.deleteButtonText}>전체 삭제</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!selectedGameId}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedGameId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>기록 선택 삭제</Text>
            <Text style={styles.modalMessage}>
              이 게임 기록만 삭제할까요?
            </Text>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setSelectedGameId(null)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteSingleHistory}
              >
                <Text style={styles.deleteButtonText}>삭제</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 40,
    backgroundColor: '#FFF7F3',
    flexGrow: 1,
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
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#7A6B66',
    lineHeight: 22,
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginTop: 16,
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#F1C9C1',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  clearButtonText: {
    color: '#B33A30',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCard: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0DEDA',
    borderRadius: 20,
    paddingVertical: 34,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  emptyEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F1A18',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#8B7A73',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    borderWidth: 1,
    borderColor: '#F0DEDA',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8B7A73',
    flex: 1,
    marginRight: 12,
  },
  deleteOneButton: {
    backgroundColor: '#F7EEEB',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  deleteOneButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6A5B56',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  summaryBadge: {
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#F1C9C1',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  summaryBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B33A30',
  },
  winnerBadge: {
    backgroundColor: '#FFF6EC',
    borderWidth: 1,
    borderColor: '#EDC98D',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  winnerBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A5318',
  },
  mainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A211F',
    marginTop: 12,
  },
  rankingBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3ECE9',
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rankText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3A312E',
  },
  rankScoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3A312E',
  },
  firstRankText: {
    color: '#D93A2F',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 17, 17, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFDFC',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0DEDA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  modalMessage: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '500',
    color: '#5C514D',
    lineHeight: 22,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F7EEEB',
  },
  deleteButton: {
    backgroundColor: '#D93A2F',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#463C39',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});