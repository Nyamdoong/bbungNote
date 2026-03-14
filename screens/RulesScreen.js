import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const HAS_HWATU_IMAGE = true;

export default function RulesScreen() {
  const [showHwatuGuide, setShowHwatuGuide] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topCard}>
        <Text style={styles.title}>📘 룰 가이드</Text>
        <Text style={styles.subtitle}>
          처음 보는 사람도 한 번에 이해할 수 있게 정리했어요
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🎴 한 눈에 보기</Text>

        <View style={styles.bulletBox}>
          <Text style={styles.bullet}>• 총 판 수만큼 게임을 진행해요</Text>
          <Text style={styles.bullet}>• 각 판마다 손패 점수를 기록해요</Text>
          <Text style={styles.bullet}>
            • 손패 합이 스톱 기준값 이하이면 스톱할 수 있어요
          </Text>
          <Text style={styles.bullet}>• 바가지가 나오면 추가 점수가 붙어요</Text>
          <Text style={styles.bullet}>
            • 마지막엔 누적 점수를 기준으로 결과를 확인해요
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📜 룰 / 점수 설명</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>1. 게임 진행</Text>
          <Text style={styles.infoText}>
            플레이어를 정한 뒤 판별로 점수를 입력합니다. 각 판이 끝날 때마다
            점수가 누적되고, 설정한 총 판 수까지 진행하면 최종 결과를 볼 수
            있어요.
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>2. 스톱</Text>
          <Text style={styles.infoText}>
            손패 합이 설정한 스톱 기준값 이하일 때 스톱할 수 있습니다. 이 값은
            설정 탭에서 기본값을 바꿀 수 있어요.
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>3. 바가지</Text>
          <Text style={styles.infoText}>
            특정 상황에서 바가지 점수가 추가될 수 있어요. 앱에서는 점수 입력을
            더 쉽게 하기 위해 바가지 버튼으로 빠르게 반영할 수 있습니다.
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>4. 최종 결과</Text>
          <Text style={styles.infoText}>
            모든 판이 끝나면 누적 점수를 기준으로 결과를 확인합니다. 가족이나
            친구들과 빠르게 기록하고 비교하기 쉽게 만든 화면이에요.
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Pressable
          style={({ pressed }) => [
            styles.foldHeader,
            pressed && styles.foldHeaderPressed,
          ]}
          onPress={() => setShowHwatuGuide((prev) => !prev)}
        >
          <View style={styles.foldHeaderTextBox}>
            <Text style={styles.sectionTitle}>🗓 화투 12월별 정리</Text>
            <Text style={styles.foldSubText}>
              헷갈릴 때 펼쳐서 바로 확인할 수 있어요
            </Text>
          </View>

          <Text style={styles.foldIcon}>{showHwatuGuide ? '▴' : '▾'}</Text>
        </Pressable>

        {showHwatuGuide && (
          <View style={styles.foldContent}>
            {HAS_HWATU_IMAGE ? (
              <Image
                source={require('../assets/hwatu-guide.png')}
                style={styles.hwatuImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.hwatuPlaceholder}>
                <Text style={styles.hwatuPlaceholderText}>
                  화투 가이드 이미지를 준비 중이에요
                </Text>
              </View>
            )}

            <View style={styles.monthGrid}>
              <View style={styles.monthRow}>
                <Text style={styles.monthText}>1월 — 송학</Text>
                <Text style={styles.monthText}>2월 — 매화</Text>
              </View>
              <View style={styles.monthRow}>
                <Text style={styles.monthText}>3월 — 벚꽃</Text>
                <Text style={styles.monthText}>4월 — 등나무</Text>
              </View>
              <View style={styles.monthRow}>
                <Text style={styles.monthText}>5월 — 난초</Text>
                <Text style={styles.monthText}>6월 — 모란</Text>
              </View>
              <View style={styles.monthRow}>
                <Text style={styles.monthText}>7월 — 싸리</Text>
                <Text style={styles.monthText}>8월 — 억새</Text>
              </View>
              <View style={styles.monthRow}>
                <Text style={styles.monthText}>9월 — 국화</Text>
                <Text style={styles.monthText}>10월 — 단풍</Text>
              </View>
              <View style={styles.monthRow}>
                <Text style={styles.monthText}>11월 — 오동</Text>
                <Text style={styles.monthText}>12월 — 비</Text>
              </View>
            </View>

            <View style={styles.guideNote}>
              <Text style={styles.guideNoteTitle}>💡 한 번에 보기 팁</Text>
              <Text style={styles.guideNoteText}>
                처음엔 월 이름만 익혀도 충분해요. 게임을 몇 번 하다 보면 카드
                그림이랑 같이 자연스럽게 익숙해집니다.
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 40,
    backgroundColor: '#FFF7F3',
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
    fontWeight: '700',
    color: '#1F1A18',
  },

  bulletBox: {
    marginTop: 12,
    gap: 8,
  },

  bullet: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4A3E3A',
    lineHeight: 22,
  },

  infoBlock: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFF9F7',
    borderWidth: 1,
    borderColor: '#F3E3DE',
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2A211F',
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A5A55',
    lineHeight: 22,
  },

  foldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  foldHeaderPressed: {
    opacity: 0.8,
  },

  foldHeaderTextBox: {
    flex: 1,
    paddingRight: 12,
  },

  foldSubText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#8B7A73',
    lineHeight: 18,
  },

  foldIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#B33A30',
  },

  foldContent: {
    marginTop: 14,
  },

  hwatuImage: {
    width: '100%',
    height: 420,
    borderRadius: 16,
    backgroundColor: '#FFFDFC',
  },

  hwatuPlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: '#FFF4F1',
    borderWidth: 1,
    borderColor: '#F1D4CC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  hwatuPlaceholderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B5E55',
    textAlign: 'center',
    lineHeight: 22,
  },

  monthGrid: {
    marginTop: 14,
    gap: 8,
  },

  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  monthText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#3E322E',
    backgroundColor: '#FFF4F1',
    borderWidth: 1,
    borderColor: '#F1D4CC',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  guideNote: {
    marginTop: 14,
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#F1C9C1',
    borderRadius: 16,
    padding: 14,
  },

  guideNoteTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B33A30',
    marginBottom: 6,
  },

  guideNoteText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A4A42',
    lineHeight: 22,
  },
});