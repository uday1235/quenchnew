import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface Props {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
}

export default function StarRating({ value, size = 16, interactive = false, onChange }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <TouchableOpacity key={star} onPress={() => onChange?.(star)}>
            <Ionicons
              name={star <= value ? 'star' : 'star-outline'}
              size={size}
              color={star <= value ? colors.amber : colors.slate200}
            />
          </TouchableOpacity>
        ) : (
          <Ionicons
            key={star}
            name={star <= value ? 'star' : 'star-outline'}
            size={size}
            color={star <= value ? colors.amber : colors.slate200}
          />
        )
      )}
    </View>
  );
}
