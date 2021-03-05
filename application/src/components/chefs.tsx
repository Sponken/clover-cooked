import React from "react";
import Chef from "./chef";
import { View } from "react-native";

const Chefs = ({ users, setUsers }) => {
  console.log("In Chefs");
  console.log(users.userName);

  return (
    <View>
      {users.map((user) => (
        <Chef users={users} setUsers={setUsers} key={user.key} user={user} />
      ))}
    </View>
  );
};

export default Chefs;
