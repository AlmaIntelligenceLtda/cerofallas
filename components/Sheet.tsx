import React, { forwardRef } from 'react';
import { Modal, View, StyleSheet, Platform, ScrollView } from 'react-native';

type SheetProps = {
  visible: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  snapPoints?: (string | number)[];
};

const Sheet = forwardRef<any, SheetProps>(({ visible, onClose, children, snapPoints }, ref) => {
  // Intentar usar @gorhom/bottom-sheet si está disponible y React Native Reanimated está inicializado
  try {
    // Verificar que Reanimated esté disponible y tenga las APIs de worklets
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Reanimated = require('react-native-reanimated');
    if (!Reanimated || typeof Reanimated.useWorkletCallback !== 'function') {
      throw new Error('reanimated-mismatch');
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const BottomSheet = require('@gorhom/bottom-sheet').default;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const BottomSheetScrollView = require('@gorhom/bottom-sheet').BottomSheetScrollView;
    // Si llegamos acá, renderizamos el BottomSheet nativo
    return (
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints ?? ['50%']}
        enablePanDownToClose
        onClose={onClose}>
        <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  } catch (e) {
    // Si falla la importación o inicialización (e.g., mismatch worklets), usar fallback con Modal
    return (
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={styles.backdrop}>
          <View style={styles.sheetContainer}>
            <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    maxHeight: Platform.OS === 'ios' ? '70%' : '75%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  content: {
    padding: 16,
  },
});

export default Sheet;
