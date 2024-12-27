import { mutation } from 'astraql';

const VerifyEmailMutation = mutation`
    verifyEmail($code: String!) {
        verifyEmail(code: $code) {
            _id
            email
            isCreator
            isEmailVerified
            profileId
            createdAt
            updatedAt
        }
    }
`;

export default VerifyEmailMutation;
