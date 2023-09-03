import { mutation } from 'astraql';

const VerifyEmailMutation = mutation`
    verifyEmail($code: String!) {
        verifyEmail(code: $code) {
            _id
            avatar
            email
            isCreator
            isEmailVerified
            username
            createdAt
            updatedAt
        }
    }
`;

export default VerifyEmailMutation;
