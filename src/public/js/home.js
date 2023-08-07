document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("dropZone");
  const fileList = document.getElementById("fileList");

  // Prevent default behavior for drag events
  dropZone.addEventListener("dragenter", (e) => {
    e.preventDefault();
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  dropZone.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";
    fileInput.addEventListener("change", (e) => {
      const files = e.target.files;
      console.log("Files: ", files);
      handleFiles(files);
    });
    fileInput.click();
  });

  function handleFiles(files) {
    const csvFiles = Array.from(files).filter(
      (file) => file.type === "text/csv"
    );
    console.log(csvFiles);

    if (csvFiles.length > 0) {
      displayFileContents(csvFiles);
      sendFiles(csvFiles);
    } else {
      alert("Please drop or select only CSV files.");
    }
  }

  async function sendFiles(files) {
    files.forEach(async (file) => {
      const response = await fetch("/upload", {
        method: "POST",
        body: { csvFile: file },
      });
      console.log(response.status);
      const data = await response.json();
    });
  }

  function displayFileContents(files) {
    fileList.innerHTML = "";
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const contents = e.target.result;
        const fileName = document.createElement("p");
        fileName.textContent = file.name;
        const fileContent = document.createElement("pre");
        fileContent.textContent = contents;
        fileList.appendChild(fileName);
        fileList.appendChild(fileContent);
      };
      reader.readAsText(file);
    });
  }
});
