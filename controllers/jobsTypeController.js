const JobType = require('../models/jobTypeModel'); // Import JobType Model
const Job = require('../models/jobModel');  // Import Job model
const ErrorResponse = require('../utils/errorResponse');

//create job category
exports.createJobType = async (req, res, next) => {
    try {
        const jobT = await JobType.create({
            jobTypeName: req.body.jobTypeName,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            jobT
        })
    } catch (error) {
        next(error);
    }
}


//all jobs category
exports.allJobsType = async (req, res, next) => {
    try {
        const jobT = await JobType.find();
        res.status(200).json({
            success: true,
            jobT
        })
    } catch (error) {
        next(error);
    }
}

//update job type
exports.updateJobType = async (req, res, next) => {
    try {
        const jobT = await JobType.findByIdAndUpdate(req.params.type_id, req.body, { new: true });
        res.status(200).json({
            success: true,
            jobT
        })
    } catch (error) {
        next(error);
    }
}


exports.deleteJobType = async (req, res, next) => {
    try {
        const jobTypeId = req.params.type_id;
        console.log("Attempting to delete JobType with ID:", jobTypeId);

        // Check if the job type exists
        const jobType = await JobType.findById(jobTypeId);
        if (!jobType) {
            console.log("JobType not found");
            return next(new ErrorResponse(`Job type with ID ${jobTypeId} not found`, 404));
        }

        // Check if there are any jobs using this job type
        const jobsUsingJobType = await Job.find({ jobType: jobTypeId });
        console.log("Jobs using this JobType:", jobsUsingJobType);

        if (jobsUsingJobType.length > 0) {
            console.log("Cannot delete job type - jobs are using it");
            return next(new ErrorResponse(`Cannot delete job type as it is being used by ${jobsUsingJobType.length} job(s)`, 400));
        }

        // If no jobs are using the job type, delete it
        console.log("Deleting JobType:", jobType);
        await JobType.findByIdAndDelete(jobTypeId);

        res.status(200).json({
            success: true,
            message: "Job type deleted successfully"
        });

    } catch (error) {
        console.error("Error during deletion:", error);
        next(error);
    }
};
