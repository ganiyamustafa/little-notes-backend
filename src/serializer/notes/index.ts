const noteSerializer = ({
  _id,
  title,
  description,
  isPinned,
  isArchived,
  user,
  createdAt,
  updatedAt,
}) => ({
  _id,
  title,
  description,
  isPinned,
  isArchived,
  user,
  createdAt,
  updatedAt,
});
  
export default noteSerializer
  