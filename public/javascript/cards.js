function Card(CAN, cardElement) {
    this.CAN = CAN;
    this.cardElement = cardElement;
    this.timeout;
    this.faults = 0;

    this.turnOn = () => {
        this.cardElement.setAttribute('class', 'card running');
        if (this.timeout != undefined) clearTimeout(this.timeout);
        this.timeout = setTimeout(this.turnOff, 5000);
    };

    this.turnOff = () => {
        this.cardElement.setAttribute('class', 'card');
        this.timeout = undefined;
    };

    this.updateValues = (messages) => {
        const dataTable = document.getElementById(`${CAN}Table`);
        dataTable.innerHTML = ``;
        let htmlRows = "";

        messages.forEach((msg) => {
     
            // TODO: figure out real fault codes
            const fault = (msg.data > msg.max || msg.data < msg.min);
            let color;

            if (fault) {
                color = '#fc0303';
                this.faults++;
            } else {
                color = '#000000';
            }

            if (this.faults > 0) {
                this.cardElement.setAttribute('class', 'card fault');
            } else {
                this.cardElement.setAttribute('class', 'card running');
            }

            htmlRows += `<tr>
                                    <td style="color: ${color}">${msg.name}</td>
                                    <td style="color: ${color}"> ${msg.data.toFixed(3)}</td>
                                </tr>`;
        });
        dataTable.innerHTML = htmlRows;
    };
}