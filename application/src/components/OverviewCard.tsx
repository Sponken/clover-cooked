import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  useWindowDimensions,
  Text,
  FlatList,
  ColorValue,
  ImageSourcePropType,
} from "react-native";
import React, { useState, useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  IngredientList,
  StandardButton,
  primaryColor,
  StandardText,
} from "../components";
import * as Progress from "react-native-progress";
import { User } from "../data";
import { unsafeFind } from "../utils";

const USER_BUBBLE_SIZE = 15;
const USER_ICON_SIZE = 10;

type Props = {
  text: string;
  users: User[];
  displayUsers: string[];
  type: "branch" | "task";
  onPress: () => void;
  progress: number;
};

export function OverviewCard({
  text,
  users,
  displayUsers,
  type,
  onPress,
  progress,
}: Props) {
  let branchIcon: JSX.Element;
  if (type === "branch") {
    branchIcon = (
      <Image
        source={require("../../assets/image/branch.png")}
        style={styles.branchIcon}
      />
    );
  } else {
    branchIcon = <></>;
  }

  type UserIconProps = {
    color: ColorValue;
    icon: ImageSourcePropType;
  };

  const UserIcon = ({ color, icon }: UserIconProps) => (
    <View style={[styles.userBubble, { backgroundColor: color }]}>
      <Image style={styles.activeUserIcon} source={icon} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {branchIcon}
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={displayUsers}
          renderItem={({ item }) => {
            const user = unsafeFind(users, (u) => u.id === item);
            return <UserIcon color={user.color} icon={user.icon} />;
          }}
          keyExtractor={(item) => item}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: 2,
              }}
            />
          )}
        />
      </View>
      <View>
        <Text numberOfLines={1}>{text}</Text>
      </View>
      <View>
        <Progress.Bar
          color="green"
          height={15}
          unfilledColor="lightgrey"
          borderWidth={0}
          progress={progress}
          width={null}
          style={{}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
    margin: 5,
  },
  iconContainer: {
    flexDirection: "row",
  },
  branchIcon: {
    height: USER_BUBBLE_SIZE,
    width: USER_BUBBLE_SIZE,
    resizeMode: "center",
    flexShrink: 0,
  },
  userBubble: {
    width: USER_BUBBLE_SIZE,
    height: USER_BUBBLE_SIZE,
    borderRadius: USER_BUBBLE_SIZE / 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  activeUserIcon: {
    width: USER_ICON_SIZE,
    height: USER_ICON_SIZE,
  },
});
