import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>
      <Text style={styles.item}>기본 판 수: 15</Text>
      <Text style={styles.item}>스톱 기준값: 3</Text>
      <Text style={styles.item}>큰 글씨 모드: 준비 중</Text>
      <Text style={styles.item}>기록 초기화: 준비 중</Text>
      <Text style={styles.item}>앱 정보: 뻥노트 MVP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 24,
  },
  item: {
    fontSize: 17,
    color: '#222',
    marginBottom: 16,
  },
});