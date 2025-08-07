import axios from 'axios';

export const getAllPosts = (req, res) => {
    axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
        res.status(200).json(response.data);
    });
    console.log('--> getAllPosts');
};

export const getPostById = (req, res) => {
    const { id } = req.params;
    const query = req.query;
    console.log('--------------->', query.param);
    axios
        .get(`https://jsonplaceholder.typicode.com/posts/?userId=${id}`)
        .then((response) => {
            res.status(200).json(response.data);
        });
    console.log('--> getPostById ' + id);
};

export const addPost = (req, res) => {
    console.log('->', 'addPost');
    console.log(req.query, req.query.param);
    res.status(200).json({ errorCode: 'OK' });
};
