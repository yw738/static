// shared-worker.js
onconnect = (e) => {
    const port = e.ports[0];
    port.start();
  
    port.onmessage = async (msg) => {
      const { type, key, buffer, metadata } = msg.data;
  
      if (type === "upload") {
        await saveToDB(key, { buffer, metadata });
        port.postMessage({ status: "ok", message: `已保存 ${metadata.name}` });
      }
  
      if (type === "list") {
        const list = await listFiles();
        port.postMessage({ status: "ok", files: list });
      }
  
      if (type === "get") {
        const data = await loadFromDB(key);
        if (data) {
          const { buffer, metadata } = data;
          port.postMessage({ status: "ok", buffer, metadata }, [buffer]);
        } else {
          port.postMessage({ status: "error", message: "文件不存在" });
        }
      }
    };
  };
  
  // === IndexedDB 操作 ===
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("SharedWorkerDB", 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore("files");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = reject;
    });
  }
  
  async function saveToDB(key, data) {
    const db = await openDB();
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").put(data, key);
    return tx.done;
  }
  
  async function loadFromDB(key) {
    const db = await openDB();
    const tx = db.transaction("files", "readonly");
    return new Promise((resolve) => {
      const req = tx.objectStore("files").get(key);
      req.onsuccess = () => resolve(req.result);
    });
  }
  
  async function listFiles() {
    const db = await openDB();
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    return new Promise((resolve) => {
      const req = store.getAllKeys();
      req.onsuccess = () => resolve(req.result);
    });
  }
  