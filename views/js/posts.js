// using IIFE
(() => {

    /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
    const getBlobData = async (url) => {
        const response = await fetch(url)
        const imageBlob = await response.blob()
        return imageBlob
    }
    const getJsonData = async (url) => {
        try {
            console.info('getJsonData', url)
            const response = await fetch(url)
            console.info(response)
            const data = await response.json()
            return data
        } catch (err) {
            console.error(err)
        }
    }

    /**----------------------------------------------------
    Utility functions
    -----------------------------------------------------*/
    const getPosts = () => {
        console.info("Getting posts")
        fetch('/posts')
            .then(response => response.json())
            .then(posts => displayPosts(posts))
            .catch(err => console.error(err))
    }

    const deletePost = async (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        const postId = event.target.getAttribute('href').split('/').pop(); // Extract post ID from href
        try {
            const response = await fetch(`/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                // Post deleted successfully
                // You can update UI or reload posts here
                console.log('Post deleted successfully');
            } else {
                // Error deleting post
                console.error('Error deleting post:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const displayPosts = async () => {
        const posts = await getJsonData('/posts');
        if (posts.length > 0) {
            console.info("Posts:", posts);
            console.info("Displaying posts");
            let header = document.querySelector('#header');
            let thead = document.querySelector('thead');
            let tbody = document.querySelector('tbody');
            const keys = Object.keys(posts[0]);
            let columns = Object.keys(posts[0]);
            let tr = document.createElement('tr');
            tr.setAttribute('class', 'text-center h3');
            columns.forEach((column, idx) => {
                if (idx !== 0) {
                    let th = document.createElement('th');
                    th.textContent = column === "Message" ? "Message Snippet" : column;
                    tr.appendChild(th);
                }
            });
            thead.appendChild(tr);
            for (let i = 0; i < posts.length; i++) {
                console.info(`i=${i}`, posts[i]);
                let tr = document.createElement('tr');
                let rows = [];
                columns.forEach(column => {
                    rows.push(document.createElement('td'));
                });
                for (let j = 1; j < rows.length; ++j) {
                    if (columns[j] === "Message") rows[j].innerHTML = `${posts[i][columns[j]].slice(1, 10)} ...`;
                    else rows[j].innerHTML = posts[i][columns[j]];
                    tr.appendChild(rows[j]);
                }
                // Adding delete button to last column
                let deleteButtonCell = document.createElement('td');
                let deleteButton = document.createElement('a');
                deleteButton.setAttribute('href', '/posts/' + posts[i][columns[1]]);
                deleteButton.setAttribute('data-post-id', posts[i][columns[1]]);
                deleteButton.setAttribute('class', 'btn btn-danger delete-post-btn');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', deletePost);
                deleteButtonCell.appendChild(deleteButton);
                tr.appendChild(deleteButtonCell);
                tbody.appendChild(tr);
            }
        } else {
            console.info(`Posts collection is empty`);
        }
    };


    window.onload = () => {
        displayPosts()
        //getGeolocation()

    }
})()
