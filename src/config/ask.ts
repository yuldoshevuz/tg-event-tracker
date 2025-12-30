import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const ask = async (message: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    rl.question(message, resolve);
  });
};
