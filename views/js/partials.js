// using IIFE
(() => {    
    const setCopyrightYear = () => {
        document.querySelector('footer>kbd>span').innerHTML = new Date().getFullYear()
    }
    const setHead = () => {
        let head = `<meta charset="UTF-8" />\n
        <meta http-equiv="X-UA-Compatible"/>\n
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n
        <title>SmartBlog</title>\n
        <link rel="stylesheet" href="css/bootstrap.min.css" />\n
        <link rel="shortcut icon" href="img/logo.png" type="image/x-icon" />\n`
        document.querySelector('head').innerHTML = head
    }
    const setNavbar = () => {
        let navbar = `<nav class="navbar navbar-expand-lg navbar-primary ">
        <div class="container-fluid" role="banner">
          <img src="img/logo.png" class="img-responsive rrounded me-2" alt="Bootstrap Logo" width="50" />
          <a class="navbar-brand" href="#">SmartBlog</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/home">Home</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Posts
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
      
                  <li>
                    <a class="dropdown-item" href="posts.html">Your Posts</a>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <a class="dropdown-item" href="/postMessage">Add Posts  </a>
                  </li>
                 
                </ul>
              </li>
              <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/ai">Chat AI</a>
            </li>
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/about">About Us</a>
              </li>
            </ul>
            
              <div class="btn-group" role="group" aria-label="Registration and Login"> <a href="/register" class="btn btn-warning" >
                Register
              </a>
              <a href="/login" class="btn btn-primary" >
                Log in
              </a></div>
              <a href="/logout" class="btn btn-danger">Log out </a>
              
            
          </div>
        </div>
      </nav>`
        document.querySelector("header#header").innerHTML = navbar
    }
    const setFooter = () => {
        let footer = `<footer><kbd> &copy; <span></span> Priyanshu. All Rights Reserved.</kbd></footer>`
        document.querySelector("div#footer").innerHTML = footer
    }
    document.addEventListener("DOMContentLoaded", () => {
        setHead()
        setNavbar()
        setFooter()
        setCopyrightYear()     

    })
})()