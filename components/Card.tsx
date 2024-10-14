import { Shadows } from "@/constants/Shadows"
import { useThemeColors } from "@/hooks/useThemeColors"
import { useTheme } from "@react-navigation/native"
import { View, ViewProps, ViewStyle } from "react-native"

type Props = ViewProps


export function Card ({style, ...rest}: Props) {

    const colors = useThemeColors()

    return <View style={[style, styles, {backgroundColor: colors.grayWhite}]} {...rest}  />

}

const styles = {
    borderRadius: 8,
    backgroundColor: "white",
    ...Shadows.dp2
} satisfies ViewStyle