import { pipeline } from "@xenova/transformers";

async function main() {
  const answerer = await pipeline('question-answering');

  const context = "My name is Roberto, and I enjoy programming primarily in PHP. Occasionally, I also use JavaScript and Python.";
  const question = "Which is my favourite programming language?";

  const answer = await answerer(question, context);
  console.log(answer);
}

main();
