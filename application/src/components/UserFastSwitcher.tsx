import React from "react";
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

/**
 * alla användare, activeUser och ifall någon annan än activeUser som är viktig att klicka på
 */
type SwitcherProps = {
  users: User[];
  activeUser: string;
  userNotifications: string[];
};

/**
 * Komponent för att visa och kunna byta snabbt mellan alla användare på samma enhet.
 */
export const UserFastSwitcher = ({
  users,
  activeUser,
  userNotifications,
}: SwitcherProps) => (
  <View style={styles.container}>
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserBubble
          user={item}
          isActiveUser={item.id == activeUser}
          isNotified={userNotifications.includes(item.id)}
        />
      )}
    />
  </View>
);

type UserBubbleProps = {
  user: User;
  isActiveUser: boolean;
  isNotified: boolean;
};
/**
 * tar fram varsin items icon. current user större och visar namn, isnotified har också en plupp/hänvisar
 */
const UserBubble = ({ user, isActiveUser, isNotified }: UserBubbleProps) => {
  return (
    <View style={styles.bubbleContainer}>
      <Pressable>
        <Image
          style={isActiveUser ? styles.activeUserIcon : styles.inActiveUserIcon}
          source={user.icon}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  activeUserIcon: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    overflow: "hidden",
    borderWidth: 3,
  },
  inActiveUserIcon: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    overflow: "hidden",
    borderWidth: 3,
  },
  bubbleContainer: {
    marginRight: 7,
  },
});
