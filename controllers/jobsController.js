const Job = require('../models/jobModel');
const JobType = require('../models/jobTypeModel');
const ErrorResponse = require('../utils/errorResponse');

//create job
exports.createJob = async (req, res, next) => {
    try {
        const job = await Job.create({
            title: req.body.title,
            description: req.body.description,
            salary: req.body.salary,
            location: req.body.location,
            jobType: req.body.jobType,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


//single job
exports.singleJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


//update job by id.
exports.updateJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.job_id, req.body, { new: true }).populate('jobType', 'jobTypeName').populate('user', 'firstName lastName');
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


// show jobs
exports.showJobs = async (req, res, next) => {
    try {
        const { keyword, cat, location, pageNumber = 1 } = req.query;
        const pageSize = 10; // Adjust page size as needed

        // Build the filter object dynamically
        let filter = {};

        if (keyword) {
            filter.title = { $regex: keyword, $options: 'i' }; // Case-insensitive search
        }
        if (cat) {
            filter.jobType = cat;  // assuming jobType is an ObjectId reference
        }
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        // Query with pagination
        const jobs = await Job.find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .populate('jobType');  // Populating jobType to get full details

        const totalJobs = await Job.countDocuments(filter);  // Get total number of jobs for pagination

        res.status(200).json({
            success: true,
            jobs,
            totalJobs,
            totalPages: Math.ceil(totalJobs / pageSize),
            currentPage: pageNumber
        });

    } catch (error) {
        next(error);
    }
};




