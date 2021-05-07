import React, { useState } from "react";
import { User } from "../data";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { undefinedToBoolean } from "../utils";
import { StandardText } from "./StandardText";

const ACTIVE_USER_BUBBLE_SIZE = 65;
const INACTIVE_USER_BUBBLE_SIZE = 45;
const ACTIVE_USER_ICON_SIZE = ACTIVE_USER_BUBBLE_SIZE - 27;
const INACTIVE_USER_ICON_SIZE = INACTIVE_USER_BUBBLE_SIZE - 20;
const ACTIVE_USER_NOTIFICATION_SIZE = ACTIVE_USER_BUBBLE_SIZE / 3;
const INACTIVE_USER_NOTIFICATION_SIZE = INACTIVE_USER_BUBBLE_SIZE / 3;

/**
 * alla användare, activeUser och ifall någon annan än activeUser som är viktig att klicka på
 */
type SwitcherProps = {
  users: User[];
  activeUser: string;
  userNotifications: Map<string, boolean>;
  onActiveUserSwitch: (userId: string) => void;
};

/**
 * Komponent för att visa och kunna byta snabbt mellan alla användare på samma enhet.
 *
 * onActiveUserSwith från cooking vem den nya user är.
 * state tar switcherprops. setstate updaterar
 * kommer in här och byter active user och updaterar bubble
 * om bubble är pressed skickar uppåt
 */
export const UserFastSwitcher = ({
  users,
  activeUser,
  userNotifications,
  onActiveUserSwitch,
}: SwitcherProps) => {
  const [currentActiveUser, setActiveUser] = useState(activeUser);

  return (
    <View style={styles.container}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserBubble
            user={item}
            isActiveUser={item.id == currentActiveUser}
            isNotified={
              undefinedToBoolean(userNotifications.get(item.id)) //undefinedToBoolean castar 'undefined' till 'false' (om användaren inte finns i userNotifications)
            }
            onBubblePress={(userId: string) => {
              onActiveUserSwitch(userId);
              setActiveUser(userId);
            }}
          />
        )}
      />
    </View>
  );
};

type UserBubbleProps = {
  user: User;
  isActiveUser: boolean;
  isNotified: boolean;
  onBubblePress: (userId: string) => void;
};
/**
 * tar fram varsin items icon. current user större och visar namn,
 * isnotified skall användas för att visa en indikator på att användaren har en notifikation
 */
const UserBubble = ({
  user,
  isActiveUser,
  isNotified,
  onBubblePress,
}: UserBubbleProps) => {
  return (
    <View
      style={
        isActiveUser
          ? styles.activeBubbleContainer
          : styles.inactiveBubbleContainer
      }
    >
      <Pressable onPress={() => onBubblePress(user.id)}>
        <View
          style={[
            isActiveUser
              ? styles.activeUserIconBubble
              : styles.inactiveUserIconBubble,
            { borderColor: user.color, backgroundColor: user.color },
          ]}
        >
          <Image
            style={[
              isActiveUser ? styles.activeUserIcon : styles.inactiveUserIcon,
            ]}
            source={user.icon}
          />
        </View>
        <View
          style={
            isActiveUser
              ? styles.activeUserNotificationContainer
              : styles.inactiveUserNotificationContainer
          }
        >
          <UserNotification
            isNotified={isNotified}
            isActiveUser={isActiveUser}
          />
        </View>
      </Pressable>

      <StandardText text={user.name} size={isActiveUser ? "SM" : "small"} />
    </View>
  );
};

type UserNotificationProps = {
  isNotified: boolean;
  isActiveUser: boolean;
};

/**
 * notisbricka för UserBubble, om isNotified är false returneras tom komponent
 */
const UserNotification = ({
  isNotified,
  isActiveUser,
}: UserNotificationProps) => {
  if (!isNotified) return <></>;
  return (
    <View
      style={
        isActiveUser
          ? styles.activeUserNotification
          : styles.inactiveUserNotification
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 7,
    marginTop: 7,
  },

  activeBubbleContainer: {
    width: ACTIVE_USER_BUBBLE_SIZE,
    marginLeft: 7,
  },
  inactiveBubbleContainer: {
    width: INACTIVE_USER_BUBBLE_SIZE,
    marginLeft: 7,
    overflow: "hidden",
  },
  activeUserIconBubble: {
    width: ACTIVE_USER_BUBBLE_SIZE,
    height: ACTIVE_USER_BUBBLE_SIZE,
    borderRadius: ACTIVE_USER_BUBBLE_SIZE / 2,
    overflow: "hidden",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveUserIconBubble: {
    width: INACTIVE_USER_BUBBLE_SIZE,
    height: INACTIVE_USER_BUBBLE_SIZE,
    borderRadius: INACTIVE_USER_BUBBLE_SIZE / 2,
    overflow: "hidden",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  activeUserIcon: {
    width: ACTIVE_USER_ICON_SIZE,
    height: ACTIVE_USER_ICON_SIZE,
  },
  inactiveUserIcon: {
    width: INACTIVE_USER_ICON_SIZE,
    height: INACTIVE_USER_ICON_SIZE,
  },
  activeUserNotification: {
    overflow: "hidden",
    backgroundColor: "red",
    width: ACTIVE_USER_NOTIFICATION_SIZE,
    height: ACTIVE_USER_NOTIFICATION_SIZE,
    borderRadius: ACTIVE_USER_NOTIFICATION_SIZE / 2,
  },
  inactiveUserNotification: {
    overflow: "hidden",
    backgroundColor: "red",
    width: INACTIVE_USER_NOTIFICATION_SIZE,
    height: INACTIVE_USER_NOTIFICATION_SIZE,
    borderRadius: INACTIVE_USER_NOTIFICATION_SIZE / 2,
  },
  activeUserNotificationContainer: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  inactiveUserNotificationContainer: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
