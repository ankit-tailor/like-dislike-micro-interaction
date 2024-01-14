import React, { useEffect } from "react";
import { AnimatedPressable } from "./animated-components";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { PressableProps, StyleSheet, View, ViewProps } from "react-native";

const AnimatedRings = ({
  style,
  delay,
  isLastIndex,
  setShowRingsState,
}: {
  style: ViewProps["style"];
  delay: number;
  isLastIndex: boolean;
  setShowRingsState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const ring = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - ring.value,
      transform: [
        {
          scale: interpolate(ring.value, [0, 1], [0, 3]),
        },
      ],
    };
  });

  useEffect(() => {
    ring.value = withDelay(
      delay,
      withRepeat(
        withTiming(
          1,
          {
            duration: 900,
          },
          () => {
            if (isLastIndex) {
              runOnJS(setShowRingsState)(false);
            }
          }
        ),
        -1,
        false
      )
    );
  }, []);

  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          zIndex: -1,
          borderRadius: 999,
          padding: 8,
        },
        style,
        ringStyle,
      ]}
    />
  );
};

export const AnimatedButton = ({
  children,
  style,
  onPressIn,
  onPressOut,
  ringStyle: ringStyleProp,
  ...props
}: PressableProps & {
  ringStyle?: ViewProps["style"];
}) => {
  const ringsArr = new Array(2).fill(0);
  const pressed = useSharedValue(false);
  const isAction = useSharedValue(false);

  const [showRingsState, setShowRingsState] = React.useState(false);

  const handlePressIn = () => {
    pressed.value = true;
  };

  const handlePressOut = () => {
    pressed.value = false;
    isAction.value = !isAction.value;
    if (!isAction.value) {
      setShowRingsState(true);
    }
  };

  const pressableStyles = Array.isArray(style)
    ? [styles.button, ...style]
    : [styles.button, style];

  return (
    <View>
      {showRingsState
        ? ringsArr.map((_: number, index: number) => {
            return (
              <AnimatedRings
                style={ringStyleProp}
                delay={index * 300}
                isLastIndex={ringsArr.length - 1 === index}
                key={index}
                setShowRingsState={setShowRingsState}
              />
            );
          })
        : null}
      <AnimatedPressable
        style={pressableStyles}
        onPressIn={(e) => {
          handlePressIn();
          onPressIn && onPressIn(e);
        }}
        onPressOut={(e) => {
          handlePressOut();
          onPressOut && onPressOut(e);
        }}
        {...props}
      >
        {children}
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    padding: 8,
    backgroundColor: "#E9ECF1",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
