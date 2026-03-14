import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { getSettings, saveSettings } from '../storage/storage';

export default function SettingsScreen() {
  const [defaultRounds, setDefaultRounds] = useState('15');
  const [stopThreshold, setStopThreshold] = useState('3');
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const settings = await getSettings();

      setDefaultRounds(String(settings.defaultRounds ?? 15));
      setStopThreshold(String(settings.stopThreshold ?? 3));
    } catch (error) {
      console.error('설정 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    Keyboard.dismiss();

    const roundsNumber = parseInt(defaultRounds, 10);
    const stopNumber = parseInt(stopThreshold, 10);

    if (isNaN(roundsNumber) || roundsNumber <= 0) {
      Alert.alert('입력 확인', '기본 판 수는 1 이상의 숫자로 입력해주세요.');
      return;
    }

    if (isNaN(stopNumber) || stopNumber < 0) {
      Alert.alert('입력 확인', '스톱 기준값은 0 이상의 숫자로 입력해주세요.');
      return;
    }

    try {
      await saveSettings({
        defaultRounds: roundsNumber,
        stopThreshold: stopNumber,
      });

      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      Alert.alert('오류', '설정 저장 중 문제가 발생했어요.');
    }
  }

  async function handleReset() {
    Keyboard.dismiss();

    try {
      await saveSettings({
        defaultRounds: 15,
        stopThreshold: 3,
      });

      setDefaultRounds('15');
      setStopThreshold('3');
      setSaveSuccess(false);

      Alert.alert('초기화 완료', '기본 설정으로 되돌렸어요.');
    } catch (error) {
      console.error('설정 초기화 실패:', error);
      Alert.alert('오류', '초기화 중 문제가 발생했어요.');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.topCard}>
          <Text style={styles.title}>⚙️ 설정</Text>
          <Text style={styles.subtitle}>
            게임 시작 화면과 같은 기준값을 여기서 관리할 수 있어요
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.inputRow}>
            <View style={styles.inputLabelBox}>
              <Text style={styles.label}>기본 판 수</Text>
              <Text style={styles.helper}>새 게임 시작 시 기본으로 들어갈 판 수</Text>
            </View>

            <TextInput
              style={styles.input}
              value={defaultRounds}
              onChangeText={(text) => {
                setDefaultRounds(text);
                setSaveSuccess(false);
              }}
              keyboardType="number-pad"
              placeholder="15"
              placeholderTextColor="#B7A7A2"
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.inputRow}>
            <View style={styles.inputLabelBox}>
              <Text style={styles.label}>스톱 기준값</Text>
              <Text style={styles.helper}>이 값 이하일 때 스톱 처리 기준으로 사용</Text>
            </View>

            <TextInput
              style={styles.input}
              value={stopThreshold}
              onChangeText={(text) => {
                setStopThreshold(text);
                setSaveSuccess(false);
              }}
              keyboardType="number-pad"
              placeholder="3"
              placeholderTextColor="#B7A7A2"
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={true}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>큰 글씨 모드</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>준비 중</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>앱 정보</Text>
            <Text style={styles.value}>뻥노트 MVP</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.resetButtonPressed,
            ]}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>기본값으로 초기화</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              saveSuccess && styles.saveButtonSuccess,
              pressed && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {saveSuccess ? '저장됨 ✓' : '저장하기'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ 안내</Text>
          <Text style={styles.infoText}>
            여기서 저장한 값은 게임 시작 화면의 기본값과 연결됩니다.
          </Text>
          <Text style={styles.infoText}>
            즉, 설정에서 20판 / 스톱 기준 5로 저장하면 다음 게임 시작 시 그 값이
            자동으로 들어가게 됩니다.
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F3',
    padding: 18,
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
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },

  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },

  inputLabelBox: {
    flex: 1,
    paddingRight: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2A211F',
  },

  helper: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#8B7A74',
    lineHeight: 18,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },

  input: {
    minWidth: 74,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8D5D0',
    backgroundColor: '#FFFDFC',
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    textAlign: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: '#F3ECE9',
  },

  badge: {
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#F1C9C1',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B33A30',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  resetButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7C7C0',
    backgroundColor: '#FFF4F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  resetButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B33A30',
  },

  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E53935',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  saveButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },

  saveButtonSuccess: {
    backgroundColor: '#2E7D32',
    shadowColor: '#2E7D32',
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  infoCard: {
    marginTop: 16,
    backgroundColor: '#FFF1EE',
    borderWidth: 1,
    borderColor: '#F1C9C1',
    borderRadius: 18,
    padding: 16,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#B33A30',
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A4A42',
    lineHeight: 22,
    marginBottom: 4,
  },
});