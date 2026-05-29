import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface Props {
  label: string;
  active?: boolean;
  onPress: () => void;
}

export default function CategoryChip({ label, active, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.active]}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.slate200,
    backgroundColor: colors.white,
  },
  active: { backgroundColor: colors.brand, borderColor: colors.brand },
  label: { fontSize: 12, fontWeight: '700', color: colors.slate700 },
  activeLabel: { color: colors.white },
});
