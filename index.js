// This file sets up basic CRUD functionality for comments

const express = require('express');
const app = express();
const path = require('path');

// method override lets us use additional http request verbs with html forms
const methodOverride = require('method-override');
app.use(methodOverride('_method'))

// uuid is an npm package that will create a unique identifier whenever it is called. v
const { v4: uuid} = require('uuid'); 



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

let comments = [
  {
    id: uuid(),
    username: "Todd",
    comment: "ive forgotten how to chew!"
  },
  {
    id: uuid(),
    username: "Antoinette",
    comment: "Take me back to the 60's"
  },
  {
    id: uuid(),
    username: "runMan8",
    comment: "this song slaps!"
  },
  {
    id: uuid(),
    username: "TweaselKing",
    comment: "send em to the ice cream shop already"
  }

]

app.listen(3000, ()=>{
  console.log('Listening');
})

// passing the comments array to a get request for rendering in the comments template.
app.get('/comments', (req, res)=>{
  res.render('comments/index', { comments })
})

// this brings up the page where we can set a new comment
app.get('/comments/new', (req, res) =>{
  res.render('comments/new');
})


//Create: takes data from a form and extracts it so that we can add a new comment to our array.
app.post('/comments', (req, res) =>{
  const {username, comment} = req.body;
  // passing id: uuid() to the request will set a random identifier for each new comment.
  comments.push({username, comment, id: uuid() });
  res.redirect('/comments');
})


//Read: this is used to get a comment via a unique id that is set on each comment object.
app.get('/comments/:id', (req, res) => {
  const { id } = req.params;
  const comment = comments.find( (c) => c.id === id);
  res.render( 'comments/show', {id, comment});
})

// alternatively
// app.get('/comments/show', (req, res) => {
//   const { idNum } = req.query;
//   const comment = comments.find( (c) => c.id === parseInt(idNum));
//   res.render( 'comments/show', {idNum, comment});
// })

// // this works with a number input and lets us search for an id via a specific id requested by user.
// app.get('/comments', (req, res) => {
//   const {idNum} = req.body;
//   const comment = comments.find( (c) => c.id === parseInt(idNum));
//   res.redirect('comments/show');
// })

// app.get('/comments/new', (req, res) => {
//   const {idNum} = req.body;
//   const comment = comments.find( (c) => c.id === parseInt(idNum));
//   res.redirect('comments/show');
// })

// update
app.get('/comments/:id/edit', (req, res)=>{
  const { id } = req.params;
  const comment = comments.find( (c) => c.id === id);
  res.render('comments/edit', {comment, id});
})

app.patch('/comments/:id', (req, res)=>{
  const { id } = req.params;
  const editedComment = req.body.comment
  const originalComment = comments.find( (c) => c.id === id);
  originalComment.comment = editedComment;
  res.redirect('/comments');
})

// delete searches by id and creates a copy of all the comments in the array that aren't matching our current id. We set the old array to the new one and now we have an updated array without the id we just filtered out.
app.delete('/comments/:id', (req, res)=>{
  const { id } = req.params;
  comments = comments.filter( (c) => c.id !== id );
  res.redirect('/comments');
})


