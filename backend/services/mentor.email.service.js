// Dummy mentor email service to fix the crash
export const sendMentorVerificationEmail = async (email, name) => {
    console.log(`[Email Mock] Verification email sent to ${email}`);
};

export const sendMentorWelcomeEmail = async (email, name) => {
    console.log(`[Email Mock] Welcome email sent to ${email}`);
};

export const sendMentorRejectionEmail = async (email, name, reason) => {
    console.log(`[Email Mock] Rejection email sent to ${email}`);
};

export const sendBatchAssignmentEmail = async () => {
    console.log(`[Email Mock] Batch assignment email sent`);
};

export const sendReplacementNotificationEmail = async () => {
    console.log(`[Email Mock] Replacement notification email sent`);
};
