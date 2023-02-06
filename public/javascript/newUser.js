window.onload = async () => {
    const table = document.querySelector('#usersTable');
    const query = `query Query {
        users {
          ID
          NAME
          PRIVILEGE
        }
      }`;

    let users = await fetchGQL(query);
    console.log(users);
    users.data.users.forEach((user) => {
        const row = document.createElement('tr');

        row.innerHTML = `<td>${user.NAME}</td>
                        <td>${user.PRIVILEGE}</td>
                        <td><button type="button" id=${user.ID} onclick="deleteUser(this.id)">Delete</td>
                        <td><button type="button" id=${user.ID} onclick="changePassword(this.id)">change password</td>`;

        table.appendChild(row);
    });
}


const changePassword = async (id) => {
    const pwd = prompt('Insert new password');
    if (!pwd) return;

    const query = `mutation ChangePassword($id: Int!, $password: String!) {
        changePassword(ID: $id, PASSWORD: $password) {
          ID
          NAME
          PRIVILEGE
        }
      }`;

    const variables = {
        id: parseInt(id),
        password: pwd
    }

    const result = await fetchGQL(query, variables);
    alert(`Changed password for user: "${result.data.changePassword.NAME}"!`);
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete user?')) return;
    const query = `mutation Mutation($id: Int!) {
        deleteUser(ID: $id) {
          ID
          NAME
          PRIVILEGE
        }
      }`;
    const variables = {
        id: parseInt(id)
    };

    const result = await fetchGQL(query, variables);
    console.log(result);
    alert(`User "${result.data.deleteUser.NAME}" Deleted from database!`);
}



document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById("user").value;
    const password = document.getElementById("password").value;
    const rights = document.getElementById("admin").checked;

    const query = `mutation Mutation($name: String, $password: String, $rights: Boolean) {
        addUser(NAME: $name, PASSWORD: $password, rights: $rights) {
          ID
          NAME
          PRIVILEGE
        }
      }`;

    const variables = {
        "name": username,
        "password": password,
        "rights": rights
    };
    console.log(query);
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
            if (data.data.addUser.ID) {
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