const express= require("express");
const path= require("path");
const app=express();
const port=8080;

//EXPRESS SPECIFIC
app.use('/static',express.static('static'))//serving static files
app.use(express.urlencoded({extended:true}))//get data from website

//PUG SPECIFIC
app.set('view engine','pug');//set the templeate engine as pug
app.set('views',path.join(__dirname,'views'));//set the views directory

//ENDPOINTS
app.get('/', (req, res)=>{
    const params = {}
    res.status(200).render('index.pug', params);
});
app.get('/tic_tac_toe', (req, res)=>{
    const params = {}
    res.status(200).render('tic_tac_toe.pug', params);
});
app.get('/hangman', (req, res)=>{
    const params = {}
    res.status(200).render('hangman.pug', params);
});
app.get('/rock_paper_scissors', (req, res)=>{
    const params = {}
    res.status(200).render('rock_paper_scissors.pug', params);
});
  
//STARTING THE SEVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});


