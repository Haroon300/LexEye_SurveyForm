import React, { useState } from "react";
import "./Survey.css";

export default function SurveyForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age_group: "",
    gender: "",
    status: "",
    department: "",
    legal_situation: "",
    legal_issues: "",
    legal_guidance: "",
    learning_preference: "",
    premium_feature: "",
    other_status_text: "",
    legal_issues_other_text: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle option card selection
  const handleOptionSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // For now just log data
    console.log("Form submitted:", formData);

    // Show success message
    setMessage({
      type: "success",
      text: "🎉 Amazing! Your insights will help us create the legal assistant you actually want to use!",
    });
  };

  return (
    <div>
      {/* Background + Floating Icons */}
      <div className="bg-animation"></div>
      <div className="floating-icons">
        <div className="floating-icon">⚖️</div>
        <div className="floating-icon">🛡️</div>
        <div className="floating-icon">📜</div>
        <div className="floating-icon">💪</div>
        <div className="floating-icon">🎯</div>
        <div className="floating-icon">⚡</div>
        <div className="floating-icon">🔥</div>
        <div className="floating-icon">✨</div>
      </div>

      <div className="container">
        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <h1>LexEye</h1>
            <p className="subtitle">Your Legal Rights, Simplified</p>
            <p className="tagline">"Know Your Rights, Own Your Power"</p>
            <a href="#survey" className="cta-button">
              Help Us Build Something Amazing
            </a>
          </div>
        </div>

        {/* Survey Form */}
        <div className="survey-container" id="survey">
          {message.type && (
            <div
              className={`message ${
                message.type === "success" ? "success-message" : "error-message"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Example Question */}
            <div className="section">
              <div className="section-header">
                <div className="section-icon">👤</div>
                <div>
                  <div className="section-title">Let's Get To Know You</div>
                  <div className="section-description">
                    Help us understand who we're building for
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">What should we call you? *</label>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  placeholder="Your awesome name..."
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Your email (we promise not to spam!) *
                </label>
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Which generation are you from? *</label>
                <div className="options-grid">
                  {["Under 18", "18–24", "25–34", "35–44", "45+"].map((opt) => (
                    <div
                      key={opt}
                      className={`option-card ${
                        formData.age_group === opt ? "selected" : ""
                      }`}
                      onClick={() => handleOptionSelect("age_group", opt)}
                    >
                      <div className="option-content">
                        <div className="option-radio"></div>
                        <div className="option-text">{opt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="submit-section">
              <button type="submit" className="submit-button">
                Submit Survey
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
