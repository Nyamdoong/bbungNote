import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RulesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>나이롱뻥 룰</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기본 진행 방식</Text>
        <Text style={styles.body}>
          나이롱뻥은 5장의 화투패를 가지고 시작합니다. 자기 차례가 오면 더미에서 1장을 가져와
          6장을 만든 뒤 족보를 확인하고, 족보가 안 되면 1장을 버려 다시 5장을 유지합니다.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>점수 목표</Text>
        <Text style={styles.body}>
          점수는 낮을수록 좋고, 마이너스 점수가 가장 유리합니다. 보통 15판을 진행한 뒤 총점이
          가장 낮은 사람이 1등입니다.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>마이너스 점수</Text>
        <Text style={styles.body}>
          -100, 또는 6장 연속 족보일 때 해당 패의 합을 마이너스 점수로 가져갑니다.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>0점 족보</Text>
        <Text style={styles.body}>
          2장+2장+2장, 또는 3장+3장 조합은 0점으로 처리합니다.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>자동뻥 / 무효</Text>
        <Text style={styles.body}>
          5장 중 3장이 같은 패면 그 3장은 무효입니다. 예를 들어 1,1,4,4,4는 2점으로 계산합니다.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>스톱 규칙</Text>
        <Text style={styles.body}>
          손패 합이 3 이하일 때 스톱할 수 있습니다. 스톱 시 그 시점에서 게임이 끝나고 각자 가진
          패의 합으로 점수를 계산합니다.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>바가지</Text>
        <Text style={styles.body}>
          30 바가지와 50 바가지가 있습니다. 점수 입력 후 해당 상황일 때만 버튼으로 추가합니다.
        </Text>
      </View>
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
    color: '#111',
    marginTop: 20,
  },
  section: {
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ececec',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },
  body: {
    fontSize: 15,
    color: '#333',
    lineHeight: 23,
  },
});