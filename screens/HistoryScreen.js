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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>히스토리</Text>

        {history.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setShowDeleteAllModal(true)}
          >
            <Text style={styles.clearButtonText}>기록 전체 삭제</Text>
          </TouchableOpacity>
        )}

        {history.length === 0 ? (
          <Text style={styles.emptyText}>아직 저장된 게임 기록이 없어요.</Text>
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
                >
                    <Text style={styles.deleteOneButtonText}>삭제</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.mainText}>총 {game.totalRounds}판</Text>
            <Text style={styles.mainText}>
                1등 {game.winner} ({game.winnerScore}점)
            </Text>

            <View style={styles.rankingBox}>
                {game.ranking.map((item, index) => (
                    <View key={item.name + index} style={styles.rankRow}>
                        <Text style={styles.rankText}>
                            {getRankLabel(item)} {item.name}
                        </Text>
                        <Text style={styles.rankText}>{item.score}점</Text>
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
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 20,
    color: '#111',
  },
  clearButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ececec',
    backgroundColor: '#fafafa',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    color: '#777',
    marginBottom: 10,
    flex: 1,
  },
  deleteOneButton: {
    marginLeft: 12,
    backgroundColor: '#efefef',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  deleteOneButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  mainText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
  },
  rankingBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rankText: {
    fontSize: 15,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  modalMessage: {
    marginTop: 10,
    fontSize: 15,
    color: '#555',
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
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#efefef',
  },
  deleteButton: {
    backgroundColor: '#222',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});