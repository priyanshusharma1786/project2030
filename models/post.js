const Post = (topic, message, by) => {
    return {
        id: Date.now(),
        Topic: topic,
        Message: message,
        "Posted By": by,
        postedAt: new Date().toUTCString()
    }
}
module.exports = Post
