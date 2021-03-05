import React from "react";
import { Button, View, Text } from "react-native";

const Chef = ({ users, setUsers, key, user }) => {
  console.log("In Chef");
  console.log(user.userName);

  const delChef = () => {
    setUsers(users.filter((x) => x.id !== user.id));
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <Text>{user.userName}</Text>
      <Button onPress={delChef} title="Delete" />
    </View>
  );
};

export default Chef;
