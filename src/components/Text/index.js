// text
import React from "react";
import PropTypes from "prop-types";
import { Text } from "react-pixi-fiber";

//-------------------------------------------------------------------------------

const width = 20
const height = 19
const frames = 1

//-------------------------------------------------------------------------------

function Image(props) {
  const Component = props.as;
  return <Component x={props.x} y={props.y} text={props.text} />;
}
Image.propTypes = {
  as: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  text: PropTypes.string,
};
Image.defaultProps = {
  as: Text,
  text: "text"
};

Image.gameData = {
    size : { x:width,y:height},
    frames,
}

export default Image;
