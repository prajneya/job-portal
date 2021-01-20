const mongoose = require('mongoose');
const schema = mongoose.Schema;

// Create User Schema
const userSchema = new schema({
	userType: {
		type: Number,
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
	password: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

// Create Applicant Details Schema
const applicantDetailsSchema = new schema({
	_id: { 
		type: schema.Types.ObjectId, 
		ref: 'User' 
	},
	education: [
		{
			name: String,
			startYear: String,
			endYear: String
		}
	],
	skills: [String],
	resume: String,
	profilePic: String,
	rating: Number,
	ratedBy: [String]
})

// Create Recruiter Details Schema
const recruiterDetailsSchema = new schema({
	_id: { 
		type: schema.Types.ObjectId, 
		ref: 'User' 
	},
	contactNum: String,
	bio: String,
	profilePic: String
})


module.exports = {
	User: mongoose.model('users', userSchema),
	applicantDetails: mongoose.model('applicantDetails', applicantDetailsSchema),
	recruiterDetails: mongoose.model('recruiterDetails', recruiterDetailsSchema)
}