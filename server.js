const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const baseUrl = "https://www.roblox.com/users/";

async function getFriends(userId) {
    try {
        const url = `https://friends.roblox.com/v1/users/${userId}/friends`;
        const response = await axios.get(url);
        return response.data.data || [];
    } catch (error) {
        console.error(`Failed to retrieve friends list for user ${userId}: ${error.response?.status || error.message}`);
        return [];
    }
}

function generateProfileLinks(friends) {
    return friends.map(friend => `${baseUrl}${friend.id}/profile`);
}

async function findLinks(userId, keywords) {
    const queue = [userId];
    const visited = new Set();
    const allLinks = new Set();

    while (queue.length > 0 && allLinks.size < 1000) {
        const currentUserId = queue.shift();
        if (visited.has(currentUserId)) continue;

        visited.add(currentUserId);
        const friends = await getFriends(currentUserId);
        const links = generateProfileLinks(friends);

        links.forEach(link => {
            if (keywords.some(keyword => link.toLowerCase().includes(keyword.toLowerCase())) && !allLinks.has(link)) {
                allLinks.add(link);
            }
        });

        const friendIds = friends.map(friend => friend.id);
        queue.push(...friendIds);
    }

    return Array.from(allLinks);
}

app.post('/search', async (req, res) => {
    const { user_id, keywords } = req.body;
    const links = await findLinks(user_id, keywords);
    res.json(links.slice(0, 1000));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
