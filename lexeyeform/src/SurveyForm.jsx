import "./Survey.css";
import React, { useState, useEffect } from 'react';

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age_group: '',
    gender: '',
    status: '',
    department: '',
    legal_situation: '',
    legal_issues: '',
    legal_guidance: '',
    learning_preference: '',
    premium_feature: '',
    biggest_challenge: '',
    suggestions: ''
  });
  
  const [otherStatusText, setOtherStatusText] = useState('');
  const [legalIssuesOtherText, setLegalIssuesOtherText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: false, message: '' });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle option card selections
  const handleOptionSelect = (fieldName, value, hasOtherInput = false) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Reset other inputs if this isn't an "Other" option
    if (!hasOtherInput) {
      if (fieldName === 'status') setOtherStatusText('');
      if (fieldName === 'legal_issues') setLegalIssuesOtherText('');
    }
  };

  // Handle form submission with CORS workaround
  // Handle form submission with Vercel serverless function
// Alternative handleSubmit function using JSONP technique
// Handle form submission with form data
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus({ success: false, error: false, message: '' });
  
  // Prepare final data
  const finalData = {
    ...formData,
    ...(formData.status === 'Other' && { other_status_text: otherStatusText }),
    ...(formData.legal_issues === 'Other' && { legal_issues_other_text: legalIssuesOtherText })
  };
  
  try {
    // Create URLSearchParams from the data
    const formDataParams = new URLSearchParams();
    for (const key in finalData) {
      if (finalData[key]) {
        formDataParams.append(key, finalData[key]);
      }
    }
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbxy_jPdGcmcknxmS9kHt5mcG7BRXdBu2n50iJrF8KyAlsdBq8h8MqS_PGbswjrQmyeGRQ/exec', {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formDataParams.toString()
    });
    
    // First, get the response as text
    const responseText = await response.text();
    
    // Then try to parse it as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", responseText);
      throw new Error("Server returned invalid JSON. Response: " + responseText.substring(0, 100));
    }
    
    if (result.status === "success") {
      setSubmitStatus({ 
        success: true, 
        error: false, 
        message: "🎉 Amazing! Your insights will help us create the legal assistant you actually want to use!" 
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        age_group: '',
        gender: '',
        status: '',
        department: '',
        legal_situation: '',
        legal_issues: '',
        legal_guidance: '',
        learning_preference: '',
        premium_feature: '',
        biggest_challenge: '',
        suggestions: ''
      });
      setOtherStatusText('');
      setLegalIssuesOtherText('');
    } else {
      throw new Error(result.message || "Submission failed");
    }
  } catch (error) {
    console.error("Error:", error);
    setSubmitStatus({ 
      success: false, 
      error: true, 
      message: `Oops! ${error.message || "Something went wrong. Let's try that again!"}` 
    });
  } finally {
    setIsSubmitting(false);
  }
};
  // Progress bar effect
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progressBar = document.getElementById('progressBar');
      if (progressBar) {
        progressBar.style.width = scrolled + '%';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="lexeye-app">
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
      <div className="progress-bar" id="progressBar"></div>
      
      <div className="container">
        <div className="hero">
          <div className="hero-content">
            <h1>LexEye</h1>
            <p className="subtitle">Your Legal Rights, Simplified</p>
            <p className="tagline">"Know Your Rights, Own Your Power"</p>
            <a href="#survey" className="cta-button">Help Us Build Something Amazing</a>
          </div>
        </div>
        
        <div className="survey-container" id="survey">
          {submitStatus.success && (
            <div className="message success-message">
              <strong>🎉 Amazing!</strong> Your insights will help us create the legal assistant you actually want to use!
            </div>
          )}
          
          {submitStatus.error && (
            <div className="message error-message">
              <strong>Oops!</strong> {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Section 1: Personal Information */}
            <div className="section">
              <div className="section-header">
                <div className="section-icon">👤</div>
                <div>
                  <div className="section-title">Let's Get To Know You</div>
                  <div className="section-description">Help us understand who we're building for</div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">What should we call you? *</label>
                <input 
                  type="text" 
                  name="name" 
                  className="input-field" 
                  placeholder="Your awesome name..." 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Your email (we promise not to spam!) *</label>
                <input 
                  type="email" 
                  name="email" 
                  className="input-field" 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Which generation are you from? *</label>
                <div className="options-grid">
                  {[
                    { value: "Under 18", text: "Under 18 - Gen Alpha 🚀" },
                    { value: "18–24", text: "18–24 - Gen Z Power ⚡" },
                    { value: "25–34", text: "25–34 - Millennial Hustle 💪" },
                    { value: "35–44", text: "35–44 - Experienced & Wise 🎯" },
                    { value: "45+", text: "45+ - Seasoned Pro 👑" }
                  ].map(option => (
                    <div 
                      key={option.value}
                      className={`option-card ${formData.age_group === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect('age_group', option.value)}
                    >
                      <div className="option-content">
                        <div className="option-radio"></div>
                        <div className="option-text">{option.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">How do you identify? *</label>
                <div className="options-grid">
                  {[
                    { value: "Male", text: "Male" },
                    { value: "Female", text: "Female" },
                    { value: "Prefer not to say", text: "Prefer not to say" }
                  ].map(option => (
                    <div 
                      key={option.value}
                      className={`option-card ${formData.gender === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect('gender', option.value)}
                    >
                      <div className="option-content">
                        <div className="option-radio"></div>
                        <div className="option-text">{option.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">What's your current vibe? *</label>
                <div className="options-grid">
                  {[
                    { value: "Student", text: "Student - Learning Mode 📚" },
                    { value: "Teacher / Academic Staff", text: "Teacher / Academic Staff - Knowledge Sharer 🎓" },
                    { value: "Professional (Job/Business)", text: "Professional - Business Mode 💼" },
                    { value: "Other", text: "Other - Tell us more! ✨", hasOther: true }
                  ].map(option => (
                    <div 
                      key={option.value}
                      className={`option-card ${formData.status === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect('status', option.value, option.hasOther)}
                    >
                      <div className="option-content">
                        <div className="option-radio"></div>
                        <div className="option-text">{option.text}</div>
                      </div>
                      {option.hasOther && formData.status === "Other" && (
                        <input 
                          type="text" 
                          className="input-field other-input" 
                          placeholder="What's your story?" 
                          value={otherStatusText}
                          onChange={(e) => setOtherStatusText(e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Your field of expertise?</label>
                <input 
                  type="text" 
                  name="department" 
                  className="input-field" 
                  placeholder="Computer Science, Law, Business, Arts, etc." 
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Section 2: Awareness & Needs */}
            <div className="section">
              <div className="section-header">
                <div className="section-icon">🎯</div>
                <div>
                  <div className="section-title">Your Legal Reality Check</div>
                  <div className="section-description">Let's understand the legal challenges you face</div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Ever been in a situation and thought "I wish I knew my rights"? *</label>
                <div className="options-grid">
                  {[
                    { value: "Yes (and I struggled a lot)", text: "Yes, and it was rough 😰" },
                    { value: "Yes (but I managed somehow)", text: "Yes, but I figured it out 🤷‍♀️" },
                    { value: "No", text: "Nope, all good so far 😎" }
                  ].map(option => (
                    <div 
                      key={option.value}
                      className={`option-card ${formData.legal_situation === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect('legal_situation', option.value)}
                    >
                      <div className="option-content">
                        <div className="option-radio"></div>
                        <div className="option-text">{option.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">What legal drama do young people face most? *</label>
                <div className="options-grid">
                  {[
                    { value: "Harassment / Cyberbullying", text: "Harassment / Cyberbullying 🛡️" },
                    { value: "Landlord & Rental Issues", text: "Landlord & Rental Issues 🏠" },
                    { value: "Police Stops / FIRs", text: "Police Stops / FIRs 🚨" },
                    { value: "Job & Workplace Problems", text: "Job & Workplace Problems 💼" },
                    { value: "Other", text: "Something else entirely 🤔", hasOther: true }
                  ].map(option => (
                    <div 
                      key={option.value}
                      className={`option-card ${formData.legal_issues === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect('legal_issues', option.value, option.hasOther)}
                    >
                      <div className="option-content">
                        <div className="option-radio"></div>
                        <div className="option-text">{option.text}</div>
                      </div>
                      {option.hasOther && formData.legal_issues === "Other" && (
                        <input 
                          type="text" 
                          className="input-field other-input" 
                          placeholder="What's the real issue?" 
                          value={legalIssuesOtherText}
                          onChange={(e) => setLegalIssuesOtherText(e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">When you need legal help, where do you turn? *</label>
                <div className="options-grid">
                  {[
                    { value: "Google/Internet Search", text: "Google University 🔍" },
                    { value: "Friends & Family", text: "Friends & Family Wisdom 👥" },
                    { value: "Lawyers/Professionals", text: "Actual Lawyers (fancy!) ⚖️" },
                    { value: "Nowhere (I usually ignore it)", text: "I just ignore it 🙈" }
                  ].map(option => (
                    <div 
                      key={option.value}
                      className={`option-card ${formData.legal_guidance === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect('legal_guidance', option.value)}
                    >
                      <div className="option-content">
                        <div className="option-radio"></div>
                        <div className="option-text">{option.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Section 3: Feature Preferences */}
            <div className="section">
              <div className="section-header">
                <div className="section-icon">🚀</div>
                <div>
                  <div className="section-title">Design Your Dream Legal App</div>
                  <div className="section-description">Help us build exactly what you want</div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">How do you like to learn about your rights? *</label>
                <div className="options-grid">
                  {[
                    { value: "Short summarized guides", text: "Quick & punchy summaries 📝" },
                    { value: "Step-by-step instructions (like tutorials)", text: "Step-by-step tutorials 📋" },
                    { value: "Videos & Infographics", text: "Videos & Visual stuff 🎥" }
                  ].map(option => (
                    <div 
                      key={option.value}
                      className={`option-card ${formData.learning_preference === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect('learning_preference', option.value)}
                    >
                      <div className="option-content">
                        <div className="option-radio"></div>
                        <div className="option-text">{option.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">If LexEye had ONE killer premium feature, what would make you go "TAKE MY MONEY!"? *</label>
                <div className="options-grid">
                  {[
                    { value: "Connect with a lawyer for consultation", text: "Direct lawyer chat 💬" },
                    { value: "Downloadable legal templates (contracts, complaints, etc.)", text: "Ready-to-use legal templates 📄" },
                    { value: "Emergency 'Know Your Rights' quick-access button", text: "Emergency rights button 🚨" },
                    { value: "Anonymous Q&A forum", text: "Anonymous Q&A community 🤝" }
                  ].map(option => (
                    <div 
                      key={option.value}
                      className={`option-card ${formData.premium_feature === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect('premium_feature', option.value)}
                    >
                      <div className="option-content">
                        <div className="option-radio"></div>
                        <div className="option-text">{option.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Section 4: Recommendations */}
            <div className="section">
              <div className="section-header">
                <div className="section-icon">💡</div>
                <div>
                  <div className="section-title">Help Us Build Better</div>
                  <div className="section-description">Your feedback is pure gold to us</div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">What's your biggest frustration when seeking legal help?</label>
                <textarea 
                  name="biggest_challenge" 
                  className="input-field textarea-field" 
                  placeholder="Tell us about that one time when you needed legal help but..."
                  value={formData.biggest_challenge}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="form-group">
                <label className="form-label">If you could design LexEye yourself, what would you add?</label>
                <textarea 
                  name="suggestions" 
                  className="input-field textarea-field" 
                  placeholder="Dream big! What would make this the legal app you actually want to use?"
                  value={formData.suggestions}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            
            <div className="submit-section">
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  "Launch LexEye Into Orbit! 🚀"
                )}
              </button>
              <p style={{ marginTop: '1rem', color: '#888', fontSize: '0.9rem' }}>
                Your insights will help us create something incredible together
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;