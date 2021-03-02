import { ColorValue, Image, ImageSourcePropType } from "react-native";
export type User = {
  id: string;
  name: string;
  color: ColorValue;
  icon: ImageSourcePropType;
};
