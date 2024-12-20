const filterReqBody = (req, ...elements) => {
  let retObject = JSON.parse(JSON.stringify(req.body)); //deep clone the input object
  const objKeys = Object.keys(retObject);
  objKeys.forEach((el) => {
    if (!elements.includes(el)) {
      delete retObject[el];
    }
  });
  return retObject;
};
module.exports = filterReqBody;
