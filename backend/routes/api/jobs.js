const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load Job Model
const Job = require('../../models/Jobs').Job;
const Skill = require('../../models/Jobs').Skill;

// @route   POST api/jobs/add
// @desc    Add Job
// @access  Public
router.post("/add", (req, res) => {

  const newJob = new Job({
    title: req.body.title,
    name: req.body.name,
    email: req.body.email,
    applications: req.body.applications,
    positions: req.body.positions,
    deadline: req.body.deadline,
    skillset: req.body.skillset,
    jobType: req.body.jobType,
    duration: req.body.duration,
    description: req.body.description,
    salary: req.body.salary
  });

  newJob
    .save()
    .then(job => res.json(job))
    .catch(err => console.log(err));
});

// @route   GET api/jobs/getAll
// @desc    Get all Jobs
// @access  Public
router.get("/getAll", (req, res) => {

  const date = new Date();
  Job.find({active: true, deadline: { $gt: date }})
    .sort({posting: -1})
    .then(jobs => res.json(jobs))
    .catch(err => console.log(err));
});

// @route   POST api/jobs/getMyJobs
// @desc    Get Jobs of a recruiter
// @access  Public
router.post("/getMyJobs", (req, res) => {

  const date = new Date();
  Job.find({active: true, email: req.body.email, deadline: { $gt: date }})
    .sort({posting: -1})
    .then(jobs => res.json(jobs))
    .catch(err => console.log(err));
});

// @route   POST api/jobs/searchJobs
// @desc    Fuzzy Search on Jobs
// @access  Public
router.post("/searchJobs", (req, res) => {
    const pipeline = [
                      {
                        '$match': {
                          '$or': [
                            {
                              'title': {
                                '$regex': req.body.query, 
                                '$options': 'i'
                              }
                            }
                          ]
                        }
                      }
                    ];

    Job.aggregate(pipeline)
        .then(jobs => res.json(jobs))
        .catch(err => console.log(err));
});

// @route   GET api/jobs/getSkills
// @desc    Get all Skills
// @access  Public
router.get("/getSkills", (req, res) => {

  Skill.find()
    .then(skills => res.json(skills))
    .catch(err => console.log(err));
});

// @route   POST api/jobs/viewJob
// @desc    View particular Job Details
// @access  Public
router.post("/viewJob", async (req, res) => {

  job = await Job.findById(req.body.id);
  applications = await Application.find({jobId: req.body.id});
    
  var len = application.length;
  var data = {
    job: job,
    applications: []
  };

  for(var i = 0; i<len; i++){
    var temp_data = {};
    temp_data['application'] = application[i];
    data['applications'].push(temp_data);
  }

  res.json(data);

});

module.exports = router;