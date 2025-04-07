(() => {
  // Define an array of blog post objects
  let blogPosts = [
    {
      "_id": "661985181a01f8d70f31fa0d",
      "id": 1712948504220,
      "Topic": "Networking",
      "Message": "This is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is networkingThis is ne",
      "Posted By": null,
      "postedAt": "Fri, 12 Apr 2024 19:01:44 GMT"
    },
    {
      "_id": "661985df1a01f8d70f31fa1b",
      "id": 1712948703277,
      "Topic": "Security",
      "Message": "This is security This is security This is security This is security This is security This is security This is security This is security This is security This is security This is security This is security This is security This is security This is security This is security This is ",
      "Posted By": null,
      "postedAt": "Fri, 12 Apr 2024 19:05:03 GMT"
    }
  ]

  const showblogPost = (e) => {
    e.preventDefault()
    document.getElementById('blogPost').style.display = 'block'
    console.log(e.target)
    console.log(blogPosts)

    const post = (blogPosts.filter(post => post.id === parseInt(e.target.getAttribute('href').split('/').pop())))[0]
    console.log(post)
    document.getElementById('postTitle').textContent = post.Topic
    document.getElementById('postDate').textContent = post.postedAt
    document.getElementById('postMessage').textContent = post.Message
    document.getElementById('postAuthor').textContent = post["Posted By"]

  }

  // Function to dynamically generate blog cards
  const generateBlogCards = async () => {
    const blogSection = document.getElementById("blogCardsRow");

    // Iterate over the blogPosts array
    blogPosts.forEach(post => {
      // Create card element
      const card = document.createElement("div");
      card.className = "col-lg-4 col-md-6 mb-4";

      // Create card content
      const cardContent = `
        <div class="card">
          
          <div class="card-body">
            <h5 class="card-title">${post.Topic}</h5>
            <p class="card-text">${post.Message.slice(0, 100) + "..."}</p>
            <a href="/posts/${post.id}" data-set-id=${post.id} class="btn btn-primary readbtns">Read More</a>
          </div>
        </div>
      `;

      // Set card content
      card.innerHTML = cardContent;

      // Append card to the blog section
      blogSection.appendChild(card);
    });
  }

  const getJsonData = async (url) => {
    try {
      console.info('getJsonData', url)
      const response = await fetch(url)
      console.info(response)
      const data = response.json()
      return data
    } catch (err) {
      console.error(err)
    }
  }

  const getPosts = async () => {
    const posts = await getJsonData('/posts')
    console.log("Posts: ", posts)
    blogPosts = posts
  }


  // Call the function to generate blog cards when the page loads
  document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('blogPost').style.display = 'none'
    await getPosts();

    await generateBlogCards()
    const readbtns = document.getElementsByClassName('readbtns')
    for(let i = 0; i < readbtns.length; i++) {
      readbtns[i].addEventListener('click', showblogPost)
    }
  })

})()