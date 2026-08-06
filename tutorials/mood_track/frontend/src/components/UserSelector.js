function UserSelector({ users, selectedUser, onUserChange }) {
  return (
    <div className="card">
      <h2>Select User</h2>

      <select
        value={selectedUser}
        onChange={(e) => onUserChange(e.target.value)}
      >
        {users.map((user) => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserSelector;
