import { mutation } from "astraql";

const UpdatePasswordMutation = mutation`
    updatePassword($payload: UpdatePasswordDTO!) {
        updatePassword(payload: $payload) {
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

export default UpdatePasswordMutation;
