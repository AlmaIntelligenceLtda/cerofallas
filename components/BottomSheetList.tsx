import React, { useRef, useEffect } from "react";
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Platform,
} from "react-native";
import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface BottomSheetListProps<T> {
    title: string;
    data: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    onSelect: (item: T) => void;
    visible: boolean;
    onClose: () => void;
    snapPoints?: string[];
    scrollable?: boolean;
}

function BottomSheetList<T>({
    title,
    data,
    renderItem,
    onSelect,
    visible,
    onClose,
    snapPoints = ["50%", "90%"],
    scrollable = true,
}: BottomSheetListProps<T>) {
    const sheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
        if (visible) {
            sheetRef.current?.expand();
        } else {
            sheetRef.current?.close();
        }
    }, [visible]);

    const handleSelect = (item: T) => {
        onSelect(item);
        sheetRef.current?.close();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <BottomSheet
                    ref={sheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    onClose={onClose}
                >
                    <BottomSheetView style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                    </BottomSheetView>

                    {scrollable ? (
                        <BottomSheetScrollView
                            contentContainerStyle={styles.scrollView}
                            keyboardShouldPersistTaps="handled"
                        >
                            {data.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleSelect(item)}
                                    style={styles.item}
                                    activeOpacity={0.7}
                                >
                                    {renderItem(item, index)}
                                </TouchableOpacity>
                            ))}
                        </BottomSheetScrollView>
                    ) : (
                        <BottomSheetView style={styles.scrollView}>
                            {data.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleSelect(item)}
                                    style={styles.item}
                                    activeOpacity={0.7}
                                >
                                    {renderItem(item, index)}
                                </TouchableOpacity>
                            ))}
                        </BottomSheetView>
                    )}
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
    },
    scrollView: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === "ios" ? 40 : 20,
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
});

export default BottomSheetList;
