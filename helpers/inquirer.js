const inquirer = require("inquirer");

require("colors");

const questions = [
  {
    type: "list",
    name: "option",
    message: "Select an option",
    choices: [
      {
        name: `${"1.".green} Search place`,
        value: 1,
        short: "Search",
      },
      {
        name: `${"2.".green} History`,
        value: 2,
        short: "History",
      },
      {
        name: `${"3.".green} exit`,
        value: 0,
        short: "exit",
      },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();

  console.log("====================".green);
  console.log("  WEATHER IN PLACES".white);
  console.log("====================".green);

  const { option } = await inquirer.prompt(questions);
  return option;
};

const pause = async () => {
  const question = [
    {
      type: "input",
      name: "continue",
      message: `\nPress ${"ENTER".green} to continue...\n`,
    },
  ];

  return await inquirer.prompt(question);
};

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "inputUser",
      message,
    },
  ];

  const { inputUser } = await inquirer.prompt(question);
  return inputUser;
};

const listPlaces = async (places = []) => {
  const choices = places.map((place, i) => {
    return {
      name: `${(i + 1 + ".").green} ${place.name}`,
      value: place.id,
    };
  });

  choices.push({
    name: `${"0.".green} Cancel`,
    value: 0,
  });

  const questions = [
    {
      type: "list",
      name: "placeId",
      choices,
    },
  ];

  const { placeId } = await inquirer.prompt(questions);
  return placeId;
};

const confirmAcction = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "authorize",
      message,
    },
  ];

  const { authorize } = await inquirer.prompt(question);
  return authorize;
};

const checkTaskList = async (task = []) => {
  const choices = task.map((task, i) => {
    return {
      name: `${(i + 1 + ",").green} ${task.desc}`,
      value: task.id,
      checked: task.completedIn ? true : false,
    };
  });

  const questions = [
    {
      type: "checkbox",
      name: "ids",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(questions);
  return ids;
};

module.exports = {
  inquirerMenu,
  pause,
  readInput,
  listPlaces,
  confirmAcction,
  checkTaskList,
};