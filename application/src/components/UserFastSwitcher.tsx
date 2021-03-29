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

const activeUserBubbleSize = 65;
const inActiveUserBubbleSize = 45;

/**
 * alla användare, activeUser och ifall någon annan än activeUser som är viktig att klicka på
 */
type SwitcherProps = {
  users: User[];
  activeUser: string;
  userNotifications: string[];
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
  const [state, setState] = useState({
    users: users,
    activeUser: activeUser,
    userNotifications: userNotifications,
  });

  const setActiveUser = (user: string) => {
    setState({
      users: state.users,
      activeUser: user,
      userNotifications: state.userNotifications,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={state.users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserBubble
            user={item}
            isActiveUser={item.id == state.activeUser}
            isNotified={state.userNotifications.includes(item.id)}
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
          : styles.inActiveBubbleContainer
      }
    >
      <Pressable onPress={() => onBubblePress(user.id)}>
        <Image
          style={[
            isActiveUser ? styles.activeUserIcon : styles.inActiveUserIcon,
            { borderColor: user.color, backgroundColor: user.color },
          ]}
          source={user.icon}
        />
      </Pressable>
      <Text
        numberOfLines={1}
        style={
          isActiveUser ? styles.activeBubbleText : styles.inActiveBubbleText
        }
      >
        {user.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 7,
    marginTop: 7,
  },

  activeBubbleContainer: {
    width: activeUserBubbleSize,
    marginLeft: 7,
  },
  inActiveBubbleContainer: {
    width: inActiveUserBubbleSize,
    marginLeft: 7,
    overflow: "hidden",
  },
  activeUserIcon: {
    width: activeUserBubbleSize,
    height: activeUserBubbleSize,
    borderRadius: activeUserBubbleSize / 2,
    overflow: "hidden",
    borderWidth: 3,
  },
  inActiveUserIcon: {
    width: inActiveUserBubbleSize,
    height: inActiveUserBubbleSize,
    borderRadius: inActiveUserBubbleSize / 2,
    overflow: "hidden",
    borderWidth: 3,
  },
  inActiveBubbleText: {
    alignSelf: "center",
    fontSize: 10,
    flex: 1,
  },
  activeBubbleText: {
    alignSelf: "center",
    fontSize: 10,
    fontWeight: "bold",
  },
});
