import { useState } from "react";
import { Toaster, toast } from "sonner";
import "./App.css";

import { uploadFile } from "./services/upload";
import { Search } from "./components/Search";

const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  READY_UPLOAD: "ready_upload",
  UPLOADING: "uploading",
  READY_USAGE: "ready_usage",
};

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: "Subir archivo",
  [APP_STATUS.UPLOADING]: "Subiendo archivo...",
};

function App() {
  const [appStatus, setAppStatus] = useState(APP_STATUS.IDLE);
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);

  const handleInputChange = (event) => {
    const [file] = event.target.files ?? [];

    if (file) {
      setFile(file);
      setAppStatus(APP_STATUS.READY_UPLOAD);
      console.log(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (appStatus != APP_STATUS.READY_UPLOAD || !file) {
      return;
    }

    setAppStatus(APP_STATUS.UPLOADING);

    const [err, newData] = await uploadFile(file);

    if (err) {
      setAppStatus(APP_STATUS.ERROR);
      toast.error(err.message);
      return;
    }

    setAppStatus(APP_STATUS.READY_USAGE);
    if (newData) setData(newData);
    toast.success("Complete");
  };

  const showButton =
    appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;
  const showInput = appStatus != APP_STATUS.READY_USAGE;

  return (
    <>
      <Toaster />
      <h4>Prueba de acrvhivo</h4>
      {showInput && (
        <form onSubmit={handleSubmit}>
          <label>
            <input
              disabled={appStatus === APP_STATUS.UPLOADING}
              onChange={handleInputChange}
              name="file"
              type="file"
              accept=".csv"
            />
          </label>

          {showButton && (
            <button disabled={appStatus === APP_STATUS.UPLOADING}>
              {BUTTON_TEXT[appStatus]}
            </button>
          )}
        </form>
      )}

      {appStatus === APP_STATUS.READY_USAGE && (
        <Search initialData={data}/>
      )}
    </>
  );
}

export default App;
