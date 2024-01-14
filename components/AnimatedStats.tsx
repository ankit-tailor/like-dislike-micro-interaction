import React from "react";
import { View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const AnimatedStats = ({
  prevStats,
  currentStats,
}: {
  prevStats: number;
  currentStats: number;
}) => {
  const skipInitialAnimation = useSharedValue(true);

  React.useEffect(() => {
    skipInitialAnimation.value = false;
  }, []);

  const slideUp = (values: any) => {
    "worklet";
    const animations = {
      originY: withTiming(values.targetOriginY, {
        duration: 400,
      }),
    };
    const initialValues = {
      originY: values.targetOriginX + 5,
    };
    return {
      initialValues,
      animations,
    };
  };
  const slideDown = (values: any) => {
    "worklet";
    const animations = {
      originY: withTiming(values.targetOriginY, {
        duration: 400,
      }),
    };
    const initialValues = {
      originY: values.targetOriginX - 40,
    };
    return {
      initialValues,
      animations,
    };
  };

  const getEnteringAnimation = () => {
    if (!skipInitialAnimation.value) {
      return prevStats < currentStats ? slideUp : slideDown;
    }
  };

  return (
    <View style={{ flexDirection: "row", overflow: "hidden" }}>
      {currentStats
        .toString()
        .split("")
        .map((ele, ind) => {
          return (
            <Animated.Text
              style={{
                fontWeight: "bold",
                color: "#91AAC1",
                fontSize: 16,
              }}
              key={ele + ind}
              entering={getEnteringAnimation()}
            >
              {ele}
            </Animated.Text>
          );
        })}
    </View>
  );
};

export default AnimatedStats;
