import React, { useState } from "react";
import axios from "axios";
import "./settings.css";

const Settings = () => {
  const [websiteName, setWebsiteName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleWebsiteUpdate = async () => {
    try {
      const response = await axios.post("/api/settings/updateWebsite", {
        websiteName,
        contactEmail,
      });
      alert(response.data.message);
    } catch (error) {
      alert("Failed to update website settings");
    }
  };

  const handlePasswordChange = async () => {
    try {
      const response = await axios.post("/api/settings/changePassword", {
        newPassword,
      });
      alert(response.data.message);
    } catch (error) {
      alert("Failed to change password");
    }
  };

  const handleToggleNotifications = async () => {
    try {
      const response = await axios.post("/api/settings/toggleNotifications", {
        notificationsEnabled: !notificationsEnabled,
      });
      setNotificationsEnabled(!notificationsEnabled);
      alert(response.data.message);
    } catch (error) {
      alert("Failed to update notification settings");
    }
  };

  return (
    <div className="settings">
      <h2>Settings</h2>

      {/* General Settings */}
      <div className="settings-section">
        <h3>General Settings</h3>
        <input
          type="text"
          placeholder="Website Name"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Contact Email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <button onClick={handleWebsiteUpdate}>Update Website Info</button>
      </div>

      {/* Security Settings */}
      <div className="settings-section">
        <h3>Security Settings</h3>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handlePasswordChange}>Change Password</button>
      </div>

      {/* Notifications Settings */}
      <div className="settings-section">
        <h3>Notifications Settings</h3>
        <label>
          Enable Email Notifications
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleToggleNotifications}
          />
        </label>
      </div>

      {/* API Key Management */}
      <div className="settings-section">
        <h3>API Key Management</h3>
        {/* Placeholder for API key management */}
        <p>Manage your third-party integrations here.</p>
      </div>
    </div>
  );
};

export default Settings;