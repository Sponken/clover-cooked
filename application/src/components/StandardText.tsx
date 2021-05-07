import React from "react";
import {
  Text,
  StyleSheet,
  ColorValue
} from "react-native";
import {primaryColor, passiveColor} from "./Colors"



export type StandardTextProps = {
  size?: "small" | "SM" | "medium" | "large",
  text?: string,
  color?: "primary" | "passive" | "black" | "white",
  colorValue?: ColorValue ,
  textWeight?: "bold" |"normal" | "lighter",
  textNumbOfLines?: number,
  textAlignment?: "center" | "left",
};

export function StandardText({ ...props }: StandardTextProps) {
  let sizeStyle;
  switch(props.size ?? "medium"){
    case "small":
      sizeStyle = {fontSize: 12};
      break;
    case "SM":
      sizeStyle = {fontSize: 18};
      break;
    case "medium":
      sizeStyle = {fontSize: 22};
      break;
    case "large":
      sizeStyle = {fontSize: 40};
      break;

    }

    let colorStyle;
    if (!props.colorValue){
    switch(props.color ?? "black"){
      case "primary":
        colorStyle = {color: primaryColor};
        break;
      case "passive":
        colorStyle = {color: passiveColor};
        break;
      case "white":
        colorStyle = {color: "white"}
        break;
      case "black":
        colorStyle = {color: "black"}
        break;
        }
    }
    else{
      colorStyle = {color: props.colorValue.toString()}
    }

    let alignment;
    switch(props.textAlignment ?? "center"){
      case "center":
        alignment = {alignSelf: "center"};
        break;
      case "left":
        alignment = {};
        break;
      }
  

  let weightStyle;
  switch(props.textWeight ?? "normal"){
    case "bold":
      weightStyle = {fontWeight: "600"};
      break;
    case "normal":
      weightStyle = {fontWeight: "normal"};
      break;
    case "lighter":
      weightStyle = {fontWeight: "lighter"};
      break;
    }

  let numbOfLines;
  if( props.textNumbOfLines == undefined){
    numbOfLines = 1;
  }
  else{
    numbOfLines=props.textNumbOfLines;
  }

  
  return (
    <Text numberOfLines={numbOfLines} 
          style={[sizeStyle, colorStyle, weightStyle, alignment, styles.textStyle]}>
            {props.text}
    </Text>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    //fontFamily: "Avenir",
    
  },
});
