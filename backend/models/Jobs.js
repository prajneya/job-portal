const mongoose = require('mongoose');
const schema = mongoose.Schema;

// Create Schema
const jobSchema = new schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	applications: {
		type: Number,
		required: true
	},
	positions: {
		type: Number,
		required: true
	},
	posting: {
		type: Date,
		default: Date.now
	},
	currApplications: {
		type: Number,
		default: 0
	},
	active: {
		type: Boolean,
		default: true
	},
	deadline: {
		type: Date,
		required: true
	},
	skillset: {
		type: [String]
	},
	jobType: {
		type: Number,
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	salary: {
		type: Number,
		required: true
	},
	rating: {
		type: Number,
		default: -1
	},
	ratedBy: {
		type: Number,
		default: 0
	},
	image: {
		type: String,
		default: "astronaut.png"
	}
})

// Create Skill Schema
const skillSchema = new schema({
	value: {
		type: Number,
		required: true
	},
	label: {
		type: String,
		required: true
	}
})

module.exports = {
	Job: mongoose.model('jobs', jobSchema),
	Skill: mongoose.model('skills', skillSchema)
}