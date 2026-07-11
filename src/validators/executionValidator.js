export const validateExecution = (req, res, next) => {
    const { code, language } = req.body;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Code is required and must be a string.' });
    }

    if (!language || typeof language !== 'string') {
        return res.status(400).json({ error: 'Language is required and must be a string.' });
    }

    next();
};

export const validateLanguage = (language) => {
    const supportedLanguages = ['javascript', 'python', 'java', 'csharp', 'ruby'];
    return supportedLanguages.includes(language);
};