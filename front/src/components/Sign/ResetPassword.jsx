import React, { useState } from "react";
import "./styles/ResetPassword.scss";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ResetPassword = () => {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {token} = useParams();

  const handleSubmit = async (e) => {
    console.log(token);
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post("/auth/reset-password", {
        token,
        newPassword,
      });
      toast.success(response.data.message || "Password reset successful!");
      setIsSubmitting(false);
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Set a New Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter your new password"
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your new password"
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
