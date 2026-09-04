export const isAnswerProvided = (answer) => {
  if (answer === null || answer === undefined) return false;
  if (typeof answer !== "object") return String(answer).trim() !== "";
  if (Object.prototype.hasOwnProperty.call(answer, "optionIndex")) {
    return Number.isInteger(Number(answer.optionIndex)) && Number(answer.optionIndex) >= 0;
  }
  if (Object.prototype.hasOwnProperty.call(answer, "value")) {
    return answer.value !== null && answer.value !== undefined;
  }
  if (Object.prototype.hasOwnProperty.call(answer, "text")) {
    return String(answer.text ?? "").trim() !== "";
  }
  if (Object.prototype.hasOwnProperty.call(answer, "matches")) {
    return Boolean(answer.matches && typeof answer.matches === "object" && Object.keys(answer.matches).length > 0);
  }
  return Object.keys(answer).length > 0;
};
