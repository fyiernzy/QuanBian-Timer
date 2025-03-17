import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {SessionData} from "../../interfaces/SessionData.ts";
import {isDuoSession} from "../../utils/SessionUtils.ts";

interface SortableItemProps {
    id: string;
    sessionData: SessionData;
}

export default function SortableItem({ id, sessionData }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-4 mb-2 shadow rounded-md flex items-center"
        >
            <div className="mr-2 cursor-grab">&#9776;</div>
            <div>
                <p>环节名称: {sessionData.name}</p>
                <p>时长: {sessionData.duration}</p>
                <p>双方环节: {isDuoSession(sessionData) ? "是" : "否"}</p>
            </div>
        </div>
    );
}