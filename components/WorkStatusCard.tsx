import { View, Text, Image } from "react-native";
import { ReactNode } from "react";

type Props = {
    title: string;
    description: string;
    children?: ReactNode;
};

const WorkStatusCard = ({ title, description, children }: Props) => (
    <View className="bg-white rounded-2xl shadow-md p-5 mt-6">
        <Text className="text-xl font-JakartaBold mb-1">{title}</Text>
        <Text className="text-sm text-gray-500 mb-3">{description}</Text>
        {children}
    </View>
);

export default WorkStatusCard;
