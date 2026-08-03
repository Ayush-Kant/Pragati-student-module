const skills = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "JavaScript",
  "TypeScript",
  "Java",
  "Python",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Git",
  "GitHub",
];

export const getSkills = (req, res) => {
  const search = (req.query.search || "").toLowerCase();

  const filtered = skills.filter((skill) =>
    skill.toLowerCase().includes(search)
  );

  res.json(filtered);
};