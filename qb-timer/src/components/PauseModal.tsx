import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface PauseModalProps {
    onClose: () => void;
}

export default function PauseModal({ onClose } : PauseModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded p-4 relative w-96">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>

        <ExclamationTriangleIcon className="h-16 w-16 text-red-600 mb-4" />
        <h2 className="text-xl font-bold">{"暂停"}</h2>
        <p className="mt-2">{"电脑计时出现问题，当前环节请以手动计时为准"}</p>
      </div>
    </div>
  );
};
