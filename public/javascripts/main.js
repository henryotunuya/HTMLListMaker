var isUploaded = false;

function copyTextarea(activeTab) {
    var codeBoxToCopyId = activeTab.getAttribute("data-active-tab");
    var codeBoxToCopy = document.getElementById(codeBoxToCopyId);
    if (codeBoxToCopy.value.length == ''){
        alert("Nothing to copy!");
    } else{
    codeBoxToCopy.focus();
    codeBoxToCopy.select();
    codeBoxToCopy.setSelectionRange(0, 99999);

    document.execCommand('copy');
    var copyResponderId = activeTab.getAttribute("data-copy-responder")
    var copyResponder = document.getElementById(copyResponderId);
    copyResponder.innerHTML = "Copied to clipboard!"

    copyResponder.removeAttribute('class');
    //###### Add fade effect #######
    setTimeout(function () {
        copyResponder.classList.add('fade');
    }, 2000);

    //###### End fade effect #######
}
}
//##### This handles the file Drag and Drop activity #####

var copyStatusText = document.getElementById("copyStatusText");
var fUBHidder = document.getElementById("fUBHidder");

function dropHandler(event) {
    event.preventDefault();
    isUploaded = true;

    copyStatusText.innerHTML = "Dropped! <br> Click convert";
    filePathvalue = event.dataTransfer.items[0].getAsFile();
    console.log("filePathvalue: " + window.URL.createObjectURL(filePathvalue));
    filePath_h.value = window.URL.createObjectURL(filePathvalue);

    if (event.dataTransfer.items) {
        for (var i = event.dataTransfer.items.length - 1; i >= 0; i--) {
            if (event.dataTransfer.items[i].kind === 'file') {
                var file = event.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
            }
        }
    } else {
        for (var i = event.dataTransfer.files.length - 1; i >= 0; i--) {
            console.log('... file[' + i + '].name = ' + event.dataTransfer.file[i].name);
        }
    }
}

function dragoverHandler(event) {
    if (event.dataTransfer.items[0].kind === 'file') {
        copyStatusText.innerHTML = "Drop now!"
        console.log("dragOver")
    }
    event.preventDefault();
}
function dragEnter(event) {
    //copyStatusText.innerHTML = "Dropped! <br> Click convert";
    //filePathvalue = event.dataTransfer.items[0].getAsFile();
    //console.log(filePathvalue);
}
function dragLeave(event) {
    copyStatusText.innerHTML = "Click or drag-and-drop to upload";
}

//###### End file Drag and Drop code ########

// ----- Begins listView Copy Code button ----- //
function makeActivated(activeTab) {
    var activeTabId = activeTab.getAttribute("data-tab-id");
    listViewCopyBttn.setAttribute("data-active-Tab", activeTabId);
}
// ----- Ends listView Copy Code button ---- //

//######## File upload box checks ############
/*
var fileUploadBox = document.getElementById("fileUploadBox");
uploadFileForm.addEventListener('submit', checkIfUploaded);
function checkIfUploaded(event) {
    if (fileUploadBox.value == "" && !isUploaded) {
        alert("No file uploaded!");
        event.preventDefault();
    } else {
        isUploaded = true;
    }
} */
//###### End file upload box checks ########

