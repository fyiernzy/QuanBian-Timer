import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import AddModal from "./AddRecord/AddModal";
import { processJsonFile } from "./jsonHandler";

const Modal = ({ isOpen, onClose }) => {
  const [jsonFile, setJsonFile] = useState(null);
  const [data, setData] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const onDrop = (acceptedFiles) => {
    processJsonFile(
      acceptedFiles,
      setJsonFile,
      setData,
      setShowError,
      setErrorMessage
    );
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setData(items);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-11/12 max-w-2xl">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag and drop a .json file here, or click to select a file</p>
        </div>
        {showError && <p className="text-red-500">{errorMessage}</p>}

        <div className="flex justify-between items-center mt-4">
          <h2 className="text-lg font-bold">JSON File: {jsonFile}</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="mt-4"
              >
                {data.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={`item-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-4 mb-2 shadow rounded-md flex items-center"
                      >
                        <div className="mr-2 cursor-pointer">&#9776;</div>
                        <div>
                          <p>环节名称: {item.环节名称}</p>
                          <p>时长: {item.时长}</p>
                          <p>双方环节: {item.双方环节}</p>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* </>
        ) : (
          <div className="mt-4">
            <p>当前并无任何环节。请点击右上方的加号增加新的环节。</p>
            <div className="flex justify-between items-center mt-4">
              <input
                type="text"
                placeholder="untitled"
                className="tw-input tw-w-full max-w-xs"
              />
              <span className="ml-2">.json</span>
            </div>
          </div>
        )} */}
        {isAddModalOpen && (
          <AddModal setIsModalOpen={setIsAddModalOpen} setData={setData} />
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
