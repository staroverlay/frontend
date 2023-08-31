import { mutation } from "astraql";

const DeleteWidgetMutation = mutation`
    deleteWidget($id: String!) {
        deleteWidget(id: $id)
    }
`;

export default DeleteWidgetMutation;
