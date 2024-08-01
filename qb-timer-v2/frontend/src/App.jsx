import Screen from "./components/Screen";
import Modal from "./components/rules/Modal";
import { useState } from "react";

function App() {
  const config = {
    primaryTimerToggle: "q",
    secondaryTimerToggle: "w",
    restart: "R",
    pause: "p",
  };

  const session = {
    isDualTimer: true,
    duration: 120,
    label1: "正方三辩",
    label2: "反方三辩",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  // return <Screen config={config} session={session} />;
  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Modal
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
