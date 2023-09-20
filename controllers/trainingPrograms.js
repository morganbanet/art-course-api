const trainingPrograms = require('../routes/trainingPrograms');

// @desc        Get all training programs
// @route       GET /api/v1/training-programs
// @access      Public
exports.getTrainingPrograms = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: 'Get all training programs' });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc        Get single training program
// @route       GET /api/v1/training-programs/:id
// @access      Public
exports.getTrainingProgram = async (req, res, next) => {
  try {
    res
      .status(200)
      .json({ success: true, data: 'Get single training program' });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc        Create new training program
// @route       POST /api/v1/training-program
// @access      Private
exports.createTrainingProgram = async (req, res, next) => {
  try {
    res
      .status(201)
      .json({ success: true, data: 'Create new training program' });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc        Update a training program
// @route       PUT /api/v1/training-program/:id
// @access      Private
exports.updateTrainingProgram = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: 'Update a training program' });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc        Delete a training program
// @route       DELETE /api/v1/training-program/:id
// @access      Private
exports.deleteTrainingProgram = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: 'Delete a training program' });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
