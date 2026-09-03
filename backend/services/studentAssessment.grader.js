const parseJson = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') return value;
  try { return JSON.parse(String(value)); } catch { return value; }
};

export const normalizeQuestionType = (value) => {
  const type = String(value || 'MCQ').trim().toUpperCase().replace(/[\s-]+/g, '_');
  if (["TRUEFALSE", "TRUE_FALSE", "TRUE/FALSE"].includes(type)) return 'TRUE_FALSE';
  if (["FIB", "FILL_BLANK", "FILL_IN_THE_BLANK", "FILL_IN_BLANK"].includes(type)) return 'FILL_BLANK';
  if (["MATCH", "MATCH_THE_FOLLOWING", "MATCH_FOLLOWING"].includes(type)) return 'MATCH';
  return type;
};

const normalizeOptions = (options) => (Array.isArray(options) ? options.map((option, index) => (
  option && typeof option === 'object'
    ? { id: String(option.id ?? `option_${index}`), text: String(option.text ?? option.label ?? option.value ?? '') }
    : { id: `option_${index}`, text: String(option) }
)) : []);

const normalizeMap = (value) => {
  const parsed = parseJson(value);
  if (Array.isArray(parsed)) {
    return Object.fromEntries(parsed.filter((pair) => pair && typeof pair === 'object').map((pair) => [String(pair.left ?? pair.key ?? ''), String(pair.right ?? pair.value ?? '')]));
  }
  if (parsed && typeof parsed === 'object') return parsed.matches && typeof parsed.matches === 'object' ? parsed.matches : parsed;
  return {};
};

const acceptedStrings = (value) => {
  const parsed = parseJson(value);
  if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim().toLowerCase());
  return parsed === null || parsed === undefined ? [] : [String(parsed).trim().toLowerCase()];
};

export const gradeQuestion = (question, answer, optionOrder = []) => {
  const type = normalizeQuestionType(question.type);
  const correctAnswer = parseJson(question.correct_answer);

  if (type === 'MCQ') {
    const options = normalizeOptions(question.options);
    const selectedId = answer?.optionId !== undefined ? String(answer.optionId) : null;
    const visibleIndex = Number(answer?.optionIndex);
    const selectedOriginalIndex = selectedId
      ? options.findIndex((option) => option.id === selectedId)
      : Number.isInteger(visibleIndex) && visibleIndex >= 0 && visibleIndex < optionOrder.length
        ? Number(optionOrder[visibleIndex])
        : -1;
    const configuredIndex = Number(question.correct_option);
    if (Number.isInteger(configuredIndex) && configuredIndex >= 0) return selectedOriginalIndex === configuredIndex;
    if (correctAnswer && typeof correctAnswer === 'object') return String(correctAnswer.id ?? correctAnswer.optionId) === String(selectedId);
    return String(correctAnswer ?? '') === String(selectedId ?? '');
  }

  if (type === 'TRUE_FALSE') {
    const raw = answer?.value ?? answer?.answer ?? answer;
    const selected = typeof raw === 'boolean' ? raw : String(raw).trim().toLowerCase() === 'true';
    const expectedRaw = correctAnswer ?? question.correct_option === 1;
    const expected = typeof expectedRaw === 'boolean' ? expectedRaw : ['true', '1', 'yes'].includes(String(expectedRaw).trim().toLowerCase());
    return selected === expected;
  }

  if (type === 'FILL_BLANK') {
    const actual = String(answer?.text ?? answer?.value ?? answer ?? '').trim().toLowerCase();
    const accepted = acceptedStrings(correctAnswer);
    const fallback = String(question.correct_option ?? '').trim().toLowerCase();
    return accepted.length ? accepted.includes(actual) : actual === fallback;
  }

  if (type === 'MATCH') {
    const expected = normalizeMap(correctAnswer);
    const actual = normalizeMap(answer);
    const keys = Object.keys(expected);
    if (!keys.length || keys.length !== Object.keys(actual).length) return false;
    return keys.every((key) => String(expected[key]).trim().toLowerCase() === String(actual[key]).trim().toLowerCase());
  }

  return false;
};

export const gradeAssessment = (questions, answersByQuestionId) => {
  let score = 0;
  let totalMarks = 0;
  let correctAnswers = 0;
  const results = [];

  for (const question of questions) {
    const marks = Number(question.marks) || 0;
    totalMarks += marks;
    const answer = answersByQuestionId.get(Number(question.id));
    const optionOrder = Array.isArray(question.option_order) ? question.option_order.map(Number) : [];
    const correct = answer !== undefined && gradeQuestion(question, answer, optionOrder);
    const awarded = correct ? marks : 0;
    if (correct) correctAnswers += 1;
    score += awarded;
    results.push({ questionId: Number(question.id), isCorrect: correct, marksAwarded: awarded });
  }

  return { score, totalMarks, correctAnswers, totalQuestions: questions.length, results };
};
