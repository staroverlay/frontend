import { query } from "astraql";

const GetAllMediaQuery = query`
    getAllMedia {
        getAllMedia {
            _id
            name
            resourceId
            size
            type
            uploadId
        }
    }
`;

export default GetAllMediaQuery;
