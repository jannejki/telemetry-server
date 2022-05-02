window.onload = () => {
    refreshCanTable();
    refreshFileTable();
}

/**
 * @brief Deletes selected dbc file from database
 * @param {*} filename name of the dbc file that will be deleted
 * @returns void
 */
async function deleteDbcFile(filename) {

    // asks from user if sure to delete file
    if (!confirm("Are you sure?")) return;

    // sends request to server to delete the file
    await fetch('/settings/deleteDbcFile', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: filename })
        }).then(response => {
            if (response.status === 500) alert('something went wrong!');
            if (response.status === 401) alert('Not Authorized!');
            if (response.status === 204) alert('file removed from database!');
        })
        // refreshes file table
    refreshFileTable();
}


/**
 * Refreshes file table to show the dbc files and shows which file is in use. User can change
 * the active file by clicking the "inUse" element of the table.
 * @brief refreshes file table to show all the available dbc files
 */
const refreshFileTable = () => {
    // creating table headers 
    let table = document.getElementById("fileTable");

    // emptying the table and creating header row
    table.innerHTML = `<tr>
                        <th>File</th>
                        <th>Delete</th>
                        <th>In use (click to change)</th>
                      </tr>`;

    // Sends request to server to get all the dbc files
    fetch('settings/getDbcFiles')
        .then(response => response.json())
        .then((data) => {
            // creating new row for every file
            for (let i = 0; i < data.files.length; i++) {

                let tr = document.createElement("tr");
                let nametd = document.createElement("td");
                nametd.innerText = data.files[i].filename;

                let deletetd = document.createElement("td");

                //fixme disable button when (data.files[i].using == true)
                deletetd.innerHTML = `<button
                                            value="delete" 
                                            class="deleteCan" 
                                            id="${data.files[i].filename}"
                                            onclick="deleteDbcFile(this.id)">
                                            Delete file
                                        </button>`;

                // creating cell to see if file is in use
                let inUseTd = document.createElement("td");

                // switching the innerHTML and class for the inUse cell
                switch (data.files[i].using) {
                    case true:
                        inUseTd.innerHTML = "active";
                        inUseTd.setAttribute("class", "activeFile");
                        break;
                    case false:
                        inUseTd.innerHTML = "not active";
                        inUseTd.setAttribute("class", "notActiveFile");
                        inUseTd.setAttribute("id", data.files[i].filename);
                        inUseTd.setAttribute("onclick", "changeDbcFile(this.id)");
                        break;
                }

                // appending all cells to table
                tr.appendChild(nametd);
                tr.appendChild(deletetd);
                tr.appendChild(inUseTd);
                table.appendChild(tr);
            }
        })
}


/**
 * @brief changes the active dbc file
 * @param {string} filename name of the file to use
 */
const changeDbcFile = async(filename) => {
    // sends request to server to change active file
    const resp = await fetch('/settings/changeDbcFile/?filename=' + filename);

    let json;
    switch (resp.status) {
        case 201:
            json = await resp.json();
            alert(`Settings ID: ${json.result._id}`);
            break;
        case 500:
            json = await resp.json();
            alert(json.error);
            break;
        case 401:
            alert('Not Authorized!');
            return;
    }

    refreshFileTable();
    refreshCanTable();
}

/**
 * @brief refreshes can table to show the CAN ids that are in the active dbc file
 */
const refreshCanTable = async() => {
    // creating header row
    let table = document.getElementById("canTable");
    table.innerHTML = `<tr>
                            <th>ID</th>
                            <th>Name</th>
                       <tr>`;
    let tr = document.createElement("tr");

    // Getting CAN names and IDs from server
    const canList = await getNodes();

    // creating new row for every CAN
    for (let i = 0; i < canList.length; i++) {
        table.innerHTML = `${table.innerHTML}
                            <tr>
                                <td>${canList[i].canID}</td>
                                <td>${canList[i].name}</td>
                            </tr>`;
    }
}

// Get CAN node information from server.
const getNodes = async() => {
    const query = `query CanNodes($rules: Boolean) {
        canNodes(rules: $rules) {
          name
          canID
        }
      }`;

    const result = await fetchGQL(query);
    return result.data.canNodes;
}