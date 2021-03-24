import { ColorValue, ImageSourcePropType } from "react-native";
export type User = {
  id: string;
  name: string;
  color: ColorValue;
  icon: ImageSourcePropType;
};
