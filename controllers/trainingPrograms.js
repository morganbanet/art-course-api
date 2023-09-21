const TrainingProgram = require('../models/TraningProgram');

// @desc        Get all training programs
// @route       GET /api/v1/training-programs
// @access      Public
exports.getTrainingPrograms = async (req, res, next) => {
  try {
    const trainingPrograms = await TrainingProgram.find();

    if (!trainingPrograms) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: trainingPrograms });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc        Get single training program
// @route       GET /api/v1/training-programs/:id
// @access      Public
exports.getTrainingProgram = async (req, res, next) => {
  try {
    const trainingProgram = await TrainingProgram.findById(req.params.id);

    if (!trainingProgram) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: trainingProgram });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc        Create new training program
// @route       POST /api/v1/training-program
// @access      Private
exports.createTrainingProgram = async (req, res, next) => {
  try {
    const trainingProgram = await TrainingProgram.create(req.body);

    if (!trainingProgram) {
      return res.status(400).json({ success: false });
    }

    res.status(201).json({ success: true, data: trainingProgram });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc        Update a training program
// @route       PUT /api/v1/training-program/:id
// @access      Private
exports.updateTrainingProgram = async (req, res, next) => {
  try {
    const trainingProgram = await TrainingProgram.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!trainingProgram) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: trainingProgram });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc        Delete a training program
// @route       DELETE /api/v1/training-program/:id
// @access      Private
exports.deleteTrainingProgram = async (req, res, next) => {
  try {
    const trainingProgram = await TrainingProgram.findByIdAndDelete(
      req.params.id
    );

    if (!trainingProgram) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
