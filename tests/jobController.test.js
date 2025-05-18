// tests/jobController.test.js
const jobController = require('../controllers/jobController');
const Job = require('../models/jobModel');

jest.mock('../models/jobModel');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  res.send = jest.fn();
  return res;
};

describe('Job Controller', () => {
  const req = {
    body: { company: 'Google', position: 'Dev' },
    user: { _id: 'user123' },
    params: { id: 'job123' }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createJob - success', async () => {
    Job.create.mockResolvedValue({ ...req.body, user: req.user._id });
    const res = mockRes();

    await jobController.createJob(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ...req.body, user: req.user._id });
  });

  test('getJobs - success', async () => {
    Job.find.mockResolvedValue([{ company: 'Google', user: req.user._id }]);
    const res = mockRes();

    await jobController.getJobs(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test('updateJob - success', async () => {
    Job.findByIdAndUpdate.mockResolvedValue({ position: 'Updated Dev' });
    const res = mockRes();

    await jobController.updateJob(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('deleteJob - success', async () => {
    Job.findByIdAndDelete.mockResolvedValue();
    const res = mockRes();

    await jobController.deleteJob(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
