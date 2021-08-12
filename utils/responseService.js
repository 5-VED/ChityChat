
//Responds when error occurs
module.exports.ReE = (res, err, code) => {
  return res.status(code).json({ error: { message: err, code: code } });
};

//Responds when error doesnot occurs
module.exports.ReS = (res, data) => {
  return res.json({ result: data, error: null });
};
