import { useState, useEffect } from 'react';
import { View, Text, TextInput } from 'react-native';

type Props = {
  label: string;
  fieldKey: string;
  initialValue: string;
  onSave: (key: string, value: string) => void;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
};

const Field = ({ label, fieldKey, initialValue, onSave, keyboardType = 'default' }: Props) => {
  const [valor, setValor] = useState(initialValue || '');

  useEffect(() => {
    setValor(initialValue || '');
  }, [initialValue]);

  return (
    <View className="mb-4">
      <Text className="mb-1 font-JakartaMedium text-base text-gray-700">{label}</Text>
      <TextInput
        value={valor}
        onChangeText={setValor}
        onBlur={() => onSave(fieldKey, valor)}
        keyboardType={keyboardType}
        placeholder={`Ingresa ${label.toLowerCase()}`}
        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800"
      />
    </View>
  );
};

export default Field;
