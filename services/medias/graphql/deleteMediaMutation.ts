import { mutation } from 'astraql';

const DeleteMediaMutation = mutation`
    deleteMedia($id: String!) {
        deleteMedia(id: $id)
    }
`;

export default DeleteMediaMutation;
