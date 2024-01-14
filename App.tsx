import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LikeIcon } from "./components/LikeIcon";
import { AnimatedButton, AnimatedPressable, DislikeIcon } from "./components";
import { useState } from "react";
import AnimatedStats from "./components/AnimatedStats";

const TRACK_WIDTH = 170;
const TRACK_SEPRATOR_WIDTH = 3;
const TRACK_HEIGHT = 10;

const SPRING_CONFIG = {
  duration: 700,
  dampingRatio: 0.4,
  stiffness: 300,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const ROTATE_SPRING_CONFIG = {
  damping: 40,
  stiffness: 100,
  mass: 1.2,
};

export default function App() {
  const isLiked = useSharedValue(false);
  const likePressed = useSharedValue(false);

  const isDisliked = useSharedValue(false);
  const dislikePressed = useSharedValue(false);

  const [likes, setLikes] = useState({ prev: 255, current: 255 });

  const [dislikes, setDislikes] = useState({ prev: 44, current: 44 });

  const onTrackWidth = useSharedValue(100);

  const animateActionButtons = (
    sharedValue: Animated.SharedValue<boolean>,
    isAction: Animated.SharedValue<boolean>,
    extra: Object
  ) => {
    "worklet";
    return {
      transform: [
        {
          scale: withDelay(
            0,
            withSpring(sharedValue.value ? 0.5 : 1, SPRING_CONFIG)
          ),
        },
        {
          rotate: withDelay(
            0,
            withSpring(isAction.value ? "360deg" : "0deg", ROTATE_SPRING_CONFIG)
          ),
        },
      ],
      ...extra,
    };
  };

  const likeIconProps = useAnimatedProps(() => {
    return {
      color: withTiming(isLiked.value ? "#fff" : "#91AAC1"),
    };
  });
  const dislikeIconProps = useAnimatedProps(() => {
    return {
      color: withTiming(isDisliked.value ? "#fff" : "#91AAC1"),
    };
  });

  const likeButtonAnimatedStyle = useAnimatedStyle(() =>
    animateActionButtons(likePressed, isLiked, {
      backgroundColor: isLiked.value ? "#89C16C" : "#E9ECF1",
    })
  );

  const dislikeButtonAnimatedStyle = useAnimatedStyle(() =>
    animateActionButtons(dislikePressed, isDisliked, {
      backgroundColor: isDisliked.value ? "#526475" : "#E9ECF1",
    })
  );

  const onTrackWidthStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(onTrackWidth.value, SPRING_CONFIG),
    };
  });

  const offTrackWidthStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(TRACK_WIDTH - onTrackWidth.value, SPRING_CONFIG),
    };
  });

  const handleLike = () => {
    if (!isLiked.value) {
      onTrackWidth.value += 10;
      setLikes((prev) => ({ prev: prev.current, current: prev.current + 1 }));
    } else {
      onTrackWidth.value -= 10;
      setLikes((prev) => ({ prev: prev.current, current: prev.current - 1 }));
    }
    isLiked.value = !isLiked.value;
  };

  const handleDislike = () => {
    if (!isDisliked.value) {
      onTrackWidth.value -= 10;
      setDislikes((prev) => ({
        prev: prev.current,
        current: prev.current + 1,
      }));
    } else {
      onTrackWidth.value += 10;
      setDislikes((prev) => ({
        prev: prev.current,
        current: prev.current - 1,
      }));
    }
    isDisliked.value = !isDisliked.value;
  };

  const handlePressIn = (sharedValue: Animated.SharedValue<boolean>) => () => {
    sharedValue.value = true;
  };

  const handlePressOut = (sharedValue: Animated.SharedValue<boolean>) => () => {
    sharedValue.value = false;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.card}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <AnimatedButton
            onPressIn={handlePressIn(dislikePressed)}
            onPressOut={handlePressOut(dislikePressed)}
            onPress={handleDislike}
            style={dislikeButtonAnimatedStyle}
            ringStyle={{
              backgroundColor: "#52647580",
            }}
          >
            <DislikeIcon animatedProps={dislikeIconProps} />
          </AnimatedButton>
          <Animated.View
            style={[
              {
                backgroundColor: "#89C16C",
                height: TRACK_HEIGHT,
                marginLeft: 16,
                borderTopLeftRadius: 999,
                borderBottomLeftRadius: 999,
              },
              onTrackWidthStyle,
            ]}
          />
          <View
            style={{
              height: TRACK_HEIGHT,
              width: TRACK_SEPRATOR_WIDTH,
              backgroundColor: "transparent",
            }}
          />
          <Animated.View
            style={[
              {
                height: TRACK_HEIGHT,
                backgroundColor: "#526475",
                borderTopRightRadius: 999,
                borderBottomRightRadius: 999,
                marginRight: 16,
              },
              offTrackWidthStyle,
            ]}
          />
          <AnimatedButton
            onPressIn={handlePressIn(likePressed)}
            onPressOut={handlePressOut(likePressed)}
            onPress={handleLike}
            style={likeButtonAnimatedStyle}
            ringStyle={{
              backgroundColor: "#B8D7A7",
            }}
          >
            <LikeIcon animatedProps={likeIconProps} />
          </AnimatedButton>
        </View>
        <View style={styles.stats}>
          <AnimatedStats
            prevStats={dislikes.prev}
            currentStats={dislikes.current}
          />
          <AnimatedStats prevStats={likes.prev} currentStats={likes.current} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#89C16C",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "relative",
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 32,
    borderRadius: 16,
    shadowColor: "#262626",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 10,
    width: "90%",
    alignItems: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 8,
    width: "100%",
  },
});
