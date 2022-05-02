window.onload = async() => {
    const table = document.querySelector('#usersTable');
    const query = `query Query {
                        users {
                            id
                            username
                            rights
                        }
                    }`;

    let users = await fetchGQL(query);
    users.data.users.forEach((user) => {
        const row = document.createElement('tr');

        row.innerHTML = `<td>${user.username}</td>
                        <td>${user.rights}</td>
                        <td><button type="button" id=${user.id} onclick="deleteUser(this.id)">Delete</td>
                        <td><button type="button" id=${user.id} onclick="changePassword(this.id)">change password</td>`;

        table.appendChild(row);
    });
}


const changePassword = async(id) => {
    const pwd = prompt('Insert new password');
    if (!pwd) return;

    const query = `mutation Mutation($changePasswordId: String!, $password: String!) {
                     changePassword(id: $changePasswordId, password: $password) {
                        username
                    }
                }`;

    const variables = {
        changePasswordId: id,
        password: pwd
    }

    const result = await fetchGQL(query, variables);
    alert(`Changed password for user: "${result.data.changePassword.username}"!`);
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete user?')) return;
    console.log("poistetaan", id);
    const query = `mutation Mutation($deleteUserId: String!) {
                    deleteUser(id: $deleteUserId) {
                        username
                    }
                    }`;
    const variables = {
        deleteUserId: id
    };

    const result = await fetchGQL(query, variables);
    alert(`User "${result.data.deleteUser.username}" Deleted from database!`);
}



document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById("user").value;
    const password = document.getElementById("password").value;
    const rights = document.getElementById("admin").checked;
    const query = `mutation Mutation($username: String, $password: String, $rights: Boolean) {
                        addUser(username: $username, password: $password, rights: $rights) 
                        {
                            id
                        }
                    }`;

    const variables = {
        "username": username,
        "password": password,
        "rights": rights
    };

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
            console.log('data returned:', data);
            if (data.data.addUser.id) {
                alert('User created!');
            } else {
                alert('Can not create user!');
            }
        });
})

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
                resolve(data);
            });
    })
}