const editValid = (payloadData) => {
  const editAllowedFields = [
    "firstName",
    "lastName",
    "age",
    "skills",
    "photoUrl",
    "about",
  ];
  const notEditableFields = Object.keys(payloadData).filter(
    (field) => !editAllowedFields.includes(field)
  );

  return notEditableFields;
};

module.exports = editValid;
