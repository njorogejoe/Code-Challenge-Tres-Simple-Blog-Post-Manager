document.addEventListener("DOMContentLoaded", main);

function main() {
    displayPosts();
    addNewPostListener();
}

function displayPosts() {
    fetch("http://localhost:3000/posts")
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById("post-list");
            postList.innerHTML = "";
            posts.forEach(post => {
                const postItem = document.createElement("div");
                postItem.textContent = post.title;
                postItem.className = "cursor-pointer p-2 border-b hover:bg-gray-200";
                postItem.addEventListener("click", () => handlePostClick(post.id));
                postList.appendChild(postItem);
            });
        });
}

function handlePostClick(id) {
    fetch(`http://localhost:3000/posts/${id}`)
        .then(response => response.json())
        .then(post => {
            const postDetail = document.getElementById("post-detail");
            postDetail.innerHTML = `<h2 class="text-xl font-bold">${post.title}</h2><p>${post.content}</p><p class="text-gray-600">By: ${post.author}</p>`;
            // Add Edit and Delete buttons
            postDetail.innerHTML += `<button id="edit-button" class="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md">Edit</button>`;
            postDetail.innerHTML += `<button id="delete-button" class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Delete</button>`;
            document.getElementById("edit-button").addEventListener("click", () => showEditForm(post));
            document.getElementById("delete-button").addEventListener("click", () => deletePost(id));
        });
}

function addNewPostListener() {
    const form = document.getElementById("new-post-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const title = document.getElementById("new-title").value;
        const content = document.getElementById("new-content").value;
        const author = document.getElementById("new-author").value;
        const newPost = { title, content, author };
        // Add to the DOM
        const postList = document.getElementById("post-list");
        const postItem = document.createElement("div");
        postItem.textContent = title;
        postItem.className = "cursor-pointer p-2 border-b hover:bg-gray-200";
        postList.appendChild(postItem);
        // Clear form
        form.reset();
    });
}

function showEditForm(post) {
    const editForm = document.getElementById("edit-post-form");
    editForm.classList.remove("hidden");
    document.getElementById("edit-title").value = post.title;
    document.getElementById("edit-content").value = post.content;
    editForm.onsubmit = (event) => {
        event.preventDefault();
        updatePost(post.id);
    };
}

function updatePost(id) {
    const title = document.getElementById("edit-title").value;
    const content = document.getElementById("edit-content").value;
    const updatedPost = { title, content };
    fetch(`http://localhost:3000/posts/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedPost)
    }).then(() => {
        displayPosts();
        document.getElementById("edit-post-form").classList.add("hidden");
    });
}

function deletePost(id) {
    fetch(`http://localhost:3000/posts/${id}`, {
        method: "DELETE"
    }).then(() => {
        displayPosts();
        document.getElementById("post-detail").innerHTML = "";
    });
}
