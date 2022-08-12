import express from "express";
import {
    processEmailAddress,
    processLoginOtpMobile,
    processSignInForm,
    showLoginOtpMobile,
    showSignInFormEmail,
    showSignInFormPassword,
    signOut
} from "../controllers/sign-in";
import {emailValidator} from "../middleware/emailValidator";
import {mobileOtpValidator} from "../middleware/mobileOtpValidator";
import {passwordValidator} from "../middleware/passwordValidator";
import {resendMobileVerificationCode, showResendPhoneCodeForm} from "../controllers/sign-in";
import emailIsPresentInSession from "../middleware/emailIsPresentInSession/emailIsPresentInSession";

const router = express.Router();

router.get('/sign-in', showSignInFormEmail);
router.post('/sign-in', emailValidator({template: 'sign-in.njk'}), processEmailAddress);
router.get('/sign-in-password',
    emailIsPresentInSession({template: 'sign-in.njk', errorMessages: {emailAddress: 'Enter your email address'}}),
    showSignInFormPassword);

router.post('/sign-in-password',
    emailIsPresentInSession({template: 'sign-in.njk', errorMessages: {emailAddress: 'Enter your email address'}}),
    passwordValidator('sign-in-password.njk', true),
    processSignInForm);

router.get('/sign-in-otp-mobile', showLoginOtpMobile);
router.post('/sign-in-otp-mobile', mobileOtpValidator(true, '/sign-in-otp-mobile', '/resend-text-code'), processLoginOtpMobile);
router.get('/resend-text-code', showResendPhoneCodeForm);
router.post('/resend-text-code', resendMobileVerificationCode);
router.get('/account/sign-out', signOut);

export default router;
