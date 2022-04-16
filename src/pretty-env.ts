const { execSync } = require("child_process");

// types
type Env = {
  name: string;
  value: string;
};

type EnvList = string[];

// constants
const TRUNCATE_TEXT_SIZE = 50;
const MARGIN = 3;
const LEFT_MARGIN = 1;
const ELLIPSES_TEXT = "...";

// functions
const getMaxSize = (
  envList: EnvList,
): { nameMaxSize: number; valueMaxSize: number } => {
  let nameMaxSize = 0;
  let valueMaxSize = 0;

  for (const env of envList) {
    const name = env.split("=")[0];
    const value = env.split("=")[1];

    if (nameMaxSize < name.length) {
      nameMaxSize = name.length;
    }

    if (valueMaxSize < value.length) {
      valueMaxSize = value.length;
    }
  }

  if (nameMaxSize > TRUNCATE_TEXT_SIZE) {
    nameMaxSize = TRUNCATE_TEXT_SIZE;
  }

  if (valueMaxSize > TRUNCATE_TEXT_SIZE) {
    valueMaxSize = TRUNCATE_TEXT_SIZE;
  }

  if (nameMaxSize % 2 === 1) {
    nameMaxSize++;
  }

  if (valueMaxSize % 2 === 1) {
    valueMaxSize++;
  }

  return { nameMaxSize, valueMaxSize };
};

const getChars = (width: number, char: string): string => {
  return Array.from(Array(width), () => char).join("");
};

const prettyEnv = () => {
  // env text
  const stdout = execSync("env");

  // Note:
  // I was going to use readline, but that would have resulted in an error,
  // so I will list each newline.
  const envList: EnvList = stdout.toString().trim().split("\n");
  const { nameMaxSize, valueMaxSize } = getMaxSize(envList);
  let tableLength = Math.trunc(nameMaxSize + valueMaxSize + MARGIN);

  let displayText = getChars(tableLength, "-");

  for (const env of envList) {
    let nameSpaceLength = 0;
    let valueSpaceLength = 0;

    const name = env.split("=")[0];
    const value = env.split("=")[1];
    if (nameMaxSize > name.length) {
      nameSpaceLength = Math.trunc(nameMaxSize - name.length);
    }

    if (valueMaxSize > value.length) {
      valueSpaceLength = Math.trunc(valueMaxSize - value.length);
    }

    displayText += "\n";
    displayText += getChars(1, "|");
    displayText += getChars(LEFT_MARGIN, " ");
    if (name.length > (nameMaxSize - ELLIPSES_TEXT.length)) {
      displayText += name.substring(
        0,
        nameMaxSize - (ELLIPSES_TEXT.length + 1),
      );
      displayText += ELLIPSES_TEXT;
    } else {
      displayText += name;
    }

    if (nameSpaceLength) {
      displayText += getChars(nameSpaceLength - LEFT_MARGIN, " ");
    }

    displayText += getChars(1, "|");
    displayText += getChars(LEFT_MARGIN, " ");
    if (value.length > (valueMaxSize - ELLIPSES_TEXT.length)) {
      displayText += value.substring(
        0,
        valueMaxSize - (ELLIPSES_TEXT.length + 1),
      );
      displayText += ELLIPSES_TEXT;
    } else {
      displayText += value;
    }

    if (valueSpaceLength) {
      displayText += getChars(valueSpaceLength - LEFT_MARGIN, " ");
    }

    displayText += getChars(1, "|");
    displayText += "\n";
    displayText += getChars(tableLength, "-");
  }

  console.log(displayText);
};

module.exports = prettyEnv;
