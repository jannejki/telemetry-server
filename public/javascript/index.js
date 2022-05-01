// Variables
const cards = [];
const cardSocket = io();
const liveChannel = 'live';

// Load nodes and create cards when page is loaded
window.onload = async(event) => {
    let nodes = await getNodes();
    createCards(nodes);
};

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


function createCards(nodes) {
    let dashboardDiv = document.getElementById("dashboard");

    nodes.forEach((node) => {
        const card = document.createElement('div');
        card.setAttribute('id', node.canID);
        card.setAttribute('class', 'card');

        card.innerHTML = `<h2>${node.name}</h2>
                          <div id="${node.canID}Data" class="messageDiv">
                            <table id="${node.canID}Table" class="dataTable"></table>
                          </div>`;

        dashboardDiv.appendChild(card);
        cards.push(new Card(node.canID, card));
    });
}


cardSocket.on(liveChannel, (message) => {
    message.latestMessage.forEach((message) => {
        updateCard(message);
    })
});



const updateCard = (msg) => {
    cards.forEach((card) => {
        if (card.CAN == msg[0].canID) {
            card.turnOn();
            card.updateValues(msg);
        }
    });
}