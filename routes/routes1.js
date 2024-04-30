import express from 'express';
import user from '../models/data1.js'
import rec from '../models/recdata.js'
import job from '../models/jobpost.js'

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('home');
});



router.get('/Login', async (req, res) => {
    res.render('Login');
});
router.post('/Login', async (req, res) => {
    const name=req.body.name;
    const password=req.body.password;
    try {
        // Retrieve user from the database based on email
        const u = await user.findOne({ name });

        if (!u) {
            // User not found
            return res.status(404).send("User not found");
        }

        // Validate password
        //const isPasswordValid = await u.comparePassword(password);

        if ((password)!=u.password) {
            // Incorrect password
            return res.status(401).send("Incorrect password"+u.password);
        }

        // Password is correct, generate authentication token or session
        // For simplicity, let's assume the user is authenticated with a session
       // req.session.u = u; // Set user object in session

        // Redirect to dashboard or profile page
        req.session.isLoggedIn = true;
        req.session.username=u.name;
        res.redirect('/jobspage');
    } catch (error) {
        // Handle any errors
        console.error("Error logging in:", error);
        res.status(500).send("Internal server error");
    }
});


router.get('/Signup', async (req, res) => {
    res.render('Signup');
});

router.post('/Signup', async (req, res) => {
    console.log(req.body);
    const { name, email, password, retype } = req.body;

    // Check if required fields are provided
    if (!name || !email || !password || !retype) {
        return res.status(400).send("Name, email, password, and retype are required");
    }

    // Check if password and retype match
    if (password !== retype) {
        return res.status(400).send("Passwords do not match");
    }

    // Validation passed, create a new user
    const add = new user({
        name,
        email,
        password
    });
 
    try {
        const savedUser = await add.save();
        res.redirect('/Login');
    } catch (err) {
        res.status(400).send(err);
    }

});

router.get('/recSignup', async (req, res) => {
    res.render('recSignup');
});

router.post('/recSignup', async (req, res) => {
    console.log(req.body);
    const { companyname, companyemail, password, retype } = req.body;

    // Check if required fields are provided
    if (!companyname || !companyemail || !password || !retype) {
        return res.status(400).send("Name, email, password, and retype are required");
    }

    // Check if password and retype match
    if (password !== retype) {
        return res.status(400).send("Passwords do not match");
    }

    // Validation passed, create a new user
    const add = new rec({
        companyname,
        companyemail,
        password
    });
 
    try {
        const savedUser = await add.save();
        res.redirect("/recLogin");
    } catch (err) {
        res.status(400).send(err);
    }

});


router.get('/recLogin', async (req, res) => {
    res.render('recLogin');
});
router.post('/recLogin', async (req, res) => {
    const {companyname,password}=req.body;
    try {
        // Retrieve user from the database based on email
        const u = await rec.findOne({ companyname });

        if (!u) {
            // User not found
            return res.status(404).send("User not found");
        }

        // Validate password
        //const isPasswordValid = await u.comparePassword(password);

        if (password!=u.password) {
            // Incorrect password
            return res.status(401).send("Incorrect password"+u);
        }

        // Password is correct, generate authentication token or session
        // For simplicity, let's assume the user is authenticated with a session
       // req.session.u = u; // Set user object in session

        // Redirect to dashboard or profile page
        req.session.isLoggedIn = true;
        req.session.recusername=u.companyname;
        res.redirect('/recdashboard/'+ req.session.recusername);
    } catch (error) {
        // Handle any errors
        console.error("Error logging in:", error);
        res.status(500).send("Internal server error");
    }
});

router.get('/recdashboard/:companyname', async (req, res) => {
    if(!req.session.recusername){
        res.redirect('/recLogin')
    }
    else{
    const comapanyName=req.session.recusername;
    const recData= await rec.findOne({ companyname:comapanyName }).lean();
    const jobs=await job.find({ companyname:comapanyName }).lean();
    console.log(jobs);

    res.render('recdashboard', { recData: recData.companyname, jobs: jobs });
    }

});

router.get('/addpost', async (req, res) => {
    if(!req.session.recusername){
        res.redirect('/recLogin')
    }
    else{
        res.render('addpost');
    }
    });

router.post('/addpost', async (req, res) => {
    if(!req.session.recusername){
        res.redirect('/recLogin')
    }
    else{
        const companyname=req.session.recusername
        const {name, description, Lastapplicationdate}=req.body;
        const post=new job({
            name,
            companyname,
            description,
            Lastapplicationdate
        });
        const addedpost=await post.save();
        res.redirect('/recdashboard/'+req.session.recusername)
    }
});

router.get('/logout', async (req, res) => {
  
    if (req.session.username) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                
                res.redirect('/Login');
            }
        });
    } else if (req.session.recusername) {
      
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
            
                res.redirect('/recLogin');
            }
        });
    } else {
        
        res.redirect('/');
    }
});

router.get('/jobspage', async (req,res)=>{
    if(req.session.username){
        const jobs=await job.find().lean();
        res.render('jobspage',{ name: req.session.username , jobs:jobs});
    }
    else{
        res.redirect('/Login');
    }

})

router.get('/jobspage/:name', async (req,res)=>{
    if(req.session.username){
        const jobId=req.params.name;
        const jobs=await job.findById(jobId).lean()
        res.render('singlejob',{ jobs:jobs});
    }
    else{
        res.redirect('/Login');
    }

})

router.post('/jobspage/:name',async (req,res)=>{
    console.log(req.params.name)
    if(req.session.username){
        const use= req.session.username
        const jobId=req.params.name;
        const jobs=await job.findById(jobId).lean()
        jobs.candidatesApplied.push(req.session.username);
        await jobs.save();
        const u=await user.findOne({use}).lean();
        u.applied.push(jobId);
        await u.save();
        res.redirect('/jobspage');

    }
    else{
        res.redirect('/Login');
    }
})

router.get("/userProfile/:name", async(req,res)=>{
    if(req.session.username){
        const seeker=req.params.name;
        const username=await user.find({seeker}).lean()
        res.render('userProfile',{username: username});
    }
    else{
        res.redirect('/Login');
    }

})
export default router;