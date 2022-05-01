/**
 * @brief Sends graphql query to server and returns received data
 * @param {*} query grapqhl query
 * @param {*} variables possible variables for query
 * @returns {*} received data
 */
const fetchGQL = (query, variables) => {
    return new Promise((resolve) => {
        fetch('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.errors) {
                    alert(data.errors[0].extensions.code);
                    return;
                } else {
                    resolve(data);
                }
            });
    })
}