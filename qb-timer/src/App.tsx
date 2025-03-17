import {useState} from 'react'
import './App.css'
import {KeyProvider} from "./contexts/KeyContext.tsx";
import {SessionData, SessionType, StanceType} from "./interfaces/SessionData.ts";
import MainModal from "./components/MainModal.tsx";
import SettingsModal, {SettingsData} from "./components/settings/SettingsModal.tsx";

function App() {
    const sessions: SessionData[] = [
        {
            name: "正方三辩小结",
            duration: 120,
            type: SessionType.Single,
            label1: "正方三辩小结",
            stance: StanceType.Affirmative
        },
        {
            name: "正方三辩小结",
            duration: 120,
            type: SessionType.Duo,
            label1: "正方三辩小结",
            label2: "反方三辩小结",
            stance: StanceType.Affirmative
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveSettings = (settingsData: SettingsData) => {
        console.log("Settings saved:", settingsData);
        // You can persist these settings as needed.
    };

    return (
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-red rounded"
        >
          Open Modal
        </button>
          <SettingsModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveSettings}
          />
      </div>
    );


    // return (
    //     <KeyProvider>
    //         <MainModal sessions={sessions}/>
    //     </KeyProvider>
    // );

    // return (
    //   <div>
    //     <button
    //       onClick={() => setIsModalOpen(true)}
    //       className="px-4 py-2 bg-blue-500 text-red rounded"
    //     >
    //       Open Modal
    //     </button>
    //     <SessionConfigModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    //   </div>
    // );
}

export default App
