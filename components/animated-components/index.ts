import { Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Svg } from "react-native-svg";

export const AnimatedSvg = Animated.createAnimatedComponent(Svg);
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
