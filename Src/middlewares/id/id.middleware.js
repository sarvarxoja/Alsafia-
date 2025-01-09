function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
}

export default {
  checkId(req, res, next) {
    try {
      let { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Id is required" });
      }

      if (!isValidUUID(id)) {
        return res.status(400).json({ error: "Invalid UUID format" });
      }

      next();
    } catch (error) {
      console.log(error);
    }
  },
};
