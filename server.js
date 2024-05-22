const express = require('express');
const notes = require('./db/db.json'); 
const fs = require('fs')
const path = require('path');
const uuid = require('./helpers/uuid');
const { error } = require('console');

const PORT = process.env.Port || 3001;
const app = express();

//these are the middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//this directs you to the notes.html file when /notes is added 
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
})

//this will get the desired notes that you need
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err,data) => {
    if(err){
      throw new Error(err);
    };
    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Failed to parse JSON data' });
    }
  });
})


app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request recived to add a new note`);

  const {title, text} = req.body

  if(title && text){
    const newNote = {
      title,
      text,
      id: uuid(),
    };
  
   //this is reading the file that containes tha notes
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if(err){
      throw new Error(err);
    };

    //this is pushing the new notes into the db.json file
    const notes = data ? JSON.parse(data) : [];

     notes.push(newNote);

     //convert data into a string so we cann save it
     const noteString = JSON.stringify(notes);

     fs.writeFile('./db/db.json', noteString, (err) => 
      err
      ? console.error(err)
      : console.log (`Note for ${newNote.title} has been written in the db.json file`)
     )
  })
  // this send a response to the post request
  const response = {
    status: 'success',
    body: newNote,
  };

  console.log(response);
  res.status(201).json(response);
 }else {
  res.status(500).json('Error in posting review');
}
 
})

app.delete('/api/notes/:id', (req, res) => {
  //this gets the id of the note 
   let id = req.params.id; 
   //This looks through the elements in the notes and finds the matching id
   const noteToDelete = notes.find(el => el.id === id);
   //this tells the index of the note
   const index = notes.indexOf(noteToDelete);
 
   //splice deletes the note
   notes.splice(index, 1);
  
   fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
    res.status(200).json({ 
      status: 'success',
      data: {
        note: noteToDelete
      }
    })
   })
  
})
 
//this directs you to the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(PORT, () =>
  console.log(`App listening at ${PORT}`)
);