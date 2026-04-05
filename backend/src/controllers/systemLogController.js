const systemLogController = {
  getAll: async (req, res, next) => {
    try { res.status(200).json({ status: "success", data: [] }); } catch (error) { next(error); }
  },
  getById: async (req, res, next) => {
    try { res.status(200).json({ status: "success", data: {} }); } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try { res.status(201).json({ status: "success", data: {} }); } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try { res.status(200).json({ status: "success", data: {} }); } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try { res.status(200).json({ status: "success", message: "Deleted" }); } catch (error) { next(error); }
  }
};

module.exports = systemLogController;
