document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("dropZone");
  const fileList = document.getElementById("fileList");
  const modal = document.querySelector(".modal");
  const modalCloseBtn = document.querySelector(".modal button");
  const modalText = document.querySelector(".modal .modal-text");
  const modalHeading = document.querySelector(".modal .modal-heading");
  const trashBtns = document.querySelectorAll(".file .fa-trash");
  const fileDivs = document.querySelectorAll(".file");

  fileDivs.forEach((div) =>
    div.addEventListener("click", () => {
      window.location.assign("/table/" + div.id);
    })
  );

  const sendDeleteFileRequest = async (fileId) => {
    console.log("Sending delete request for", fileId);
    const response = await fetch("/files/" + fileId, {
      method: "DELETE",
    });
    if (response.status === 200) {
      openModal();
      modalHeading.textContent = "Success";
      modalText.textContent = "Successfully deleted the file";
    } else {
      openModal();
      modalHeading.textContent = "Failure";
      modalText.textContent = "Could not delete the file, please try again";
    }
  };

  // add event listener on all the trash btns
  trashBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const fileId = btn.id.split("-")[0];
      sendDeleteFileRequest(fileId);
    })
  );

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
      (file) =>
        file.type === "text/csv" || file.type === "application/vnd.ms-excel"
    );
    console.log(csvFiles);

    if (csvFiles.length > 0) {
      sendFiles(csvFiles);
    } else {
      openModal();
      modalHeading.textContent = "Wrong file";
      modalText.textContent = "Pease upload only CSV files";
    }
  }

  async function sendFiles(files) {
    files.forEach(async (file) => {
      const body = new FormData();
      body.append("csvFile", file);
      const response = await fetch("/files/upload", {
        method: "POST",
        body: body,
      });
      console.log(response);
      if (response.status === 200) {
        openModal();
        modalHeading.textContent = "Successful";
        modalText.textContent = "Successfully uploaded the file";
      } else {
        openModal();
        modalHeading.textContent = "Unsuccessful";
        modalText.textContent = "Please ensure you're uploading csv file";
      }
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

  modalCloseBtn.addEventListener("click", () => {
    closeModal();
  });

  function openModal() {
    modal.classList.remove("invisible");
  }

  function closeModal() {
    window.location.reload();
    modal.classList.add("invisible");
  }
});
