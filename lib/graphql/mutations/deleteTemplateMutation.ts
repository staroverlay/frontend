import { mutation } from 'astraql';

const DeleteTemplateMutation = mutation`
    deleteTemplate($id: String!) {
        deleteTemplate(id: $id)
    }
`;

export default DeleteTemplateMutation;
